import { pgTable, serial, bigint, text, decimal, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Telegram Users & Wallet Management
export const telegramUsers = pgTable('telegram_users', {
  id: serial('id').primaryKey(),
  telegramId: bigint('telegram_id').unique().notNull(),
  username: text('username'),
  walletAddress: text('wallet_address'),
  walletMode: varchar('wallet_mode', { length: 20 }).default('none'), // 'metamask' | 'telegram_wallet' | 'none'
  encryptedPrivateKey: text('encrypted_private_key'), // For Telegram Wallet mode
  balance: decimal('balance', { precision: 38, scale: 18 }).default('0'),
  lastUpdated: timestamp('last_updated').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  referrerId: bigint('referrer_id'), // For referral tracking
});

// Trading History
export const trades = pgTable('trades', {
  id: serial('id').primaryKey(),
  telegramId: bigint('telegram_id').notNull(),
  fromToken: text('from_token').notNull(),
  toToken: text('to_token').notNull(),
  amountIn: decimal('amount_in', { precision: 38, scale: 18 }).notNull(),
  amountOut: decimal('amount_out', { precision: 38, scale: 18 }).notNull(),
  txHash: text('tx_hash'),
  status: varchar('status', { length: 20 }).default('pending'), // 'pending' | 'success' | 'failed'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Balance Cache for Performance
export const balanceCache = pgTable('balance_cache', {
  id: serial('id').primaryKey(),
  telegramId: bigint('telegram_id').unique().notNull(),
  balance: decimal('balance', { precision: 38, scale: 18 }).notNull(),
  tokenSymbol: text('token_symbol').default('CHONK9K'),
  lastUpdated: timestamp('last_updated').defaultNow(),
});

// Referral Earnings
export const referralEarnings = pgTable('referral_earnings', {
  id: serial('id').primaryKey(),
  referrerId: bigint('referrer_id').notNull(),
  refereeId: bigint('referee_id').notNull(),
  earnings: decimal('earnings', { precision: 38, scale: 18 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const telegramUsersRelations = relations(telegramUsers, ({ many, one }) => ({
  trades: many(trades),
  balanceCache: one(balanceCache),
  referrals: many(referralEarnings, { relationName: 'referrer' }),
  referredBy: one(telegramUsers, {
    fields: [telegramUsers.referrerId],
    references: [telegramUsers.telegramId],
  }),
}));

export const tradesRelations = relations(trades, ({ one }) => ({
  user: one(telegramUsers, {
    fields: [trades.telegramId],
    references: [telegramUsers.telegramId],
  }),
}));

export const referralEarningsRelations = relations(referralEarnings, ({ one }) => ({
  referrer: one(telegramUsers, {
    fields: [referralEarnings.referrerId],
    references: [telegramUsers.telegramId],
    relationName: 'referrer',
  }),
}));
