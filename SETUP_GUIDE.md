# ChonkPump Telegram Bot - Setup Guide

Complete setup instructions for the ChonkPump trading bot on Telegram.

## Prerequisites

- Node.js 18+ and npm installed
- Telegram Bot Token from @BotFather
- Neon PostgreSQL database
- CHONK9K token contract address on Base network

## Step 1: Get Your Telegram Bot Token

1. Open Telegram and search for `@BotFather`
2. Click `/newbot`
3. Choose a name (e.g., "ChonkPump Bot")
4. Choose a username (e.g., "chonkpump_bot")
5. Copy your bot token - you'll need it next

**Important**: Don't share your bot token with anyone!

## Step 2: Set Up Environment Variables

### Create `.env.local` file

```bash
cp .env.example .env.local
```

### Edit `.env.local` and add your values:

```env
# Required
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_FROM_BOTFATHER
DATABASE_URL=your_neon_postgres_url
BASE_RPC=https://mainnet.base.org
NEXT_PUBLIC_CHONK_TOKEN_ADDRESS=0x9D4aE97e7b0B0D49D83Fb10F5Fef75E80C8bDC1

# Optional but recommended
NEXT_PUBLIC_SWAP_PAGE_URL=https://chonkpump.com/swap
NEXT_PUBLIC_BOT_USERNAME=chonkpump_bot

# For Telegram Wallet encryption (generate with: openssl rand -hex 32)
TELEGRAM_WALLET_ENCRYPTION_KEY=your_32_character_hex_string_here
```

### Generate Encryption Key (for Telegram Wallet)

```bash
openssl rand -hex 32
```

Copy the output and paste into `TELEGRAM_WALLET_ENCRYPTION_KEY`

## Step 3: Set Up Database

The database schema will be created automatically on first run, but you can also set it up manually:

```bash
npm run setup:db
```

This creates 4 tables:
- `telegram_users` - Store user accounts and wallet info
- `trades` - Track trading history
- `balance_cache` - Cache balances for performance
- `referral_earnings` - Track referral rewards

## Step 4: Run the Bot

### Option A: Local Development (Polling)

Perfect for testing:

```bash
npm run bot:dev
```

This runs the bot in polling mode (it checks Telegram for updates every 100ms).

You should see:
```
[v0] Starting ChonkPump Telegram Bot (polling mode)...
[v0] Bot handlers registered. Listening for updates...
```

### Option B: Production (Vercel Webhook)

For production deployment:

1. Deploy to Vercel:
```bash
npm install -g vercel
vercel deploy --prod
```

2. Set environment variables in Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add all variables from `.env.example`

3. Get your webhook URL:
```
https://yourdomain.vercel.app/api/telegram/webhook
```

4. Set webhook in @BotFather:
   - Message `@BotFather`
   - Select your bot
   - Click `/setwebhook`
   - Enter: `https://yourdomain.vercel.app/api/telegram/webhook`

## Step 5: Test the Bot

1. Open Telegram
2. Search for your bot (e.g., @chonkpump_bot)
3. Click `/start`
4. You should see the welcome menu

### Test Wallet Connection

1. Get your Ethereum wallet address
2. Click "🔗 Connect Wallet"
3. Choose "🦊 MetaMask"
4. Paste your wallet address
5. Click "💰 Check Balance"

### Test Telegram Wallet

1. Click "🔗 Connect Wallet"
2. Choose "📱 Telegram Wallet"
3. A new wallet will be created and encrypted
4. Save the recovery phrase somewhere safe

## Features

| Feature | Status | How to Use |
|---------|--------|-----------|
| 💰 Check Balance | ✅ Ready | Click "💰 Balance" button |
| 📈 Swap Tokens | ✅ Ready | Click "📈 Swap" button for link |
| 👛 Portfolio | ✅ Ready | Click "👛 Portfolio" to see holdings |
| 🏆 Leaderboard | ✅ Ready | Click "🏆 Leaderboard" for top holders |
| 🔗 MetaMask Connect | ✅ Ready | Connect existing wallet |
| 📱 Telegram Wallet | ✅ Ready | Create new encrypted wallet |
| 💎 Referrals | ✅ Ready | Get referral link and share |
| 🔄 Direct Swaps | 🔲 Coming | Will execute trades in Telegram |

