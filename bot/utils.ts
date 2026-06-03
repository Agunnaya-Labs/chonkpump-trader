import TelegramBot from 'node-telegram-bot-api';

/**
 * Main menu keyboard
 */
export function getMainMenuKeyboard(): TelegramBot.InlineKeyboardButton[][] {
  return [
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
  ];
}

/**
 * Wallet connection options
 */
export function getWalletOptionsKeyboard(): TelegramBot.InlineKeyboardButton[][] {
  return [
    [{ text: '🦊 MetaMask', callback_data: 'wallet_metamask' }],
    [{ text: '📱 Telegram Wallet', callback_data: 'wallet_telegram' }],
    [{ text: '← Back', callback_data: 'menu' }],
  ];
}

/**
 * Balance menu
 */
export function getBalanceMenuKeyboard(): TelegramBot.InlineKeyboardButton[][] {
  return [
    [
      { text: '🔄 Refresh', callback_data: 'balance_refresh' },
      { text: '📈 Swap Now', callback_data: 'swap' },
    ],
    [{ text: '← Back to Menu', callback_data: 'menu' }],
  ];
}

/**
 * Portfolio menu
 */
export function getPortfolioMenuKeyboard(): TelegramBot.InlineKeyboardButton[][] {
  return [
    [
      { text: '📊 Trading History', callback_data: 'portfolio_history' },
      { text: '💰 Swap', callback_data: 'swap' },
    ],
    [{ text: '← Back to Menu', callback_data: 'menu' }],
  ];
}

/**
 * Format balance with decimals
 */
export function formatBalance(balance: string, decimals = 2): string {
  const num = parseFloat(balance);

  if (isNaN(num)) return '0.00';

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  } else {
    return num.toFixed(decimals);
  }
}

/**
 * Format number as currency
 */
export function formatNumber(value: string, decimals = 2): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Truncate Ethereum address
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format percentage change
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Get emoji for wallet mode
 */
export function getWalletModeEmoji(mode: string): string {
  switch (mode) {
    case 'metamask':
      return '🦊';
    case 'telegram_wallet':
      return '📱';
    default:
      return '❌';
  }
}

/**
 * Format error message
 */
export function formatError(error: string | Error): string {
  if (error instanceof Error) {
    return `❌ Error: ${error.message}`;
  }
  return `❌ Error: ${error}`;
}

/**
 * Format success message
 */
export function formatSuccess(message: string): string {
  return `✅ ${message}`;
}

/**
 * Format info message
 */
export function formatInfo(message: string): string {
  return `ℹ️ ${message}`;
}

/**
 * Create confirmation keyboard
 */
export function getConfirmationKeyboard(
  confirmCallback: string,
  cancelCallback: string
): TelegramBot.InlineKeyboardButton[][] {
  return [
    [
      { text: '✅ Confirm', callback_data: confirmCallback },
      { text: '❌ Cancel', callback_data: cancelCallback },
    ],
  ];
}

/**
 * Create yes/no keyboard
 */
export function getYesNoKeyboard(): TelegramBot.InlineKeyboardButton[][] {
  return [
    [
      { text: '✅ Yes', callback_data: 'yes' },
      { text: '❌ No', callback_data: 'no' },
    ],
  ];
}

/**
 * Format timestamp
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Create a code block for display
 */
export function codeBlock(text: string): string {
  return `\`\`\`\n${text}\n\`\`\``;
}

/**
 * Create bold text
 */
export function bold(text: string): string {
  return `*${text}*`;
}

/**
 * Create italic text
 */
export function italic(text: string): string {
  return `_${text}_`;
}

/**
 * Build link
 */
export function link(text: string, url: string): string {
  return `[${text}](${url})`;
}
