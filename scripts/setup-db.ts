import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import {
  telegramUsers,
  trades,
  balanceCache,
  referralEarnings,
} from '@/lib/db-schema';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

async function setupDatabase() {
  console.log('[v0] Setting up ChonkPump database schema...');

  try {
    const client = postgres(DATABASE_URL);
    const db = drizzle(client);

    // Create tables using Drizzle ORM schema
    // Note: In a real setup, you'd use Drizzle migrations
    // For now, we'll create raw SQL tables

    const sql = postgres(DATABASE_URL);

    // Drop existing tables (optional - for development)
    // await sql`DROP TABLE IF EXISTS referral_earnings CASCADE;`;
    // await sql`DROP TABLE IF EXISTS balance_cache CASCADE;`;
    // await sql`DROP TABLE IF EXISTS trades CASCADE;`;
    // await sql`DROP TABLE IF EXISTS telegram_users CASCADE;`;

    console.log('[v0] Creating telegram_users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS telegram_users (
        id SERIAL PRIMARY KEY,
        telegram_id BIGINT UNIQUE NOT NULL,
        username TEXT,
        wallet_address TEXT,
        wallet_mode VARCHAR(20) DEFAULT 'none',
        encrypted_private_key TEXT,
        balance DECIMAL(38, 18) DEFAULT 0,
        last_updated TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        referrer_id BIGINT
      );
    `;

    console.log('[v0] Creating trades table...');
    await sql`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        telegram_id BIGINT NOT NULL REFERENCES telegram_users(telegram_id),
        from_token TEXT NOT NULL,
        to_token TEXT NOT NULL,
        amount_in DECIMAL(38, 18) NOT NULL,
        amount_out DECIMAL(38, 18) NOT NULL,
        tx_hash TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('[v0] Creating balance_cache table...');
    await sql`
      CREATE TABLE IF NOT EXISTS balance_cache (
        id SERIAL PRIMARY KEY,
        telegram_id BIGINT UNIQUE NOT NULL REFERENCES telegram_users(telegram_id),
        balance DECIMAL(38, 18) NOT NULL,
        token_symbol TEXT DEFAULT 'CHONK9K',
        last_updated TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('[v0] Creating referral_earnings table...');
    await sql`
      CREATE TABLE IF NOT EXISTS referral_earnings (
        id SERIAL PRIMARY KEY,
        referrer_id BIGINT NOT NULL REFERENCES telegram_users(telegram_id),
        referee_id BIGINT NOT NULL REFERENCES telegram_users(telegram_id),
        earnings DECIMAL(38, 18) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('[v0] Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_telegram_users_telegram_id ON telegram_users(telegram_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_trades_telegram_id ON trades(telegram_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_referral_earnings_referrer ON referral_earnings(referrer_id);`;

    console.log('[v0] ✅ Database schema setup complete!');
    console.log('[v0] Tables created:');
    console.log('  - telegram_users');
    console.log('  - trades');
    console.log('  - balance_cache');
    console.log('  - referral_earnings');

    await sql.end();
  } catch (error) {
    console.error('[v0] Error setting up database:', error);
    process.exit(1);
  }
}

// Run setup
setupDatabase();