## Troubleshooting

### Bot not responding?

Check if it's running:
```bash
npm run bot:dev
```

Watch for error messages. Common issues:
- `TELEGRAM_BOT_TOKEN is not set` → Add token to `.env.local`
- `DATABASE_URL is not set` → Add database URL to `.env.local`
- Connection timeout → Check internet connection

### Database errors?

Test connection:
```bash
psql $DATABASE_URL
```

Should connect successfully. If not, check DATABASE_URL in `.env.local`.

### Balance shows 0?

1. Wallet must be connected first
2. Make sure you have CHONK9K tokens
3. Verify wallet address is correct
4. Check Base network is correct

### Webhook not working?

1. Check webhook URL is correct in @BotFather
2. Verify Vercel deployment succeeded
3. Check Vercel logs for errors
4. Make sure environment variables are set

## Project Structure

```
├── bot/
│   ├── index.ts                    # Polling bot server
│   ├── handlers/                   # Command handlers
│   │   ├── start.ts               # /start command
│   │   ├── balance.ts             # Balance checking
│   │   ├── swap.ts                # Swap links
│   │   ├── leaderboard.ts         # Top holders
│   │   ├── portfolio.ts           # User portfolio
│   │   ├── connect-wallet.ts      # Wallet connection
│   │   └── referral.ts            # Referral system
│   └── utils.ts                    # Formatting utilities
├── lib/
│   ├── db.ts                       # Database queries
│   ├── db-schema.ts                # Drizzle schema
│   ├── blockchain.ts               # ethers.js integration
│   ├── crypto.ts                   # Encryption for wallets
│   └── telegram-client.ts          # Telegram API wrapper
├── app/
│   ├── api/telegram/webhook/route.ts  # Vercel webhook
│   └── layout.tsx                  # Root layout
├── scripts/
│   └── setup-db.ts                 # Database setup
├── .env.example                    # Environment template
├── .env.local                      # Your secrets (git-ignored)
└── package.json                    # Dependencies & scripts
```

## Environment Variables Reference

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| TELEGRAM_BOT_TOKEN | ✅ | 123456:ABC-DEF... | Telegram bot authentication |
| DATABASE_URL | ✅ | postgresql://... | Neon database connection |
| BASE_RPC | ✅ | https://mainnet.base.org | Base network RPC endpoint |
| NEXT_PUBLIC_CHONK_TOKEN_ADDRESS | ✅ | 0x9D4a... | CHONK9K token contract |
| NEXT_PUBLIC_SWAP_PAGE_URL | ⚠️ | https://chonkpump.com/swap | Swap page link |
| NEXT_PUBLIC_BOT_USERNAME | ⚠️ | chonkpump_bot | Bot username for links |
| TELEGRAM_WALLET_ENCRYPTION_KEY | ✅ | abc123... | Encryption for private keys |
| NODE_ENV | (auto) | production | Environment type |
| VERCEL_URL | (auto) | yourdomain.vercel.app | Vercel URL (auto-set) |

## Next Steps

### For Development

1. Test all commands locally
2. Verify database is saving data
3. Check balance updates work
4. Test wallet connections

### For Production

1. Deploy to Vercel
2. Set webhook URL in @BotFather
3. Monitor logs for errors
4. Set up error tracking (Sentry, etc.)

### Feature Additions

1. **Direct Swaps**: Implement transaction signing for Telegram Wallet mode
2. **Price Alerts**: Notify users when CHONK hits certain prices
3. **Portfolio P&L**: Calculate gains/losses on holdings
4. **Admin Dashboard**: Monitor bot usage and transactions

## Support

- Check console logs for debugging: `npm run bot:dev`
- Verify all environment variables are set
- Test database connection with: `psql $DATABASE_URL`
- Check @BotFather settings match deployment mode

## Security Best Practices

⚠️ **Never commit `.env.local` to git**

1. Add `.env.local` to `.gitignore` (already done)
2. Keep TELEGRAM_BOT_TOKEN secret
3. Keep TELEGRAM_WALLET_ENCRYPTION_KEY safe
4. Rotate secrets if compromised
5. Use HTTPS only for webhook (Vercel auto-enables this)

## License

Built for ChonkPump. Use freely!

---

**Happy trading! 🐷**
