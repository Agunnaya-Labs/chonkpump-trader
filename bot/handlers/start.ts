import { sendMessageWithKeyboard, answerCallbackQuery } from '@/lib/telegram-client';
import { getOrCreateUser, trackReferral } from '@/lib/db';
import { getMainMenuKeyboard } from '@/bot/utils';

export async function handleStart(
  chatId: number,
  userId: number,
  args?: string
) {
  try {
    // Get or create user in database
    const user = await getOrCreateUser(userId);

    // Handle referral parameter if present
    if (args && args.startsWith('ref_')) {
      const referrerId = BigInt(args.replace('ref_', ''));
      try {
        await trackReferral(referrerId, userId);
        console.log(`[v0] User ${userId} referred by ${referrerId}`);
      } catch (error) {
        console.error(`[v0] Referral tracking error:`, error);
      }
    }

    const welcomeText = `
🐷 *Welcome to ChonkPump Bot!*

Trade CHONK9K tokens directly from Telegram.

*Features:*
💰 Check your real-time balance
📈 Swap tokens instantly
👛 View your portfolio
🏆 See leaderboard of top holders
🔗 Connect your MetaMask wallet
📱 Create a Telegram Wallet
💎 Earn referral rewards

*What would you like to do?*
`;

    await sendMessageWithKeyboard(chatId, welcomeText.trim(), getMainMenuKeyboard());
  } catch (error) {
    console.error('[v0] Error in /start handler:', error);
    await sendMessageWithKeyboard(
      chatId,
      '❌ Error starting bot. Please try again.',
      getMainMenuKeyboard()
    );
  }
}

export async function handleCallbackMenuSelect(
  chatId: number,
  queryId: string,
  data: string
) {
  try {
    if (data === 'menu') {
      const text = `
🐷 *ChonkPump Bot - Main Menu*

Choose an option:
`;
      await sendMessageWithKeyboard(
        chatId,
        text.trim(),
        getMainMenuKeyboard()
      );
      await answerCallbackQuery(queryId);
    }
  } catch (error) {
    console.error('[v0] Error in menu callback:', error);
    await answerCallbackQuery(queryId, '❌ Error processing request', true);
  }
}
