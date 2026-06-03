import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  telegramUsers,
  trades,
  balanceCache,
  referralEarnings,
  telegramUsersRelations,
  tradesRelations,
  referralEarningsRelations,
} from './db-schema';
import { eq, desc, and, asc, gt } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Create PostgreSQL connection
const client = postgres(DATABASE_URL);
export const db = drizzle(client, {
  schema: {
    telegramUsers,
    trades,
    balanceCache,
    referralEarnings,
    telegramUsersRelations,
    tradesRelations,
    referralEarningsRelations,
  },
});

// User Management
export async function getOrCreateUser(
  telegramId: bigint | number,
  username?: string
) {
  const id = BigInt(telegramId);
  const existing = await db.query.telegramUsers.findFirst({
    where: eq(telegramUsers.telegramId, id),
  });

  if (existing) {
    return existing;
  }

  const newUser = await db
    .insert(telegramUsers)
    .values({
      telegramId: id,
      username,
      walletMode: 'none',
    })
    .returning();

  return newUser[0];
}

export async function updateUserWallet(
  telegramId: bigint | number,
  walletAddress: string,
  walletMode: 'metamask' | 'telegram_wallet' = 'metamask'
) {
  return db
    .update(telegramUsers)
    .set({
      walletAddress,
      walletMode,
      updatedAt: new Date(),
    })
    .where(eq(telegramUsers.telegramId, BigInt(telegramId)))
    .returning();
}

export async function updateEncryptedPrivateKey(
  telegramId: bigint | number,
  encryptedKey: string
) {
  return db
    .update(telegramUsers)
    .set({
      encryptedPrivateKey: encryptedKey,
      walletMode: 'telegram_wallet',
      updatedAt: new Date(),
    })
    .where(eq(telegramUsers.telegramId, BigInt(telegramId)))
    .returning();
}

export async function getUserByTelegramId(telegramId: bigint | number) {
  return db.query.telegramUsers.findFirst({
    where: eq(telegramUsers.telegramId, BigInt(telegramId)),
  });
}

// Balance Management
export async function updateBalance(
  telegramId: bigint | number,
  balance: string
) {
  const id = BigInt(telegramId);
  
  // Update main user balance
  await db
    .update(telegramUsers)
    .set({
      balance,
      lastUpdated: new Date(),
    })
    .where(eq(telegramUsers.telegramId, id));

  // Update or create balance cache
  const existing = await db.query.balanceCache.findFirst({
    where: eq(balanceCache.telegramId, id),
  });

  if (existing) {
    return db
      .update(balanceCache)
      .set({
        balance,
        lastUpdated: new Date(),
      })
      .where(eq(balanceCache.telegramId, id))
      .returning();
  } else {
    return db
      .insert(balanceCache)
      .values({
        telegramId: id,
        balance,
        tokenSymbol: 'CHONK9K',
      })
      .returning();
  }
}

export async function getBalance(telegramId: bigint | number) {
  const user = await db.query.telegramUsers.findFirst({
    where: eq(telegramUsers.telegramId, BigInt(telegramId)),
  });
  return user?.balance || '0';
}

// Trading History
export async function recordTrade(
  telegramId: bigint | number,
  fromToken: string,
  toToken: string,
  amountIn: string,
  amountOut: string,
  txHash?: string
) {
  return db
    .insert(trades)
    .values({
      telegramId: BigInt(telegramId),
      fromToken,
      toToken,
      amountIn,
      amountOut,
      txHash,
      status: 'pending',
    })
    .returning();
}

export async function getTradingHistory(telegramId: bigint | number, limit = 10) {
  return db.query.trades.findMany({
    where: eq(trades.telegramId, BigInt(telegramId)),
    orderBy: desc(trades.createdAt),
    limit,
  });
}

export async function updateTradeStatus(
  tradeId: number,
  status: 'pending' | 'success' | 'failed',
  txHash?: string
) {
  return db
    .update(trades)
    .set({
      status,
      txHash,
      updatedAt: new Date(),
    })
    .where(eq(trades.id, tradeId))
    .returning();
}

// Leaderboard
export async function getTopHolders(limit = 10) {
  return db.query.telegramUsers.findMany({
    where: gt(telegramUsers.balance, '0'),
    orderBy: desc(telegramUsers.balance),
    limit,
  });
}

// Referrals
export async function createReferralLink(
  referrerId: bigint | number
): Promise<string> {
  const id = BigInt(referrerId);
  return `https://t.me/your_bot?start=ref_${id}`;
}

export async function trackReferral(
  referrerId: bigint | number,
  refereeId: bigint | number
) {
  const refId = BigInt(referrerId);
  const refeeId = BigInt(refereeId);

  // Update referee with referrer
  await db
    .update(telegramUsers)
    .set({
      referrerId: refId,
    })
    .where(eq(telegramUsers.telegramId, refeeId));

  return { referrerId: refId, refereeId: refeeId };
}

export async function getReferralEarnings(referrerId: bigint | number) {
  const earnings = await db.query.referralEarnings.findMany({
    where: eq(referralEarnings.referrerId, BigInt(referrerId)),
  });

  const total = earnings.reduce((sum, earning) => {
    return sum + parseFloat(earning.earnings);
  }, 0);

  return { earnings, total };
}

export async function addReferralEarning(
  referrerId: bigint | number,
  refereeId: bigint | number,
  amount: string
) {
  return db
    .insert(referralEarnings)
    .values({
      referrerId: BigInt(referrerId),
      refereeId: BigInt(refereeId),
      earnings: amount,
    })
    .returning();
}
