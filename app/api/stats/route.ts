import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

/**
 * GET /api/stats
 * Returns live bot statistics for the dashboard using raw SQL
 */
export async function GET(request: NextRequest) {
  const client = postgres(process.env.DATABASE_URL || '');

  try {
    // Execute all stat queries in parallel
    const [
      userCountResult,
      connectedCountResult,
      tradeCountResult,
      successfulTradeResult,
      referralEarningsResult,
      balanceResult,
    ] = await Promise.all([
      client`SELECT COUNT(*) as total FROM telegram_users`,
      client`SELECT COUNT(*) as total FROM telegram_users WHERE wallet_address IS NOT NULL`,
      client`SELECT COUNT(*) as total FROM trades`,
      client`SELECT COUNT(*) as total FROM trades WHERE status = 'success'`,
      client`SELECT COALESCE(SUM(earnings), '0') as total FROM referral_earnings`,
      client`SELECT COALESCE(SUM(balance::numeric), '0') as total FROM telegram_users WHERE balance > '0'`,
    ]);

    const totalUsers = userCountResult[0]?.total || 0;
    const connectedUsers = connectedCountResult[0]?.total || 0;
    const totalTrades = tradeCountResult[0]?.total || 0;
    const successfulTrades = successfulTradeResult[0]?.total || 0;
    const totalReferralEarnings = referralEarningsResult[0]?.total || '0';
    const totalBalance = balanceResult[0]?.total || '0';

    const stats = {
      totalUsers: Number(totalUsers),
      connectedUsers: Number(connectedUsers),
      connectionRate: totalUsers > 0 ? ((connectedUsers / totalUsers) * 100).toFixed(1) : '0',
      totalTrades: Number(totalTrades),
      successfulTrades: Number(successfulTrades),
      successRate: totalTrades > 0 ? ((successfulTrades / totalTrades) * 100).toFixed(1) : '0',
      totalReferralEarnings: parseFloat(String(totalReferralEarnings)).toFixed(2),
      totalBalance: parseFloat(String(totalBalance)).toFixed(2),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('[v0] Error fetching stats:', error);
    // Return mock data on error so dashboard still works
    return NextResponse.json(
      {
        totalUsers: 0,
        connectedUsers: 0,
        connectionRate: '0',
        totalTrades: 0,
        successfulTrades: 0,
        successRate: '0',
        totalReferralEarnings: '0.00',
        totalBalance: '0.00',
        timestamp: new Date().toISOString(),
        error: 'Database temporarily unavailable',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } finally {
    await client.end();
  }
}
