import { sendMessageWithKeyboard, answerCallbackQuery } from '@/lib/telegram-client';
import { getTopHolders } from '@/lib/db';
import { formatBalance, truncateAddress } from '@/bot/utils';

export async function handleLeaderboard(chatId: number, userId: number) {
  try {
    const topHolders = await getTopHolders(10);

    if (topHolders.length === 0) {
      const text = `
🏆 *Leaderboard*

No holders yet. Be the first to earn CHONK9K!

Start by:
1. 🔗 Connecting your wallet
2. 💰 Trading CHONK9K tokens
3. 📈 Swapping on ChonkPump

Your address will appear here when you connect!
`;
      await sendMessageWithKeyboard(chatId, text.trim(), [
        [{ text: '🔗 Connect Wallet', callback_data: 'connect_wallet' }],
        [{ text: '📈 Swap', callback_data: 'swap' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]);
      return;
    }

    // Build leaderboard text
    let leaderboardText = `🏆 *Top 10 CHONK9K Holders*\n\n`;

    topHolders.forEach((holder, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
      const balance = formatBalance(holder.balance as any, 2);
      const address = truncateAddress(holder.walletAddress || '', 4);
      leaderboardText += `${medal} ${address} - ${balance} CHONK9K\n`;
    });

    leaderboardText += `\n_Updated: ${new Date().toLocaleTimeString()}_`;

    await sendMessageWithKeyboard(chatId, leaderboardText, [
      [
        { text: '🔄 Refresh', callback_data: 'leaderboard' },
        { text: '📈 Swap', callback_data: 'swap' },
      ],
      [{ text: '← Back', callback_data: 'menu' }],
    ]);
  } catch (error) {
    console.error('[v0] Error in leaderboard handler:', error);
    await sendMessageWithKeyboard(
      chatId,
      '❌ Error loading leaderboard. Please try again.',
      [
        [{ text: '🔄 Retry', callback_data: 'leaderboard' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]
    );
  }
}

export async function handleLeaderboardRefresh(
  chatId: number,
  userId: number,
  queryId: string
) {
  try {
    await answerCallbackQuery(queryId);
    await handleLeaderboard(chatId, userId);
  } catch (error) {
    console.error('[v0] Error refreshing leaderboard:', error);
    await answerCallbackQuery(queryId, '❌ Error refreshing leaderboard', true);
  }
}
