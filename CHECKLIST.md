# ChonkPump Bot - Setup Checklist

Follow these steps to get your bot up and running.

## Phase 1: Before You Start

- [ ] Have Telegram Bot Token ready (from @BotFather)
- [ ] Have Neon PostgreSQL database ready
- [ ] Have CHONK9K contract address (0x9D4aE97e7b0B0D49D83Fb10F5Fef75E80C8bDC1)
- [ ] Have Base RPC endpoint (https://mainnet.base.org)

## Phase 2: Local Setup (5 minutes)

```bash
# 1. Clone/navigate to project
cd chonkpump-telegram-bot

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit .env.local with your values:
#    - TELEGRAM_BOT_TOKEN
#    - DATABASE_URL
#    - TELEGRAM_WALLET_ENCRYPTION_KEY (generate: openssl rand -hex 32)
```

## Phase 3: Database Setup (2 minutes)

```bash
# Initialize database schema
npm run setup:db

# Should print:
# [v0] Setting up ChonkPump database schema...
# [v0] ✅ Database schema setup complete!
```

- [ ] Database setup successful
- [ ] Check tables created in Neon dashboard

## Phase 4: Test Locally (5 minutes)

```bash
# Start the bot in development mode
npm run bot:dev

# Should print:
# [v0] Starting ChonkPump Telegram Bot (polling mode)...
# [v0] Bot handlers registered. Listening for updates...
```

- [ ] Bot server started without errors
- [ ] Open Telegram and find your bot
- [ ] Send `/start` command
- [ ] See the welcome menu with 6 buttons

## Phase 5: Test Features (10 minutes)

### Test Wallet Connection
- [ ] Click "🔗 Connect Wallet"
- [ ] Choose "🦊 MetaMask"
- [ ] Enter your Ethereum address (0x...)
- [ ] See confirmation message

### Test Balance Check
- [ ] Click "💰 Balance"
- [ ] Should show your wallet address
- [ ] Should show CHONK9K balance from blockchain
- [ ] See swap & portfolio options

### Test Swap
- [ ] Click "📈 Swap"
- [ ] Should see swap page link
- [ ] Link should have referral parameter if available

### Test Leaderboard
- [ ] Click "🏆 Leaderboard"
- [ ] Should show top 10 holders (may be empty if you're first)
- [ ] Your address should appear if you have balance

### Test Portfolio
- [ ] Click "👛 Portfolio"
- [ ] Should show connected wallet
- [ ] Should show balance
- [ ] Should show recent trades (may be empty)

### Test Referrals
- [ ] Click "💎 Referrals"
- [ ] Should show your unique referral link
- [ ] Should show earnings (0 if no referrals yet)

### Test Telegram Wallet (Optional)
- [ ] Click "🔗 Connect Wallet"
- [ ] Choose "📱 Telegram Wallet"
- [ ] New wallet created and encrypted
- [ ] Save recovery phrase
- [ ] Check balance with new wallet

## Phase 6: Deploy to Production (10 minutes)

```bash
# Install Vercel CLI (if not already)
npm install -g vercel

# Deploy to production
vercel deploy --prod

# Should output:
# ✓ Production: https://YOUR_DOMAIN.vercel.app
```

- [ ] Deployment successful
- [ ] Note your domain: `https://YOUR_DOMAIN.vercel.app`

### Set Environment Variables in Vercel
- [ ] Go to Vercel dashboard → Project Settings
- [ ] Click "Environment Variables"
- [ ] Add all variables from `.env.example`:
  - [ ] TELEGRAM_BOT_TOKEN
  - [ ] DATABASE_URL
  - [ ] BASE_RPC
  - [ ] NEXT_PUBLIC_CHONK_TOKEN_ADDRESS
  - [ ] NEXT_PUBLIC_SWAP_PAGE_URL
  - [ ] NEXT_PUBLIC_BOT_USERNAME
  - [ ] TELEGRAM_WALLET_ENCRYPTION_KEY
  - [ ] NODE_ENV=production
- [ ] Click "Save" and trigger redeploy

### Set Webhook in Telegram
```bash
# Get your webhook URL
https://YOUR_DOMAIN.vercel.app/api/telegram/webhook

# Set it in @BotFather:
# 1. Message @BotFather
# 2. Select your bot
# 3. Click /setwebhook
# 4. Paste: https://YOUR_DOMAIN.vercel.app/api/telegram/webhook
```

Or use curl:
```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -F "url=https://YOUR_DOMAIN.vercel.app/api/telegram/webhook"
```

- [ ] Webhook set successfully

### Verify Webhook Working
```bash
# Check webhook status
curl https://YOUR_DOMAIN.vercel.app/api/telegram/webhook

# Should return:
# {"status":"ok","message":"ChonkPump Telegram webhook is running"}
```

- [ ] Webhook endpoint responding correctly

## Phase 7: Test Production (5 minutes)

- [ ] Open Telegram
- [ ] Find your bot
- [ ] Send `/start`
- [ ] Test balance check
- [ ] Test swap link
- [ ] Test all features

## Phase 8: Monitor (Ongoing)

```bash
# View production logs
vercel logs YOUR_PROJECT_NAME --follow

# Check webhook status
curl -X GET https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo

# Should show:
# "ok": true
# "pending_update_count": 0
# "has_custom_certificate": false
```

- [ ] Monitor logs for errors
- [ ] Check webhook status regularly

## Troubleshooting

### Bot doesn't respond locally
```bash
# Check console output
npm run bot:dev

# Look for error messages
# Common: TELEGRAM_BOT_TOKEN not set
# Fix: Edit .env.local
```

### Database setup fails
```bash
# Test database connection
psql $DATABASE_URL

# If fails: Check DATABASE_URL is correct
# Should include: ?sslmode=require
```

### Production bot doesn't work
```bash
# Check Vercel logs
vercel logs YOUR_PROJECT_NAME

# Check webhook status
curl -X GET https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo

# Verify environment variables are set in Vercel dashboard
```

## File Reference

| File | Purpose |
|------|---------|
| `QUICKSTART.md` | 5-minute quick start |
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `DEPLOYMENT.md` | Production deployment |
| `README_BOT.md` | Complete documentation |
| `.env.example` | Environment variable template |
| `bot/index.ts` | Polling server for local dev |
| `app/api/telegram/webhook/route.ts` | Webhook for production |

## Success Indicators

✅ **You're done when:**

1. Bot responds to `/start` command locally
2. Can connect wallet and check balance
3. All 7 features work (balance, swap, portfolio, leaderboard, connect, referral)
4. Bot deployed to Vercel
5. Webhook set in @BotFather
6. Bot responds to `/start` on production
7. All features work on production

## Next Steps

After successful setup:

1. Share bot link with users: `https://t.me/YOUR_BOT_USERNAME`
2. Monitor logs for issues: `vercel logs`
3. Plan feature additions:
   - Direct swap execution
   - Price alerts
   - Portfolio P&L
   - Admin dashboard

## Support

- **Local issues**: Check `npm run bot:dev` output
- **Database issues**: Test with `psql $DATABASE_URL`
- **Production issues**: Check `vercel logs YOUR_PROJECT_NAME`
- **Documentation**: See `README_BOT.md`

---

**You've got this! Start with Phase 1 and work through in order. 🐷**
