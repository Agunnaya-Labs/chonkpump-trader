import { sendMessage, sendMessageWithKeyboard, answerCallbackQuery } from '@/lib/telegram-client';
import { updateUserWallet, updateEncryptedPrivateKey, getUserByTelegramId } from '@/lib/db';
import { generateWallet, encryptPrivateKey } from '@/lib/crypto';
import { isValidAddress, getWalletExplorerUrl } from '@/lib/blockchain';
import { getWalletOptionsKeyboard, formatSuccess, formatError, truncateAddress } from '@/bot/utils';

export async function handleConnectWallet(chatId: number, userId: number) {
  try {
    const text = `
🔗 *Connect Your Wallet*

Choose how you want to connect:

*🦊 MetaMask*
Connect your existing MetaMask wallet to track your CHONK9K balance and swap directly.

*📱 Telegram Wallet*
Create a new secure wallet right here in Telegram. Full control, private key encrypted.

Which option would you like?
`;

    await sendMessageWithKeyboard(chatId, text.trim(), getWalletOptionsKeyboard());
  } catch (error) {
    console.error('[v0] Error in connect wallet handler:', error);
    await sendMessage(chatId, '❌ Error loading wallet options. Please try again.');
  }
}

export async function handleMetaMaskFlow(chatId: number, userId: number, queryId: string) {
  try {
    await answerCallbackQuery(queryId);

    const text = `
🦊 *Connect MetaMask*

Please enter your Ethereum wallet address (starts with 0x):

Example: \`0x742d35Cc6634C0532925a3b844Bc56E4f7A0x742d\`

Or if you prefer, you can connect through the ChonkPump app and we'll auto-detect your wallet.

Send your wallet address now:
`;

    await sendMessage(chatId, text);
    // Note: We'll handle the text message in the main bot handler
  } catch (error) {
    console.error('[v0] Error in MetaMask flow:', error);
    await answerCallbackQuery(queryId, '❌ Error starting MetaMask connection', true);
  }
}

export async function handleMetaMaskAddress(
  chatId: number,
  userId: number,
  walletAddress: string
) {
  try {
    if (!isValidAddress(walletAddress)) {
      await sendMessage(chatId, `${formatError('Invalid Ethereum address. Please try again.')}`);
      return;
    }

    // Save wallet
    await updateUserWallet(userId, walletAddress, 'metamask');

    const explorerUrl = getWalletExplorerUrl(walletAddress);
    const text = `
${formatSuccess('MetaMask wallet connected!')}

*Wallet:* ${truncateAddress(walletAddress)}

[View on BaseScan](${explorerUrl})

You can now:
💰 Check your balance
📈 Swap tokens
👛 View your portfolio

Tap 💰 Balance to get started!
`;

    await sendMessageWithKeyboard(chatId, text.trim(), [
      [{ text: '💰 Check Balance', callback_data: 'balance' }],
      [{ text: '← Back to Menu', callback_data: 'menu' }],
    ]);
  } catch (error) {
    console.error('[v0] Error saving MetaMask wallet:', error);
    await sendMessage(chatId, formatError('Failed to save wallet. Please try again.'));
  }
}

export async function handleTelegramWalletFlow(
  chatId: number,
  userId: number,
  queryId: string
) {
  try {
    await answerCallbackQuery(queryId);

    // Generate new wallet
    const newWallet = generateWallet();
    const encryptedKey = encryptPrivateKey(newWallet.privateKey);

    // Save encrypted private key
    await updateEncryptedPrivateKey(userId, encryptedKey);

    const text = `
📱 *Telegram Wallet Created!*

✅ Your new secure wallet has been created.

*Wallet Address:*
\`${newWallet.address}\`

*Security:*
- Private key encrypted and stored securely
- Only you can access your funds
- Never exposed in chat or logs

${newWallet.mnemonic ? `*Recovery Phrase (Save somewhere safe):*
\`${newWallet.mnemonic}\`` : ''}

You're all set! You can now:
💰 Check your balance
📈 Swap tokens
💎 Earn referral rewards

*Next: Fund your wallet by sending CHONK9K to your address or swapping directly!*
`;

    await sendMessageWithKeyboard(chatId, text.trim(), [
      [{ text: '💰 Check Balance', callback_data: 'balance' }],
      [{ text: '📈 Swap', callback_data: 'swap' }],
      [{ text: '← Back to Menu', callback_data: 'menu' }],
    ]);
  } catch (error) {
    console.error('[v0] Error creating Telegram wallet:', error);
    await answerCallbackQuery(
      queryId,
      '❌ Error creating wallet. Please try again.',
      true
    );
  }
}

export async function handleWalletStatus(
  chatId: number,
  userId: number,
  queryId: string
) {
  try {
    const user = await getUserByTelegramId(userId);

    if (!user) {
      await answerCallbackQuery(queryId, 'User not found', true);
      return;
    }

    if (user.walletMode === 'none') {
      const text = `
🔗 *Wallet Status*

❌ No wallet connected

Connect a wallet to start trading CHONK9K!
`;
      await sendMessageWithKeyboard(chatId, text.trim(), [
        [{ text: '🔗 Connect Wallet', callback_data: 'connect_wallet' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]);
    } else {
      const walletEmoji =
        user.walletMode === 'metamask' ? '🦊' : '📱';
      const text = `
🔗 *Wallet Status*

✅ Connected: ${walletEmoji}
*Address:* ${truncateAddress(user.walletAddress || '')}

Your wallet is ready to use!
`;
      await sendMessageWithKeyboard(chatId, text.trim(), [
        [{ text: '💰 Balance', callback_data: 'balance' }],
        [{ text: '← Back', callback_data: 'menu' }],
      ]);
    }

    await answerCallbackQuery(queryId);
  } catch (error) {
    console.error('[v0] Error checking wallet status:', error);
    await answerCallbackQuery(queryId, '❌ Error checking wallet', true);
  }
}
