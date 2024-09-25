// balanceChanges.js
import dotenv from 'dotenv';
import { Buffer } from 'buffer';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token';

// Call dotenv.config() after importing
dotenv.config();

const SOLANA_CONNECTION = new Connection(process.env.SOLANA_CONNECTION, 'confirmed', {
  maxSupportedTransactionVersion: 0
});

async function getOwnerOrTokenOwner(ownerPublicKey) {
  try {
    let ownerAccountInfo = await SOLANA_CONNECTION.getAccountInfo(new PublicKey(ownerPublicKey));
    if (!ownerAccountInfo) {
      // console.log("Account not found.");
      return ownerPublicKey;
    }

    // Check if the account is an SPL Token account
    if (ownerAccountInfo.owner.toBase58() === TOKEN_PROGRAM_ID.toBase58()) {
      // console.log("This is an associated token account.");
      // Fetch and return the actual owner of the token account
      const tokenAccountData = Buffer.from(ownerAccountInfo.data);
      const ownerStartIndex = 32; // Owner public key starts at byte 32 in the account data layout for SPL Token accounts
      const ownerEndIndex = ownerStartIndex + 32;
      const ownerPublicKeyBytes = tokenAccountData.slice(ownerStartIndex, ownerEndIndex);
      const ownerPublicKey = new PublicKey(ownerPublicKeyBytes).toBase58();
      return ownerPublicKey;
    } else {
      // console.log("This is an owner wallet.");
      return ownerPublicKey; // Return the input public key as it is the owner
    }
  } catch (error) {
    // console.error("Error checking account type:", error);
    return null;
  }
}

/**
 * Finds the balance changes for the owner in a Solana transaction.
 * 
 * @param {Array} accountKeys - Array of public keys involved in the transaction.
 * @param {Array} preBalances - Array of balances before the transaction, in lamports.
 * @param {Array} postBalances - Array of balances after the transaction, in lamports.
 * @param {string} owner - Public key of the owner in base58 format.
 * @returns {Object|null} Object containing the owner, preBalance, postBalance, and changeBalance if found, otherwise null.
 */

async function findOwnerBalanceChanges(accountKeys, preBalances, postBalances, owner) {
  const ownerBalanceChanges = accountKeys.map((key, index) => {
    if (key.toBase58 ? key.toBase58() === owner : key === owner) {
      return {
        owner,
        preBalance: preBalances[index] / LAMPORTS_PER_SOL,
        postBalance: postBalances[index] / LAMPORTS_PER_SOL,
        changeBalance: (postBalances[index] - preBalances[index]) / LAMPORTS_PER_SOL
      };
    }
  }).filter(Boolean)[0];

  return ownerBalanceChanges || null;
}

// Do not shown nonzero change balance
async function findAllBalanceChanges(accountKeys, preBalances, postBalances, owner, signers) {
  const balanceChanges = accountKeys.map((key, index) => {
    const pubkey = key.toBase58 ? key.toBase58() : key;
    const isOwner = pubkey === owner;
    const isSigner = signers.includes(pubkey);
    const changeBalance = (postBalances[index] - preBalances[index]) / LAMPORTS_PER_SOL;

    return {
      pubkey,
      isOwner,
      isSigner,
      preBalance: preBalances[index] / LAMPORTS_PER_SOL,
      postBalance: postBalances[index] / LAMPORTS_PER_SOL,
      changeBalance
    };
  })
    .filter(change => {
      // Keep changes that are non-zero AND (not owner AND not signer)
      return change.changeBalance !== 0 || change.isOwner || change.isSigner;
    });

  return balanceChanges;
}

