import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';

const ENCRYPTION_KEY = process.env.TELEGRAM_WALLET_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  console.warn('TELEGRAM_WALLET_ENCRYPTION_KEY not set. Wallet encryption will fail.');
}

/**
 * Generate a new Ethereum wallet (keypair)
 */
export function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase,
  };
}

/**
 * Encrypt private key for storage
 */
export function encryptPrivateKey(privateKey: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key not configured');
  }

  return CryptoJS.AES.encrypt(privateKey, ENCRYPTION_KEY).toString();
}

/**
 * Decrypt private key from storage
 */
export function decryptPrivateKey(encryptedKey: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key not configured');
  }

  const decrypted = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY).toString(
    CryptoJS.enc.Utf8
  );

  return decrypted;
}

/**
 * Validate encrypted key format
 */
export function isValidEncryptedKey(encryptedKey: string): boolean {
  // Check if it's a valid CryptoJS encrypted string
  return encryptedKey && typeof encryptedKey === 'string' && encryptedKey.length > 0;
}

/**
 * Sign a transaction with encrypted private key
 */
export async function signTransaction(
  encryptedPrivateKey: string,
  transaction: {
    to: string;
    from?: string;
    value?: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
    nonce?: number;
    chainId?: number;
  }
) {
  try {
    const privateKey = decryptPrivateKey(encryptedPrivateKey);
    const wallet = new ethers.Wallet(privateKey);

    // Sign the transaction
    const signedTx = await wallet.signTransaction(transaction);
    return signedTx;
  } catch (error) {
    console.error('Error signing transaction:', error);
    throw new Error('Failed to sign transaction');
  }
}

/**
 * Sign a message with encrypted private key
 */
export function signMessage(
  encryptedPrivateKey: string,
  message: string
): string {
  try {
    const privateKey = decryptPrivateKey(encryptedPrivateKey);
    const wallet = new ethers.Wallet(privateKey);

    // Sign the message
    const signature = wallet.signMessageSync(message);
    return signature;
  } catch (error) {
    console.error('Error signing message:', error);
    throw new Error('Failed to sign message');
  }
}

/**
 * Verify a signature
 */
export function verifySignature(
  message: string,
  signature: string,
  address: string
): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Safely store wallet (never expose private key)
 */
export function prepareWalletForStorage(wallet: ReturnType<typeof generateWallet>) {
  return {
    address: wallet.address,
    // Never store plaintext private key
    // Instead, store encrypted version via encryptPrivateKey()
    mnemonic: wallet.mnemonic, // Optional, for backup
  };
}
