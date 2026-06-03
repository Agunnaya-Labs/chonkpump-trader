import { ethers } from 'ethers';

const BASE_RPC = process.env.BASE_RPC || 'https://mainnet.base.org';
const CHONK_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CHONK_TOKEN_ADDRESS;

if (!CHONK_TOKEN_ADDRESS) {
  console.warn('NEXT_PUBLIC_CHONK_TOKEN_ADDRESS is not set. Blockchain queries will fail.');
}

// ERC20 ABI (minimal)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
];

// Provider for Base network
const provider = new ethers.JsonRpcProvider(BASE_RPC);

/**
 * Validate if address is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Get CHONK9K balance for a wallet address
 */
export async function getBalance(walletAddress: string): Promise<string> {
  if (!CHONK_TOKEN_ADDRESS || !isValidAddress(walletAddress)) {
    return '0';
  }

  try {
    const contract = new ethers.Contract(
      CHONK_TOKEN_ADDRESS,
      ERC20_ABI,
      provider
    );

    const balance = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();

    // Convert from wei to readable format
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
}

/**
 * Get formatted balance with symbol
 */
export async function getFormattedBalance(
  walletAddress: string,
  decimals = 2
): Promise<string> {
  const balance = await getBalance(walletAddress);
  const num = parseFloat(balance);
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  } else {
    return num.toFixed(decimals);
  }
}

/**
 * Get top holders (simulated - in production, use blockchain indexer like Covalent)
 * For now, this would be mocked or fetch from a holder list
 */
export async function getTopHolders(limit = 10): Promise<
  Array<{ address: string; balance: string; formattedBalance: string }>
> {
  // TODO: Integrate with Covalent API or similar indexer
  // For now, return empty array - this will be replaced with real data
  try {
    // Placeholder: In production, query a holder indexer
    return [];
  } catch (error) {
    console.error('Error fetching top holders:', error);
    return [];
  }
}

/**
 * Get token info
 */
export async function getTokenInfo(): Promise<{
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}> {
  if (!CHONK_TOKEN_ADDRESS) {
    throw new Error('Token address not configured');
  }

  try {
    const contract = new ethers.Contract(
      CHONK_TOKEN_ADDRESS,
      ERC20_ABI,
      provider
    );

    const [name, symbol, decimals, supply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
    ]);

    return {
      name,
      symbol,
      decimals,
      supply: ethers.formatUnits(supply, decimals),
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    throw error;
  }
}

/**
 * Check if transaction hash is valid
 */
export async function getTransactionStatus(
  txHash: string
): Promise<'pending' | 'success' | 'failed' | 'not_found'> {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return 'pending';
    }

    return receipt.status === 1 ? 'success' : 'failed';
  } catch (error) {
    console.error('Error checking transaction:', error);
    return 'not_found';
  }
}

/**
 * Get transaction details
 */
export async function getTransactionDetails(txHash: string) {
  try {
    const [tx, receipt] = await Promise.all([
      provider.getTransaction(txHash),
      provider.getTransactionReceipt(txHash),
    ]);

    return {
      hash: tx?.hash,
      from: tx?.from,
      to: tx?.to,
      value: tx?.value ? ethers.formatEther(tx.value) : '0',
      gasPrice: tx?.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : '0',
      status: receipt?.status === 1 ? 'success' : 'failed',
      blockNumber: receipt?.blockNumber,
      confirmations: receipt ? await provider.getBlockNumber() - receipt.blockNumber : 0,
    };
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null;
  }
}

/**
 * Get Base chain explorer URL
 */
export function getExplorerUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}

/**
 * Get wallet explorer URL
 */
export function getWalletExplorerUrl(address: string): string {
  return `https://basescan.org/address/${address}`;
}