async function findTokenBalanceChanges(preTokenBalances, postTokenBalances, ownerPublicKey, accountKeys) {
  if (!preTokenBalances || !postTokenBalances) {
    return []; // sometimes there are no token balance changes => handle this case
  }

  // console.log(preTokenBalances)
  // console.log(postTokenBalances)
  // Filter token balances for accounts owned by the owner
  const ownerPreTokenBalances = preTokenBalances.filter(balance => balance.owner === ownerPublicKey);
  const ownerPostTokenBalances = postTokenBalances.filter(balance => balance.owner === ownerPublicKey);

  // Create a map of postTokenBalances for quick lookup
  const postBalanceMap = new Map(ownerPostTokenBalances.map(post => [post.accountIndex, post]));

  // Map to find balance changes
  const tokenBalanceChanges = ownerPreTokenBalances.map(preBalance => {
    const postBalance = postBalanceMap.get(preBalance.accountIndex);
    if (postBalance) {
      const preAmount = preBalance.uiTokenAmount ? preBalance.uiTokenAmount.uiAmount : 0;
      const postAmount = postBalance.uiTokenAmount.uiAmount;
      const changeAmount = postAmount - preAmount;

      // Only return an object if there is a balance change
      if (changeAmount !== 0) {
        return {
          accountIndex: preBalance.accountIndex,
          account: accountKeys[preBalance.accountIndex],
          mint: preBalance.mint,
          preBalance: preAmount,
          postBalance: postAmount,
          changeBalance: changeAmount
        };
      }
    }
    return null;
  }).filter(Boolean); // Filter out any null entries if postBalance was not found or no balance change

  // Handle cases where there are post balances but no corresponding pre balances
  ownerPostTokenBalances.forEach(postBalance => {
    const preBalance = ownerPreTokenBalances.find(pre => pre.accountIndex === postBalance.accountIndex);
    if (!preBalance) {
      const postAmount = postBalance.uiTokenAmount.uiAmount;

      // Only return an object if there is a balance change (preBalance is implicitly 0)
      if (postAmount !== 0) {
        tokenBalanceChanges.push({
          accountIndex: postBalance.accountIndex,
          account: accountKeys[postBalance.accountIndex],
          mint: postBalance.mint,
          preBalance: 0,
          postBalance: postAmount,
          changeBalance: postAmount
        });
      }
    }
  });

  return tokenBalanceChanges;
}

async function findAllTokenBalanceChanges(preTokenBalances, postTokenBalances, accountKeys, owner, signers) {
  if (!preTokenBalances || !postTokenBalances) {
    return [];
  }

  const allTokenBalances = [...preTokenBalances, ...postTokenBalances];
  const uniqueAccounts = [...new Set(allTokenBalances.map(balance => balance.accountIndex))];

  const tokenBalanceChanges = await Promise.all(uniqueAccounts.map(async (accountIndex) => {
    const preBalance = preTokenBalances.find(balance => balance.accountIndex === accountIndex);
    const postBalance = postTokenBalances.find(balance => balance.accountIndex === accountIndex);

    const preAmount = preBalance?.uiTokenAmount?.uiAmount || 0;
    const postAmount = postBalance?.uiTokenAmount?.uiAmount || 0;
    const changeAmount = postAmount - preAmount;

    const pubkey = accountKeys[accountIndex].toBase58();
    const isSigner = signers.includes(pubkey);

    // Fetch token account info
    let isOwner = false;
    try {
      const accountInfo = await SOLANA_CONNECTION.getAccountInfo(new PublicKey(pubkey));
      if (accountInfo && accountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
        const tokenAccountInfo = AccountLayout.decode(accountInfo.data);
        const tokenAccountOwner = new PublicKey(tokenAccountInfo.owner).toBase58();
        isOwner = tokenAccountOwner === owner;
      }
    } catch (error) {
      console.error(`Error fetching account info for ${pubkey}:`, error);
    }

    return {
      accountIndex,
      pubkey,
      isOwner,
      isSigner,
      mint: preBalance?.mint || postBalance?.mint,
      preBalance: preAmount,
      postBalance: postAmount,
      changeBalance: changeAmount
    };
  }));

  return tokenBalanceChanges.filter(change => change.changeBalance !== 0);
}

// async function findAllTokenBalanceChanges(preTokenBalances, postTokenBalances, accountKeys, owner, signers) {
//   if (!preTokenBalances || !postTokenBalances) {
//     return [];
//   }

//   const allTokenBalances = [...preTokenBalances, ...postTokenBalances];
//   const uniqueAccounts = [...new Set(allTokenBalances.map(balance => balance.accountIndex))];

//   const tokenBalanceChanges = uniqueAccounts.map(accountIndex => {
//     const preBalance = preTokenBalances.find(balance => balance.accountIndex === accountIndex);
//     const postBalance = postTokenBalances.find(balance => balance.accountIndex === accountIndex);

//     const preAmount = preBalance?.uiTokenAmount?.uiAmount || 0;
//     const postAmount = postBalance?.uiTokenAmount?.uiAmount || 0;
//     const changeAmount = postAmount - preAmount;

//     const pubkey = accountKeys[accountIndex].toBase58();
//     const isOwner = pubkey === owner;
//     const isSigner = signers.includes(pubkey);

//     return {
//       accountIndex,
//       pubkey,
//       isOwner,
//       isSigner,
//       mint: preBalance?.mint || postBalance?.mint,
//       preBalance: preAmount,
//       postBalance: postAmount,
//       changeBalance: changeAmount
//     };
//   }).filter(change => change.changeBalance !== 0);

//   return tokenBalanceChanges;
// }

export { getOwnerOrTokenOwner, findOwnerBalanceChanges, findTokenBalanceChanges, findAllBalanceChanges, findAllTokenBalanceChanges };

