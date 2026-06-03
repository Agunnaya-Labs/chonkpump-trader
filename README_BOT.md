# ChonkPump Telegram Bot

Trade CHONK9K tokens directly from Telegram with real-time balance checking, instant swaps, leaderboard tracking, and referral rewards.

## Features

| Feature | Status | Description |
|---------|--------|-------------|
| 💰 Check Balance | ✅ Live | Real-time CHONK9K balance from blockchain |
| 📈 Swap Tokens | ✅ Live | Link to ChonkPump swap page with referral tracking |
| 👛 Portfolio | ✅ Live | View holdings, trading history, and P&L |
| 🏆 Leaderboard | ✅ Live | Top 10 CHONK9K holders with live updates |
| 🔌 MetaMask Connect | ✅ Live | Connect existing Ethereum wallet |
| 📱 Telegram Wallet | ✅ Live | Create encrypted wallet in Telegram |
| 💎 Referrals | ✅ Live | Share referral links and earn rewards |
| 🔄 Direct Swaps | 🔲 Coming | Execute trades without leaving Telegram |

## Tech Stack

- **Framework**: Next.js 16 + TypeScript
- **Database**: Neon PostgreSQL (Drizzle ORM)
- **Blockchain**: ethers.js v6 + Base network RPC
- **Telegram**: node-telegram-bot-api
- **Deployment**: Vercel (serverless webhook)
- **Security**: AES-256 encryption for wallet keys

## Project Structure

```
bot/
├── index.ts                    # Polling server (local development)
├── handlers/                   # Command handlers (7 total)
│   ├── start.ts               # /start command & welcome
│   ├── balance.ts             # Balance checking
│   ├── swap.ts                # Swap page links
│   ├── leaderboard.ts         # Top holders ranking
│   ├── portfolio.ts           # User portfolio & history
│   ├── connect-wallet.ts      # Wallet connection flow
│   └── referral.ts            # Referral system
└── utils.ts                    # Keyboards, formatting, utilities

lib/
├── db.ts                       # Database queries (CRUD operations)
├── db-schema.ts                # Drizzle ORM schema (4 tables)
├── blockchain.ts               # ethers.js integration
├── crypto.ts                   # Wallet encryption & signing
└── telegram-client.ts          # Telegram Bot API wrapper

app/
└── api/telegram/webhook/route.ts  # Vercel webhook endpoint

scripts/
└── setup-db.ts                 # Database schema initialization

.env.example                   # Environment template
SETUP_GUIDE.md                 # Detailed setup instructions
QUICKSTART.md                  # 5-minute quick start
DEPLOYMENT.md                  # Production deployment guide
```

## Quick Start

### 1. Get Your Bot Token

Message `@BotFather` on Telegram:
- Click `/newbot`
- Choose a name & username
- Copy your token

### 2. Create `.env.local`

```bash
cp .env.example .env.local
```

Add your token and database URL:
```env
TELEGRAM_BOT_TOKEN=your_token_here
DATABASE_URL=postgres://...
```

### 3. Start the Bot

```bash
npm run bot:dev
```

### 4. Test on Telegram

Find your bot and send `/start` - you should see the menu!

## Database Schema

4 tables (created automatically):

### telegram_users
- User accounts and wallet info
- Tracks wallet mode (MetaMask, Telegram Wallet, or none)
- Stores encrypted private keys for Telegram Wallet mode
- Caches balance for performance

### trades
- User trading history
- Tracks from/to tokens, amounts, transaction hashes
- Status tracking (pending, success, failed)

### balance_cache
- Cached balance with timestamp
- Improves performance for balance queries

### referral_earnings
- Referrer → Referee tracking
- Earnings tracking for each referral

## Handlers Overview

### `/start`
Welcome message with main menu (6 buttons):
- 💰 Balance
- 📈 Swap
- 👛 Portfolio
- 🏆 Leaderboard
- 🔗 Connect Wallet
- 💎 Referrals

### `💰 Balance`
1. Check wallet is connected
2. Query blockchain for CHONK9K balance
3. Display formatted balance
4. Offer swap or portfolio buttons

### `📈 Swap`
1. Verify wallet connection
2. Generate swap link with referral (if applicable)
3. Link to ChonkPump swap page
4. Show balance & portfolio options

### `🏆 Leaderboard`
1. Fetch top 10 holders from database
2. Display with ranking (🥇🥈🥉)
3. Show user's ranking if applicable
4. Auto-refresh every hour

### `👛 Portfolio`
1. Show connected wallet info
2. Display current balance
3. Show recent trades (last 5)
4. Display referral earnings
5. Link to blockchain explorer

### `🔗 Connect Wallet`
Two options:

**MetaMask Mode**:
- User enters Ethereum address
- Saved to database
- Can immediately check balance

**Telegram Wallet Mode**:
- Generate new keypair
- Encrypt private key with AES-256
- Store encrypted in database
- Show recovery phrase

### `💎 Referrals`
1. Generate unique referral link
2. Show referral earnings
3. Share link UI
4. Track who referred whom

## Deployment

### Local (Development)

```bash
npm run bot:dev
```

Bot polls Telegram every 100ms. Perfect for testing.

### Production (Vercel)

```bash
vercel deploy --prod
```

Sets up webhook endpoint at `/api/telegram/webhook`. Stateless and scalable.

