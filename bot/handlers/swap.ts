import { sendMessageWithKeyboard, answerCallbackQuery } from '@/lib/telegram-client';
import { getUserByTelegramId } from '@/lib/db';
import { truncateAddress } from '@/bot/utils';

const SWAP_PAGE_URL = process.env.NEXT_PUBLIC_SWAP_PAGE_URL || 'https://chonkpump.com/swap';

export async function handleSwap(chatId: number, userId: number) {
  try {
    const user = await getUserByTelegramId(userId);

    if (!user || user.walletMode === 'none' || !user.walletAddress) {
      const text = `
❌ *Connect a wallet first*

You need to connect a wallet to trade.

🦊 *MetaMask* - Use your existing wallet
📱 *Telegram Wallet* - Create a new wallet

Connect now to start swapping!
`;
      await sendMessageWithKeyboard(chatId, text.trim(), [
        [{ text: '🔗 Connect Wallet', callback_data: 'connect_wallet' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]);
      return;
    }

    // Build swap URL with referral parameter if available
    let swapUrl = SWAP_PAGE_URL;
    if (user.referrerId) {
      swapUrl = `${SWAP_PAGE_URL}?ref=${user.referrerId}`;
    }

    const walletEmoji = user.walletMode === 'metamask' ? '🦊' : '📱';

    const text = `
📈 *Ready to Swap?*

*Active Wallet:* ${walletEmoji} ${truncateAddress(user.walletAddress!)}

Click the button below to open the ChonkPump swap page. You can trade CHONK9K for any token on the Base network.

${user.referrerId ? `*Bonus:* You\'re earning referral rewards on this swap! 💎` : ''}
`;

    await sendMessageWithKeyboard(chatId, text.trim(), [
      [
        {
          text: '🔄 Open Swap Page',
          url: swapUrl,
        },
      ],
      [
        { text: '💰 Check Balance', callback_data: 'balance' },
        { text: '← Back', callback_data: 'menu' },
      ],
    ]);
  } catch (error) {
    console.error('[v0] Error in swap handler:', error);
    await sendMessageWithKeyboard(
      chatId,
      '❌ Error loading swap page. Please try again.',
      [
        [{ text: '🔄 Retry', callback_data: 'swap' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]
    );
  }
}

export async function handleSwapCallback(
  chatId: number,
  userId: number,
  queryId: string
) {
  try {
    await answerCallbackQuery(queryId, 'Opening swap page...');
    await handleSwap(chatId, userId);
  } catch (error) {
    console.error('[v0] Error in swap callback:', error);
    await answerCallbackQuery(queryId, '❌ Error loading swap', true);
  }
}
