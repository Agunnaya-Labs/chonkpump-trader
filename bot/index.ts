import { bot, on, onMessage, onCallbackQuery, sendMessage } from '@/lib/telegram-client';
import { handleStart, handleCallbackMenuSelect } from '@/bot/handlers/start';
import { handleBalance, handleBalanceRefresh } from '@/bot/handlers/balance';
import { handleSwap } from '@/bot/handlers/swap';
import { handleLeaderboard, handleLeaderboardRefresh } from '@/bot/handlers/leaderboard';
import { handlePortfolio, handleTradeHistory } from '@/bot/handlers/portfolio';
import {
  handleConnectWallet,
  handleMetaMaskFlow,
  handleMetaMaskAddress,
  handleTelegramWalletFlow,
} from '@/bot/handlers/connect-wallet';
import {
  handleReferral,
  handleReferralCopy,
  handleReferralShare,
  handleReferralCallback,
} from '@/bot/handlers/referral';
import { formatError } from '@/bot/utils';

/**
 * Initialize polling bot with all handlers
 */
export function startBot() {
  console.log('[v0] Starting ChonkPump Telegram Bot (polling mode)...');

  // Handle /start command
  bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const args = match?.[1];

    if (!userId) {
      console.error('[v0] No user ID in message');
      return;
    }

    try {
      console.log(`[v0] User ${userId} started bot with args: ${args}`);
      await handleStart(chatId, userId, args);
    } catch (error) {
      console.error('[v0] Error in /start:', error);
      await sendMessage(chatId, formatError('Failed to start bot'));
    }
  });

  // Handle regular text messages (wallet addresses, etc.)
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const text = msg.text;

    if (!userId || !text || text.startsWith('/')) {
      return; // Skip commands and non-text messages
    }

    // Check if this looks like a wallet address
    if (text.startsWith('0x') && text.length === 42) {
      try {
        console.log(`[v0] User ${userId} provided wallet address`);
        await handleMetaMaskAddress(chatId, userId, text);
      } catch (error) {
        console.error('[v0] Error processing wallet address:', error);
        await sendMessage(chatId, formatError('Failed to save wallet'));
      }
    }
  });

  // Handle callback queries (button clicks)
  bot.on('callback_query', async (query) => {
    const chatId = query.message?.chat.id;
    const userId = query.from.id;
    const data = query.data;
    const queryId = query.id;
    const messageId = query.message?.message_id;

    if (!chatId || !userId || !data || !queryId) {
      console.error('[v0] Invalid callback query');
      return;
    }

    try {
      console.log(`[v0] Callback query from ${userId}: ${data}`);

      switch (data) {
        // Main menu
        case 'menu':
          await handleCallbackMenuSelect(chatId, queryId, data);
          break;

        // Balance
        case 'balance':
          await handleBalance(chatId, userId);
          await bot.answerCallbackQuery(queryId);
          break;

        case 'balance_refresh':
          await handleBalanceRefresh(chatId, userId, queryId);
          break;

        // Swap
        case 'swap':
          await handleSwap(chatId, userId);
          await bot.answerCallbackQuery(queryId);
          break;

        // Leaderboard
        case 'leaderboard':
          await handleLeaderboard(chatId, userId);
          await bot.answerCallbackQuery(queryId);
          break;

        case 'leaderboard_refresh':
          await handleLeaderboardRefresh(chatId, userId, queryId);
          break;

        // Portfolio
        case 'portfolio':
          await handlePortfolio(chatId, userId);
          await bot.answerCallbackQuery(queryId);
          break;

        case 'portfolio_history':
          await handleTradeHistory(chatId, userId, queryId);
          break;

        // Wallet connection
        case 'connect_wallet':
          await handleConnectWallet(chatId, userId);
          await bot.answerCallbackQuery(queryId);
          break;

        case 'wallet_metamask':
          await handleMetaMaskFlow(chatId, userId, queryId);
          break;

        case 'wallet_telegram':
          await handleTelegramWalletFlow(chatId, userId, queryId);
          break;

        // Referrals
        case 'referral':
          await handleReferral(chatId, userId);
          await bot.answerCallbackQuery(queryId);
          break;

        case 'referral_copy':
          await handleReferralCopy(chatId, userId, queryId);
          break;

        case 'referral_share':
          await handleReferralShare(chatId, userId, queryId);
          break;

        default:
          console.log(`[v0] Unknown callback data: ${data}`);
          await bot.answerCallbackQuery(queryId, 'Unknown action', true);
      }
    } catch (error) {
      console.error(`[v0] Error handling callback ${data}:`, error);
      try {
        await bot.answerCallbackQuery(queryId, '❌ Error processing request', true);
      } catch (e) {
        console.error('[v0] Failed to answer callback query:', e);
      }
    }
  });

  console.log('[v0] Bot handlers registered. Listening for updates...');
}

/**
 * Main entry point for polling bot
 */
if (require.main === module) {
  startBot();

  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('[v0] Shutting down bot...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('[v0] Shutting down bot...');
    process.exit(0);
  });
}

export default startBot;
