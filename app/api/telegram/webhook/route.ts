import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { handleStart } from '@/bot/handlers/start';
import { handleBalance } from '@/bot/handlers/balance';
import { handleSwap } from '@/bot/handlers/swap';
import { handleLeaderboard } from '@/bot/handlers/leaderboard';
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
} from '@/bot/handlers/referral';
import { sendMessage, bot } from '@/lib/telegram-client';
import { formatError } from '@/bot/utils';

/**
 * POST /api/telegram/webhook
 * Webhook endpoint for Telegram bot updates
 */
export async function POST(request: NextRequest) {
  try {
    const update = (await request.json()) as TelegramBot.Update;

    console.log('[v0] Received webhook update:', update.update_id);

    // Handle messages
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const userId = msg.from?.id;
      const text = msg.text;

      if (!userId) {
        return NextResponse.json({ ok: true });
      }

      // Handle /start command
      if (text?.startsWith('/start')) {
        const args = text.split(' ')[1];
        try {
          console.log(`[v0] User ${userId} started bot`);
          await handleStart(chatId, userId, args);
        } catch (error) {
          console.error('[v0] Error in /start:', error);
          await sendMessage(chatId, formatError('Failed to start bot'));
        }
      }

      // Handle wallet addresses (text messages)
      if (text?.startsWith('0x') && text.length === 42) {
        try {
          console.log(`[v0] User ${userId} provided wallet address`);
          await handleMetaMaskAddress(chatId, userId, text);
        } catch (error) {
          console.error('[v0] Error processing wallet:', error);
          await sendMessage(chatId, formatError('Failed to save wallet'));
        }
      }
    }

    // Handle callback queries (button clicks)
    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message?.chat.id;
      const userId = query.from.id;
      const data = query.data;
      const queryId = query.id;

      if (!chatId || !data) {
        return NextResponse.json({ ok: true });
      }

      try {
        console.log(`[v0] Callback query from ${userId}: ${data}`);

        switch (data) {
          // Main menu
          case 'menu':
            await sendMessage(
              chatId,
              '🐷 *ChonkPump Bot - Main Menu*\n\nChoose an option:',
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: '💰 Balance', callback_data: 'balance' },
                      { text: '📈 Swap', callback_data: 'swap' },
                    ],
                    [
                      { text: '👛 Portfolio', callback_data: 'portfolio' },
                      { text: '🏆 Leaderboard', callback_data: 'leaderboard' },
                    ],
                    [
                      { text: '🔗 Connect Wallet', callback_data: 'connect_wallet' },
                      { text: '💎 Referrals', callback_data: 'referral' },
                    ],
                  ],
                },
              }
            );
            break;

          // Balance
          case 'balance':
            await handleBalance(chatId, userId);
            break;

          case 'balance_refresh':
            await handleBalance(chatId, userId);
            break;

          // Swap
          case 'swap':
            await handleSwap(chatId, userId);
            break;

          // Leaderboard
          case 'leaderboard':
            await handleLeaderboard(chatId, userId);
            break;

          // Portfolio
          case 'portfolio':
            await handlePortfolio(chatId, userId);
            break;

          case 'portfolio_history':
            await handleTradeHistory(chatId, userId, queryId);
            break;

          // Wallet
          case 'connect_wallet':
            await handleConnectWallet(chatId, userId);
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
            break;

          case 'referral_copy':
            await handleReferralCopy(chatId, userId, queryId);
            break;

          case 'referral_share':
            await handleReferralShare(chatId, userId, queryId);
            break;

          default:
            console.log(`[v0] Unknown callback: ${data}`);
            await bot.answerCallbackQuery(queryId, 'Unknown action', true);
        }

        // Answer the callback query
        await bot.answerCallbackQuery(queryId);
      } catch (error) {
        console.error(`[v0] Error handling callback ${data}:`, error);
        try {
          await bot.answerCallbackQuery(queryId, '❌ Error processing request', true);
        } catch (e) {
          console.error('[v0] Failed to answer callback:', e);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[v0] Webhook error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/telegram/webhook
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'ChonkPump Telegram webhook is running',
  });
}
