# ChonkPump Bot - 5 Minute Quick Start

## 1️⃣ Get Bot Token (2 min)

1. Open Telegram → Search `@BotFather`
2. Click `/newbot` → Name it → Get username
3. Copy the token

## 2️⃣ Set Up Environment (1 min)

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
TELEGRAM_BOT_TOKEN=paste_your_token_here
DATABASE_URL=your_neon_postgres_url
NEXT_PUBLIC_CHONK_TOKEN_ADDRESS=0x9D4aE97e7b0B0D49D83Fb10F5Fef75E80C8bDC1
BASE_RPC=https://mainnet.base.org
TELEGRAM_WALLET_ENCRYPTION_KEY=openssl rand -hex 32
```

Generate encryption key:
```bash
openssl rand -hex 32
```

## 3️⃣ Start Bot (1 min)

```bash
npm run bot:dev
```

See:
```
[v0] Starting ChonkPump Telegram Bot (polling mode)...
[v0] Bot handlers registered. Listening for updates...
```

## 4️⃣ Test (1 min)

1. Open Telegram
2. Search your bot username
3. Click `/start`
4. See the menu ✅

## ✅ Done!

Your bot is live. Features:
- 💰 Check balance (connect wallet first)
- 📈 Swap tokens (links to ChonkPump)
- 👛 Portfolio (view holdings & history)
- 🏆 Leaderboard (top 10 holders)
- 💎 Referrals (earn rewards)

## Deploy to Production

When ready for production:

```bash
vercel deploy --prod
```

Then set webhook in @BotFather with your Vercel URL.

## Common Issues

| Error | Fix |
|-------|-----|
| `TELEGRAM_BOT_TOKEN not set` | Add token to `.env.local` |
| `DATABASE_URL not set` | Add Neon URL to `.env.local` |
| Bot doesn't respond | Run `npm run bot:dev` again |
| Balance shows 0 | Connect wallet first via bot menu |

## Need Help?

See `SETUP_GUIDE.md` for detailed instructions.

---

**That's it! You're ready to trade CHONK9K on Telegram! 🐷**
