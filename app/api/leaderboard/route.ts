import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

/**
 * GET /api/leaderboard?limit=10
 * Returns top CHONK9K holders with real data from database
 */
export async function GET(request: NextRequest) {
  const client = postgres(process.env.DATABASE_URL || '');

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);

    // Get top holders with real SQL query
    const topHolders = await client<Array<{
      username: string | null;
      balance: string;
      wallet_address: string | null;
      wallet_mode: string;
    }>>`
      SELECT username, balance, wallet_address, wallet_mode
      FROM telegram_users
      WHERE balance::numeric > 0
      ORDER BY balance::numeric DESC
      LIMIT ${limit}
    `;

    // Format response with ranking
    const leaderboard = topHolders.map((holder, index) => {
      const balanceNum = parseFloat(holder.balance || '0');
      const topBalance = topHolders[0] ? parseFloat(topHolders[0].balance || '0') : 0;
      return {
        rank: index + 1,
        username: holder.username || `User ${index + 1}`,
        balance: balanceNum.toFixed(2),
        balanceFormatted: formatBalance(balanceNum),
        walletAddress: holder.wallet_address || 'N/A',
        walletAddressShort: holder.wallet_address
          ? `${holder.wallet_address.slice(0, 6)}...${holder.wallet_address.slice(-4)}`
          : 'N/A',
        walletMode: holder.wallet_mode || 'unknown',
        percentageOfTop: topBalance > 0
          ? ((balanceNum / topBalance) * 100).toFixed(1)
          : '0',
      };
    });

    return NextResponse.json(
      {
        leaderboard,
        totalHolders: leaderboard.length,
        topBalance: leaderboard[0]?.balance || '0',
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
        },
      }
    );
  } catch (error) {
    console.error('[v0] Error fetching leaderboard:', error);
    // Return empty leaderboard on error
    return NextResponse.json(
      {
        leaderboard: [],
        totalHolders: 0,
        topBalance: '0',
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

/**
 * Format balance for display (K, M, B notation)
 */
function formatBalance(balance: number): string {
  if (balance >= 1000000000) {
    return `${(balance / 1000000000).toFixed(2)}B`;
  }
  if (balance >= 1000000) {
    return `${(balance / 1000000).toFixed(2)}M`;
  }
  if (balance >= 1000) {
    return `${(balance / 1000).toFixed(2)}K`;
  }
  return balance.toFixed(2);
}
