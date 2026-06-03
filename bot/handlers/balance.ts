import { sendMessageWithKeyboard, answerCallbackQuery } from '@/lib/telegram-client';
import { getUserByTelegramId, updateBalance } from '@/lib/db';
import { getBalance, getFormattedBalance } from '@/lib/blockchain';
import { getBalanceMenuKeyboard } from '@/bot/utils';
import { formatBalance, truncateAddress } from '@/bot/utils';
import {
  validateWalletConnection,
  formatErrorForTelegram,
  logBotError,
  BotError,
  createBotError,
  BotErrorType,
} from '@/bot/error-handler';

export async function handleBalance(chatId: number, userId: number) {
  try {
    const user = await getUserByTelegramId(userId);

    if (!user || user.walletMode === 'none' || !user.walletAddress) {
      const text = `
❌ *No wallet connected*

You need to connect a wallet first to see your balance.

Connect via:
1. 🦊 MetaMask - Link your existing wallet
2. 📱 Telegram Wallet - Create a new secure wallet

Use the 🔗 *Connect Wallet* button to get started.
`;
      await sendMessageWithKeyboard(chatId, text.trim(), [
        [{ text: '🔗 Connect Wallet', callback_data: 'connect_wallet' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]);
      return;
    }

    // Fetch balance from blockchain
    const balance = await getBalance(user.walletAddress!);
    const formattedBalance = await getFormattedBalance(user.walletAddress!);

    // Update in database
    await updateBalance(userId, balance);

    const walletEmoji = user.walletMode === 'metamask' ? '🦊' : '📱';

    const text = `
💰 *Your CHONK9K Balance*

*Wallet:* ${walletEmoji} ${truncateAddress(user.walletAddress!)}
*Balance:* ${formattedBalance} CHONK9K
*Full Amount:* ${formatBalance(balance, 6)}

*What's next?*
`;

    await sendMessageWithKeyboard(chatId, text.trim(), getBalanceMenuKeyboard());
  } catch (error) {
    const botError = error instanceof BotError
      ? error
      : createBotError(BotErrorType.BALANCE_FETCH_FAILED, error);
    logBotError(botError, { userId, action: 'balance_fetch' });
    
    await sendMessageWithKeyboard(
      chatId,
      formatErrorForTelegram(botError),
      [
        [{ text: '🔄 Retry', callback_data: 'balance' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]
    );
  }
}

export async function handleBalanceRefresh(
  chatId: number,
  userId: number,
  queryId: string
) {
  try {
    await answerCallbackQuery(queryId);
    await handleBalance(chatId, userId);
  } catch (error) {
    console.error('[v0] Error refreshing balance:', error);
    await answerCallbackQuery(queryId, '❌ Error refreshing balance', true);
  }
}
