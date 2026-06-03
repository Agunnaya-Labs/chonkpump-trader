# ChonkPump Bot - Deployment Guide

Complete instructions for deploying to production on Vercel.

## Prerequisites

- Vercel account (vercel.com)
- Telegram Bot Token from @BotFather
- Neon PostgreSQL database with schema set up
- CHONK9K contract address on Base network
- 32-character encryption key (from `openssl rand -hex 32`)

## Step 1: Deploy to Vercel

### Option A: Via Vercel CLI

```bash
npm install -g vercel
vercel deploy --prod
```

### Option B: Via GitHub

1. Push code to GitHub
2. Connect repo in Vercel dashboard
3. Vercel auto-deploys on push

### Option C: Via Vercel Dashboard

1. Go to vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Click "Deploy"

## Step 2: Set Environment Variables

After deployment, add environment variables in Vercel:

1. Go to Project Settings → Environment Variables
2. Add each variable from `.env.example`:

```
TELEGRAM_BOT_TOKEN=your_bot_token
DATABASE_URL=your_neon_postgres_url
BASE_RPC=https://mainnet.base.org
NEXT_PUBLIC_CHONK_TOKEN_ADDRESS=0x9D4aE97e7b0B0D49D83Fb10F5Fef75E80C8bDC1
NEXT_PUBLIC_SWAP_PAGE_URL=https://chonkpump.com/swap
NEXT_PUBLIC_BOT_USERNAME=chonkpump_bot
TELEGRAM_WALLET_ENCRYPTION_KEY=your_32_char_hex_string
NODE_ENV=production
```

3. Click "Save" and redeploy

## Step 3: Get Your Webhook URL

After successful deployment, your webhook URL is:

```
https://YOUR_VERCEL_DOMAIN.vercel.app/api/telegram/webhook
```

Example:
```
https://chonkpump-bot.vercel.app/api/telegram/webhook
```

## Step 4: Set Webhook in Telegram

1. Open Telegram → Search `@BotFather`
2. Find your bot in the list
3. Click `/setwebhook`
4. Paste your webhook URL when prompted

Alternative via API:
```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -F "url=https://YOUR_DOMAIN/api/telegram/webhook"
```

## Step 5: Verify Webhook

Test that webhook is working:

```bash
curl https://YOUR_VERCEL_DOMAIN.vercel.app/api/telegram/webhook
```

Should return:
```json
{
  "status": "ok",
  "message": "ChonkPump Telegram webhook is running"
}
```

## Step 6: Test in Telegram

1. Open Telegram
2. Find your bot
3. Send `/start`
4. You should see the welcome menu
5. Test each feature

## Monitoring

### View Logs

```bash
vercel logs YOUR_PROJECT_NAME --follow
```

### Check Webhook Status in Telegram

```bash
curl -X GET https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

Should show active connection and no errors.

## Troubleshooting

### Bot not responding after deployment

1. Check webhook is set correctly:
```bash
curl -X GET https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

2. Check environment variables in Vercel:
   - Go to Settings → Environment Variables
   - Verify all are set correctly

3. Check logs:
```bash
vercel logs YOUR_PROJECT_NAME
```

### "500 Internal Server Error"

Check logs for the specific error. Common issues:
- Missing environment variables
- Database connection failed
- Invalid token format

### Database connection fails

1. Verify DATABASE_URL is correct:
   - Should include `?sslmode=require` for Neon
   - Should be exact copy from Neon dashboard

2. Test connection:
```bash
psql $DATABASE_URL
```

### Webhook not receiving updates

1. Verify webhook URL is correct
2. Check getWebhookInfo shows no errors
3. Restart webhook:
```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -F "url=https://YOUR_DOMAIN/api/telegram/webhook"
```

## Custom Domain

To use a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration steps
4. Update @BotFather webhook to use custom domain

## Performance Optimization

### Caching

Balance checks are cached in the `balance_cache` table. Cache expires based on `last_updated` timestamp.

To customize cache TTL, edit `lib/db.ts`:
```typescript
// Example: Only refresh balance every 5 minutes
const CACHE_TTL = 5 * 60 * 1000;
```

### Database Indexes

Indexes are created on:
- `telegram_users.telegram_id` (for fast lookups)
- `trades.telegram_id` (for trade history)
- `referral_earnings.referrer_id` (for referral tracking)

## Scaling Considerations

### For High Volume

1. **Database Optimization**
   - Increase Neon compute resources
   - Add connection pooling
   - Archive old trade data

2. **Caching Layer**
   - Add Redis for leaderboard caching
   - Cache balance checks for 1-5 minutes

3. **Rate Limiting**
   - Implement per-user rate limits
   - Telegram API has built-in rate limits

4. **Error Handling**
   - Set up Sentry for error tracking
   - Monitor webhook failures

## Security Checklist

Before production:
- [ ] Never commit `.env.local` to git
- [ ] Verify DATABASE_URL has SSL enabled (`?sslmode=require`)
- [ ] Rotate TELEGRAM_WALLET_ENCRYPTION_KEY if exposed
- [ ] Use HTTPS only (Vercel auto-enables this)
- [ ] Keep bot token secret
- [ ] Monitor logs for suspicious activity
- [ ] Set up error tracking (Sentry, etc.)

## Maintenance

### Regular Tasks

1. **Monitor Database Growth**
   - Check table sizes in Neon dashboard
   - Archive old data if needed

2. **Update Dependencies**
```bash
npm update
```

3. **Review Logs**
   - Check for error patterns
   - Monitor response times

4. **Backup Database**
   - Neon auto-backups daily
   - Consider additional backups

## Rollback

If something goes wrong:

1. Revert to previous deployment:
```bash
vercel rollback
```

2. Or redeploy specific commit:
```bash
vercel deploy --prod -C <git-commit-hash>
```

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Set webhook
3. ✅ Test all features
4. Monitor logs for errors
5. Set up error tracking (optional)
6. Implement direct swaps (future feature)
7. Add price alerts (future feature)

## Support

- Check Vercel logs: `vercel logs YOUR_PROJECT_NAME`
- Test webhook: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Telegram Bot API docs: https://core.telegram.org/bots/api

---

**Deployment complete! Your bot is live! 🚀**
