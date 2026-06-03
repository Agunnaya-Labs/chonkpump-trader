import { sendMessageWithKeyboard, answerCallbackQuery } from '@/lib/telegram-client';
import {
  getUserByTelegramId,
  getTradingHistory,
  getReferralEarnings,
} from '@/lib/db';
import { getWalletExplorerUrl } from '@/lib/blockchain';
import { formatBalance, truncateAddress, formatTime } from '@/bot/utils';

export async function handlePortfolio(chatId: number, userId: number) {
  try {
    const user = await getUserByTelegramId(userId);

    if (!user || user.walletMode === 'none' || !user.walletAddress) {
      const text = `
👛 *Your Portfolio*

You don't have a wallet connected yet.

Connect a wallet to:
- See your holdings
- Track trading history
- Earn referral rewards
- Monitor your positions

🔗 Click below to connect!
`;
      await sendMessageWithKeyboard(chatId, text.trim(), [
        [{ text: '🔗 Connect Wallet', callback_data: 'connect_wallet' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]);
      return;
    }

    const walletEmoji = user.walletMode === 'metamask' ? '🦊' : '📱';
    const balance = formatBalance(user.balance as any, 2);
    const walletLink = getWalletExplorerUrl(user.walletAddress);

    // Get trading history
    const trades = await getTradingHistory(userId, 5);
    const referralData = await getReferralEarnings(userId);

    let portfolioText = `
👛 *Your Portfolio*

*Wallet:* ${walletEmoji} ${truncateAddress(user.walletAddress)}
*Balance:* ${balance} CHONK9K
*Joined:* ${formatTime(new Date(user.createdAt!))}

*Recent Trades:*
${
  trades.length === 0
    ? '_No trades yet_'
    : trades
        .slice(0, 3)
        .map((t) => `• ${t.fromToken} → ${t.toToken} (${t.status})`)
        .join('\n')
}

*Referral Earnings:*
${referralData.total > 0 ? `💎 ${formatBalance(referralData.total.toString(), 2)} CHONK9K` : '_No earnings yet_'}

[View on Explorer](${walletLink})
`;

    await sendMessageWithKeyboard(chatId, portfolioText.trim(), [
      [
        { text: '📊 Trade History', callback_data: 'portfolio_history' },
        { text: '💎 Referrals', callback_data: 'referral' },
      ],
      [
        { text: '💰 Swap', callback_data: 'swap' },
        { text: '← Back', callback_data: 'menu' },
      ],
    ]);
  } catch (error) {
    console.error('[v0] Error in portfolio handler:', error);
    await sendMessageWithKeyboard(
      chatId,
      '❌ Error loading portfolio. Please try again.',
      [
        [{ text: '🔄 Retry', callback_data: 'portfolio' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]
    );
  }
}

export async function handleTradeHistory(
  chatId: number,
  userId: number,
  queryId: string
) {
  try {
    const trades = await getTradingHistory(userId, 10);

    if (trades.length === 0) {
      await answerCallbackQuery(queryId, 'No trades yet', true);
      return;
    }

    let historyText = `
📊 *Your Trading History*

`;
    trades.forEach((trade, index) => {
      const status =
        trade.status === 'success'
          ? '✅'
          : trade.status === 'failed'
            ? '❌'
            : '⏳';
      historyText += `${status} ${trade.fromToken} → ${trade.toToken}
   In: ${formatBalance(trade.amountIn as any, 4)}
   Out: ${formatBalance(trade.amountOut as any, 4)}
   ${formatTime(new Date(trade.createdAt!))}

`;
    });

    await sendMessageWithKeyboard(chatId, historyText.trim(), [
      [
        { text: '👛 Portfolio', callback_data: 'portfolio' },
        { text: '← Back', callback_data: 'menu' },
      ],
    ]);
    await answerCallbackQuery(queryId);
  } catch (error) {
    console.error('[v0] Error loading trade history:', error);
    await answerCallbackQuery(queryId, '❌ Error loading history', true);
  }
}

export async function handlePortfolioCallback(
  chatId: number,
  userId: number,
  queryId: string
) {
  try {
    await answerCallbackQuery(queryId);
    await handlePortfolio(chatId, userId);
  } catch (error) {
    console.error('[v0] Error in portfolio callback:', error);
    await answerCallbackQuery(queryId, '❌ Error loading portfolio', true);
  }
}