See `DEPLOYMENT.md` for full instructions.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `TELEGRAM_BOT_TOKEN` | ✅ | Bot authentication |
| `DATABASE_URL` | ✅ | Neon PostgreSQL |
| `BASE_RPC` | ✅ | Base network endpoint |
| `NEXT_PUBLIC_CHONK_TOKEN_ADDRESS` | ✅ | CHONK9K contract |
| `TELEGRAM_WALLET_ENCRYPTION_KEY` | ✅ | Wallet encryption |
| `NEXT_PUBLIC_SWAP_PAGE_URL` | ⚠️ | Swap page link |
| `NEXT_PUBLIC_BOT_USERNAME` | ⚠️ | For referral links |

## Security

### Private Key Encryption

Telegram Wallet private keys are encrypted with AES-256:

```typescript
const encryptedKey = encryptPrivateKey(privateKey);
// Stored in DB, never plaintext
const decrypted = decryptPrivateKey(encryptedKey); // Only on use
```

### No Key Exposure

- Private keys never logged
- Encrypted immediately on generation
- Only decrypted when signing transactions
- Encryption key from `TELEGRAM_WALLET_ENCRYPTION_KEY`

### Best Practices

1. Never commit `.env.local` to git
2. Keep `TELEGRAM_BOT_TOKEN` secret
3. Generate strong `TELEGRAM_WALLET_ENCRYPTION_KEY`:
   ```bash
   openssl rand -hex 32
   ```
4. Use HTTPS only (Vercel auto-enables)
5. Rotate secrets if compromised
6. Monitor logs for suspicious activity

## API Reference

### Database Functions

```typescript
// Users
getOrCreateUser(telegramId, username)
updateUserWallet(telegramId, address, mode)
getUserByTelegramId(telegramId)

// Balance
updateBalance(telegramId, balance)
getBalance(telegramId)

// Trades
recordTrade(telegramId, fromToken, toToken, amountIn, amountOut, txHash)
getTradingHistory(telegramId, limit)

// Leaderboard
getTopHolders(limit)

// Referrals
createReferralLink(referrerId)
trackReferral(referrerId, refereeId)
getReferralEarnings(referrerId)
```

### Blockchain Functions

```typescript
// Balance
getBalance(address)
getFormattedBalance(address, decimals)

// Token Info
getTokenInfo()

// Transactions
getTransactionStatus(txHash)
getTransactionDetails(txHash)

// Utilities
isValidAddress(address)
getExplorerUrl(txHash)
getWalletExplorerUrl(address)
```

### Crypto Functions

```typescript
// Wallet
generateWallet()

// Encryption
encryptPrivateKey(privateKey)
decryptPrivateKey(encryptedKey)

// Signing
signTransaction(encryptedPrivateKey, transaction)
signMessage(encryptedPrivateKey, message)
```

## Troubleshooting

### Bot not responding?

1. Check it's running: `npm run bot:dev`
2. Verify `TELEGRAM_BOT_TOKEN` is set
3. Look for error messages in console

### Database connection fails?

1. Verify `DATABASE_URL` is correct
2. Test connection: `psql $DATABASE_URL`
3. Check network access from your IP

### Balance shows 0?

1. Make sure wallet is connected first
2. Verify you have CHONK9K tokens
3. Check wallet address is correct
4. Verify Base network is selected

### Private key decryption fails?

1. Check `TELEGRAM_WALLET_ENCRYPTION_KEY` matches what was used to encrypt
2. Verify no corruption in database
3. Check encrypted key format

## Examples

### Check Balance

```bash
# User connects wallet and clicks "💰 Balance"
# Bot queries: getBalance(walletAddress)
# Returns: "1234567890000000000" (wei)
# Formatted: "1,234.57 CHONK9K"
```

### Swap Tokens

```bash
# User clicks "📈 Swap"
# Bot generates: chonkpump.com/swap?ref=123456
# User clicks link, swaps in browser
# Returns to bot to check balance
```

### Referral

```bash
# User generates referral link
# Shares with friend: https://t.me/bot?start=ref_123456
# Friend joins with referrer_id tracked
# Future trades by friend earn referrer rewards
```

## Performance

### Caching

- Balance cache updates every check
- Leaderboard cached 1 hour
- Trade history from database

### Database Indexes

- `telegram_id` (fast user lookups)
- `referrer_id` (fast referral queries)
- Efficient trade history queries

### Scaling

For high volume:
1. Add Redis for leaderboard
2. Archive old trades
3. Increase Neon compute
4. Implement rate limiting

## Future Features

- 🔄 Direct swaps (sign & broadcast from Telegram)
- 🚨 Price alerts (notify on price changes)
- 📊 Portfolio analytics (P&L tracking)
- 🏦 Staking (lock tokens, earn rewards)
- 🤖 AI chat (natural language queries)

## Contributing

To add features:

1. Create new handler in `bot/handlers/`
2. Add database functions to `lib/db.ts` if needed
3. Register callback in `bot/index.ts` and `api/telegram/webhook/route.ts`
4. Test locally with `npm run bot:dev`
5. Deploy to Vercel when ready

## Support

- Setup help: See `SETUP_GUIDE.md`
- Quick start: See `QUICKSTART.md`
- Deployment: See `DEPLOYMENT.md`
- Errors: Check `npm run bot:dev` console output

## License

Built for ChonkPump. Use freely!

---

**Ready to trade? Start with `npm run bot:dev`! 🐷**
