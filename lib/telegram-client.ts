import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set');
}

export const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

/**
 * Send a text message
 */
export async function sendMessage(
  chatId: number | string,
  text: string,
  options?: TelegramBot.SendMessageOptions
) {
  try {
    return await bot.sendMessage(chatId, text, options);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Edit a message
 */
export async function editMessage(
  chatId: number | string,
  messageId: number,
  text: string,
  options?: TelegramBot.EditMessageTextOptions
) {
  try {
    return await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      ...options,
    });
  } catch (error) {
    console.error('Error editing message:', error);
    throw error;
  }
}

/**
 * Send a message with inline keyboard
 */
export async function sendMessageWithKeyboard(
  chatId: number | string,
  text: string,
  keyboard: TelegramBot.InlineKeyboardButton[][]
) {
  return sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
}

/**
 * Send a message with reply keyboard
 */
export async function sendMessageWithReplyKeyboard(
  chatId: number | string,
  text: string,
  keyboard: string[][],
  oneTimeKeyboard = true
) {
  return sendMessage(chatId, text, {
    reply_markup: {
      keyboard,
      one_time_keyboard: oneTimeKeyboard,
      resize_keyboard: true,
    },
  });
}

/**
 * Answer callback query
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
  showAlert = false
) {
  try {
    return await bot.answerCallbackQuery(callbackQueryId, {
      text,
      show_alert: showAlert,
    });
  } catch (error) {
    console.error('Error answering callback query:', error);
    throw error;
  }
}

/**
 * Delete message
 */
export async function deleteMessage(chatId: number | string, messageId: number) {
  try {
    return await bot.deleteMessage(chatId, messageId);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

/**
 * Get file info
 */
export async function getFile(fileId: string) {
  try {
    return await bot.getFile(fileId);
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
}

/**
 * Set webhook (for production)
 */
export async function setWebhook(webhookUrl: string) {
  try {
    return await bot.setWebHook(webhookUrl);
  } catch (error) {
    console.error('Error setting webhook:', error);
    throw error;
  }
}

/**
 * Get webhook info
 */
export async function getWebhookInfo() {
  try {
    return await bot.getWebHookInfo();
  } catch (error) {
    console.error('Error getting webhook info:', error);
    throw error;
  }
}

/**
 * Remove webhook
 */
export async function removeWebhook() {
  try {
    return await bot.removeWebHook();
  } catch (error) {
    console.error('Error removing webhook:', error);
    throw error;
  }
}

/**
 * Process update (for webhook mode)
 */
export async function processUpdate(update: TelegramBot.Update) {
  try {
    return await bot.processUpdate(update);
  } catch (error) {
    console.error('Error processing update:', error);
    throw error;
  }
}

export type BotEvent = 'message' | 'callback_query' | 'inline_query' | 'chosen_inline_result';

/**
 * Register event handler (wrapper for bot.on)
 */
export function onMessage(handler: (msg: TelegramBot.Message, match?: string[]) => void) {
  bot.onText(/\/start/, handler);
}

/**
 * Register callback query handler
 */
export function onCallbackQuery(handler: (query: TelegramBot.CallbackQuery) => void) {
  bot.on('callback_query', handler);
}

/**
 * Generic event listener
 */
export function on(event: BotEvent, handler: (...args: any[]) => void) {
  bot.on(event as any, handler);
}

/**
 * Remove listener
 */
export function removeListener(event: BotEvent, handler: (...args: any[]) => void) {
  bot.removeListener(event as any, handler);
}
