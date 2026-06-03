# ChonkPump Telegram Bot - START HERE 🐷

Welcome! Your complete Telegram bot for trading CHONK9K is ready. This guide will get you started.

## Where to Go

### I Just Want to Get It Running (5 min)
→ **Read**: `QUICKSTART.md`

### I Need Detailed Setup Instructions
→ **Read**: `SETUP_GUIDE.md`

### I Want to Deploy to Production
→ **Read**: `DEPLOYMENT.md`

### I Need Step-by-Step Verification
→ **Read**: `CHECKLIST.md`

### I Want Complete Documentation
→ **Read**: `README_BOT.md` and `PROJECT_SUMMARY.md`

## The 30-Second Version

1. **Get bot token** from @BotFather on Telegram
2. **Create `.env.local`** from `.env.example`
3. **Run `npm run setup:db`** to create database tables
4. **Run `npm run bot:dev`** to start the bot
5. **Open Telegram** and send `/start` to your bot
6. **Test the features** (balance, swap, portfolio, etc.)
7. **Deploy to Vercel** when ready with `vercel deploy --prod`

## What You Have

- ✅ Full Telegram bot with 7 features
- ✅ Real-time blockchain balance checking
- ✅ Secure wallet encryption (AES-256)
- ✅ Referral system with earnings tracking
- ✅ Leaderboard of top CHONK9K holders
- ✅ Both local development and production deployment
- ✅ Complete documentation and guides

## What Each Feature Does

| Button | Does What |
|--------|-----------|
| 💰 Balance | Shows your CHONK9K balance from blockchain |
| 📈 Swap | Links to ChonkPump swap page (with referral) |
| 👛 Portfolio | Shows your holdings, trades, and earnings |
| 🏆 Leaderboard | Shows top 10 CHONK9K holders |
| 🔗 Connect Wallet | Connect MetaMask or create Telegram Wallet |
| 💎 Referrals | Get referral link and track earnings |

## Files You Need to Know About

```
START_HERE.md              ← You are here
├── QUICKSTART.md          ← 5 minute setup (next step!)
├── SETUP_GUIDE.md         ← Detailed instructions
├── CHECKLIST.md           ← Step-by-step verification
├── DEPLOYMENT.md          ← Production deployment
└── README_BOT.md          ← Full documentation
```

## Before You Start

You need:
- [ ] Telegram Bot Token (from @BotFather)
- [ ] Neon PostgreSQL database URL
- [ ] About 10 minutes of free time
- [ ] A computer with Node.js installed

## Next Step

**→ Open `QUICKSTART.md` and follow the 5 steps**

It will:
1. Get you a bot token
2. Set up your environment
3. Create the database
4. Start the bot
5. Let you test it

Takes 5 minutes total.

## The Development Flow

```
QUICKSTART.md
    ↓
npm run bot:dev
    ↓
Test on Telegram
    ↓
Everything works?
    ↓
DEPLOYMENT.md
    ↓
vercel deploy --prod
    ↓
Set webhook
    ↓
Done! 🎉
```

## Common Questions

**Q: Do I need to code?**
A: No! Everything is pre-built. Just set your environment variables.

**Q: Can I run it locally first?**
A: Yes! `npm run bot:dev` runs a local version for testing.

**Q: What if something breaks?**
A: Check the troubleshooting section in the setup guide you're reading.

**Q: Can I add features?**
A: Yes! See the "Contributing" section in README_BOT.md.

**Q: Is it secure?**
A: Yes! Private keys are AES-256 encrypted. Nothing is logged.

## Key Commands

```bash
# Setup
cp .env.example .env.local     # Create config
npm run setup:db               # Create database

# Development
npm run bot:dev                # Start bot locally

# Production
vercel deploy --prod           # Deploy to Vercel
vercel logs PROJECT_NAME       # View logs
```

## Documentation Map

If you need to find something:

| What You Need | File |
|---------------|------|
| Quick setup | QUICKSTART.md |
| Detailed setup | SETUP_GUIDE.md |
| Deployment to Vercel | DEPLOYMENT.md |
| Step-by-step checklist | CHECKLIST.md |
| Complete docs | README_BOT.md |
| Project overview | PROJECT_SUMMARY.md |
| This index | START_HERE.md |

## Ready?

→ **Open `QUICKSTART.md` now**

It will take you through 5 simple steps and you'll have a working bot!

## Need Help?

1. **Setup issues**: See `SETUP_GUIDE.md` troubleshooting
2. **Deployment issues**: See `DEPLOYMENT.md` troubleshooting
3. **Feature questions**: See `README_BOT.md`
4. **Step verification**: Use `CHECKLIST.md`

---

## The 3-Step Start (TL;DR)

```bash
# 1. Setup environment (2 min)
cp .env.example .env.local
# Edit .env.local - add TELEGRAM_BOT_TOKEN and DATABASE_URL

# 2. Create database (1 min)
npm run setup:db

# 3. Start bot (1 min)
npm run bot:dev

# Then open Telegram and send /start to your bot! ✅
```

---

**Let's build this! Open QUICKSTART.md next! 🐷**
