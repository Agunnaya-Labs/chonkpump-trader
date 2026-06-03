/**
 * Centralized error handling for Telegram bot
 * Provides helpful, context-aware error messages to users
 */

export enum BotErrorType {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  INVALID_WALLET = 'INVALID_WALLET',
  BALANCE_FETCH_FAILED = 'BALANCE_FETCH_FAILED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  TRADE_FAILED = 'TRADE_FAILED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  TELEGRAM_ERROR = 'TELEGRAM_ERROR',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  UNKNOWN = 'UNKNOWN',
}

export class BotError extends Error {
  constructor(
    public type: BotErrorType,
    public message: string,
    public userMessage: string, // User-friendly message for Telegram
    public suggestion?: string // Helpful suggestion
  ) {
    super(message);
    this.name = 'BotError';
  }
}

/**
 * Map errors to user-friendly messages with suggestions
 */
export function createBotError(
  type: BotErrorType,
  originalError?: any
): BotError {
  const errorMap: Record<
    BotErrorType,
    { message: string; suggestion: string }
  > = {
    [BotErrorType.WALLET_NOT_CONNECTED]: {
      message: '❌ Wallet not connected',
      suggestion:
        'Please connect a wallet first using /wallet command to enable this feature.',
    },
    [BotErrorType.INVALID_WALLET]: {
      message: '❌ Invalid wallet address',
      suggestion:
        'Please provide a valid Ethereum address (starting with 0x and 42 characters long).',
    },
    [BotErrorType.BALANCE_FETCH_FAILED]: {
      message: '❌ Could not fetch balance',
      suggestion:
        'The blockchain is temporarily busy. Try again in a few moments, or check if your wallet is on the Base network.',
    },
    [BotErrorType.INSUFFICIENT_BALANCE]: {
      message: '❌ Insufficient balance',
      suggestion:
        'You don\'t have enough CHONK9K tokens for this transaction. Buy more on ChonkPump first.',
    },
    [BotErrorType.TRADE_FAILED]: {
      message: '❌ Trade execution failed',
      suggestion:
        'The swap couldn\'t be completed. Check slippage settings and try again with a different amount.',
    },
    [BotErrorType.DATABASE_ERROR]: {
      message: '❌ System error',
      suggestion: 'Something went wrong storing your data. Our team has been notified. Please try again.',
    },
    [BotErrorType.TELEGRAM_ERROR]: {
      message: '❌ Telegram communication error',
      suggestion: 'Could not send/receive message from Telegram. Check your connection and try again.',
    },
    [BotErrorType.ENCRYPTION_ERROR]: {
      message: '❌ Encryption error',
      suggestion:
        'Your wallet encryption failed. Try resetting your wallet connection.',
    },
    [BotErrorType.RATE_LIMITED]: {
      message: '⏱️ Too many requests',
      suggestion: 'You\'re sending requests too fast. Wait a moment and try again.',
    },
    [BotErrorType.UNKNOWN]: {
      message: '❌ Unexpected error',
      suggestion:
        'Something unexpected happened. Please try again or contact support.',
    },
  };

  const error = errorMap[type] || errorMap[BotErrorType.UNKNOWN];
  return new BotError(
    type,
    originalError?.message || error.message,
    error.message,
    error.suggestion
  );
}

/**
 * Format error for display in Telegram
 */
export function formatErrorForTelegram(error: BotError | Error | unknown): string {
  if (error instanceof BotError) {
    const parts = [error.userMessage];
    if (error.suggestion) {
      parts.push(`\n\n💡 ${error.suggestion}`);
    }
    return parts.join('');
  }

  if (error instanceof Error) {
    return `❌ Error: ${error.message}\n\n💡 Please try again or contact support.`;
  }

  return '❌ An unexpected error occurred. Please try again.';
}

/**
 * Log error with context
 */
export function logBotError(
  error: BotError | Error,
  context: {
    userId: number;
    command?: string;
    action?: string;
  }
) {
  const timestamp = new Date().toISOString();
  const contextStr = Object.entries(context)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');

  if (error instanceof BotError) {
    console.error(
      `[BOT_ERROR] ${timestamp} | Type=${error.type} | ${contextStr} | ${error.message}`
    );
  } else {
    console.error(
      `[ERROR] ${timestamp} | ${contextStr} | ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Validate wallet address with helpful error
 */
export function validateWalletAddress(address: string): { valid: boolean; error?: BotError } {
  if (!address) {
    return {
      valid: false,
      error: createBotError(BotErrorType.INVALID_WALLET),
    };
  }

  if (!address.startsWith('0x')) {
    return {
      valid: false,
      error: createBotError(BotErrorType.INVALID_WALLET),
    };
  }

  if (address.length !== 42) {
    return {
      valid: false,
      error: createBotError(BotErrorType.INVALID_WALLET),
    };
  }

  return { valid: true };
}

/**
 * Validate wallet connection with helpful error
 */
export function validateWalletConnection(walletAddress?: string): {
  connected: boolean;
  error?: BotError;
} {
  if (!walletAddress) {
    return {
      connected: false,
      error: createBotError(BotErrorType.WALLET_NOT_CONNECTED),
    };
  }

  return { connected: true };
}
