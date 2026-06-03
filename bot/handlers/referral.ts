import { sendMessageWithKeyboard, answerCallbackQuery } from '@/lib/telegram-client';
import {
  getUserByTelegramId,
  getReferralEarnings,
  createReferralLink,
} from '@/lib/db';
import { formatBalance } from '@/bot/utils';

const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME || 'chonkpump_bot';

export async function handleReferral(chatId: number, userId: number) {
  try {
    const user = await getUserByTelegramId(userId);

    if (!user || user.walletMode === 'none') {
      const text = `
💎 *Referral Program*

Earn CHONK9K rewards by inviting friends!

To join:
1. 🔗 Connect your wallet
2. 💎 Get your referral link
3. Share with friends
4. 🎁 Earn rewards when they trade

Connect your wallet to get started!
`;
      await sendMessageWithKeyboard(chatId, text.trim(), [
        [{ text: '🔗 Connect Wallet', callback_data: 'connect_wallet' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]);
      return;
    }

    // Get referral data
    const referralLink = await createReferralLink(userId);
    const { total } = await getReferralEarnings(userId);

    const text = `
💎 *Your Referral Program*

Share your unique link and earn rewards!

*Your Referral Link:*
\`${referralLink}\`

*Your Earnings:*
${total > 0 ? `🎁 ${formatBalance(total.toString(), 2)} CHONK9K` : '(No earnings yet - start sharing!)'}

*How It Works:*
1️⃣ Share your link with friends
2️⃣ They join via your link
3️⃣ When they trade, you earn a % of fees
4️⃣ Rewards go directly to your wallet

*Share with:*
- Friends
- Discord communities
- Twitter/X
- Telegram groups

Let's grow together! 🚀
`;

    await sendMessageWithKeyboard(chatId, text.trim(), [
      [
        {
          text: '📋 Copy Link',
          callback_data: 'referral_copy',
        },
      ],
      [
        { text: '📤 Share', callback_data: 'referral_share' },
        { text: '← Back', callback_data: 'menu' },
      ],
    ]);
  } catch (error) {
    console.error('[v0] Error in referral handler:', error);
    await sendMessageWithKeyboard(
      chatId,
      '❌ Error loading referral info. Please try again.',
      [
        [{ text: '🔄 Retry', callback_data: 'referral' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]
    );
  }
}

export async function handleReferralCopy(
  chatId: number,
  userId: number,
  queryId: string
) {
  try {
    const referralLink = await createReferralLink(userId);

    await answerCallbackQuery(
      queryId,
      `Link copied! Share it with your friends to earn rewards.`,
      false
    );

    // Show the link in a new message for easy copying
    const text = `
📋 *Your Referral Link*

\`${referralLink}\`

Share this link with your friends and family!

When they join through your link and start trading, you'll earn rewards. 🎁
`;

    await sendMessageWithKeyboard(chatId, text.trim(), [
      [{ text: '📤 Share on Telegram', callback_data: 'referral_share' }],
      [{ text: '← Back', callback_data: 'referral' }],
    ]);
  } catch (error) {
    console.error('[v0] Error copying referral link:', error);
    await answerCallbackQuery(queryId, '❌ Error getting link', true);
  }
}

export async function handleReferralShare(
  chatId: number,
  userId: number,
  queryId: string
) {
  try {
    const referralLink = await createReferralLink(userId);

    const shareText = `
Check out ChonkPump Telegram Bot! 🐷

Trade CHONK9K directly from Telegram with real-time balance checking and instant swaps.

Join with my referral link and we both earn rewards:
${referralLink}

#ChonkPump #CHONK9K #Telegram
`;

    await answerCallbackQuery(queryId, 'Share this text with your friends!', false);

    const text = `
📤 *Share Your Link*

Copy this message and share it in chats, groups, or channels:

${shareText}

Every friend who joins through your link will give you referral rewards! 💎
`;

    await sendMessageWithKeyboard(chatId, text.trim(), [
      [{ text: '← Back', callback_data: 'referral' }],
    ]);
  } catch (error) {
    console.error('[v0] Error sharing referral:', error);
    await answerCallbackQuery(queryId, '❌ Error preparing share', true);
  }
}

export async function handleReferralCallback(
  chatId: number,
  userId: number,
  queryId: string
) {
  try {
    await answerCallbackQuery(queryId);
    await handleReferral(chatId, userId);
  } catch (error) {
    console.error('[v0] Error in referral callback:', error);
    await answerCallbackQuery(queryId, '❌ Error loading referrals', true);
  }
}
