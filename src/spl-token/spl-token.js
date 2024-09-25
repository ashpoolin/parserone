// // spl-token.js
import dotenv from 'dotenv';
import bs58 from 'bs58';
import BN from 'bn.js';
import { Buffer } from 'buffer';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { decodeInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenInstructionLookup } from './spl_token_layout.js';

dotenv.config();

const SOLANA_CONNECTION = new Connection(process.env.SOLANA_CONNECTION, 'confirmed', {
  maxSupportedTransactionVersion: 0
});

async function getTokenAccountDetails(connection, tokenAccountAddress) {
  try {
    const accountInfo = await connection.getAccountInfo(new PublicKey(tokenAccountAddress));

    if (!accountInfo) {
      return { error: 'Failed to find token account' };
    }

    if (accountInfo.data.length < 64) {
      return { error: 'Invalid token account data length' };
    }

    const mintAddress = new PublicKey(accountInfo.data.slice(0, 32));
    const ownerAddress = new PublicKey(accountInfo.data.slice(32, 64));

    return { 
      mintAddress: mintAddress.toString(), 
      ownerAddress: ownerAddress.toString() 
    };
  } catch (error) {
    console.warn(`Error fetching token account details: ${error.message}`);
    return { error: error.message };
  }
}

async function getMintDecimals(connection, mintAddress) {
  try {
    const mintAccountInfo = await connection.getAccountInfo(new PublicKey(mintAddress));

    if (!mintAccountInfo) {
      return { error: 'Failed to find mint account' };
    }

    const decimals = mintAccountInfo.data[44];
    return { decimals };
  } catch (error) {
    console.warn(`Error fetching mint decimals: ${error.message}`);
    return { error: error.message };
  }
}

async function parseSplTokenInstruction(txContext, disc, instruction, ix) {
  const payload = {
    program: 'spl-token',
    type: 'unknown'
  };

  try {
    const instructionType = TokenInstructionLookup[disc];
    if (!instructionType) {
      throw new Error(`Unknown SPL Token instruction: ${disc}`);
    }

    payload.type = instructionType;
    const decoded = decodeInstruction(instruction);

    switch (instructionType) {
      case 'AmountToUiAmount':
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        payload.mint = decoded.keys.mint?.pubkey?.toBase58() ?? 'Unknown';
        payload.amount = Number(decoded.data.amount ?? 0);
        break;

      case 'Approve':
      case 'ApproveChecked':
        payload.owner = decoded.keys.owner?.pubkey?.toBase58() ?? 'Unknown';
        payload.account = decoded.keys.account?.pubkey?.toBase58() ?? 'Unknown';
        payload.delegate = decoded.keys.delegate?.pubkey?.toBase58() ?? 'Unknown';
        payload.multiSigners = decoded.keys.multiSigners?.map(signer => signer.pubkey?.toBase58()) ?? [];
        payload.amount = Number(decoded.data.amount ?? 0);
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        if (instructionType === 'ApproveChecked') {
          payload.decimals = decoded.data.decimals;
          payload.mint = decoded.keys.mint?.pubkey?.toBase58() ?? 'Unknown';
          payload.uiAmount = Number(decoded.data.amount ?? 0) / 10 ** Number(decoded.data.decimals);
        }
        break;

      case 'Burn':
      case 'BurnChecked':
        payload.owner = decoded.keys.owner?.pubkey?.toBase58() ?? 'Unknown';
        payload.account = decoded.keys.account?.pubkey?.toBase58() ?? 'Unknown';
        payload.multiSigners = decoded.keys.multiSigners?.map(signer => signer.pubkey?.toBase58()) ?? [];
        payload.mint = decoded.keys.mint?.pubkey?.toBase58() ?? 'Unknown';
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        payload.amount = Number(decoded.data.amount ?? 0);
        if (instructionType === 'BurnChecked') {
          payload.decimals = Number(decoded.data.decimals);
          payload.uiAmount = Number(decoded.data.amount ?? 0) / 10 ** Number(decoded.data.decimals);
        }
        break;

      case 'CloseAccount':
        payload.authority = decoded.keys.authority?.pubkey?.toBase58() ?? 'Unknown';
        payload.account = decoded.keys.account?.pubkey?.toBase58() ?? 'Unknown';
        payload.destination = decoded.keys.destination?.pubkey?.toBase58() ?? 'Unknown';
        payload.multiSigners = decoded.keys.multiSigners?.map(signer => signer.pubkey?.toBase58()) ?? [];
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        break;

      case 'FreezeAccount':
      case 'ThawAccount':
        payload.authority = decoded.keys.authority?.pubkey?.toBase58() ?? 'Unknown';
        payload.account = decoded.keys.account?.pubkey?.toBase58() ?? 'Unknown';
        payload.multiSigners = decoded.keys.multiSigners?.map(signer => signer.pubkey?.toBase58()) ?? [];
        payload.mint = decoded.keys.mint?.pubkey?.toBase58() ?? 'Unknown';
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        break;

      case 'InitializeAccount':
      case 'InitializeAccount2':
      case 'InitializeAccount3':
        payload.owner = decoded.data.owner?.pubkey?.toBase58() ?? 'Unknown';
        payload.account = decoded.keys.account?.pubkey?.toBase58() ?? 'Unknown';
        payload.mint = decoded.keys.mint?.pubkey?.toBase58() ?? 'Unknown';
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        break;

      case 'InitializeImmutableOwner':
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        payload.account = decoded.keys.account?.pubkey?.toBase58() ?? 'Unknown';
        payload.data = decoded.data;
        break;

      case 'InitializeMint':
      case 'InitializeMint2':
        payload.mintAuthority = decoded.data.mintAuthority?.pubkey?.toBase58() ?? 'Unknown';
        payload.decimals = Number(decoded.data.decimals);
        payload.mint = decoded.keys.mint?.pubkey?.toBase58() ?? 'Unknown';
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        break;

      case 'InitializeMintCloseAuthority':
        payload.closeAuthority = decoded.data.closeAuthority?.pubkey?.toBase58() ?? 'Unknown';
        payload.mint = decoded.keys.mint?.pubkey?.toBase58() ?? 'Unknown';
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        break;

      case 'InitializeMultisig':
        payload.account = decoded.keys.account?.pubkey?.toBase58() ?? 'Unknown';
        payload.signers = decoded.keys.signers?.map(signer => signer.pubkey?.toBase58()) ?? [];
        payload.rent = decoded.keys.rent?.pubkey?.toBase58() ?? 'Unknown';
        payload.m = decoded.data.m;
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        break;

      case 'MintTo':
      case 'MintToChecked':
        payload.authority = decoded.keys.authority?.pubkey?.toBase58() ?? 'Unknown';
        payload.destination = decoded.keys.destination?.pubkey?.toBase58() ?? 'Unknown';
        payload.multiSigners = decoded.keys.multiSigners?.map(signer => signer.pubkey?.toBase58()) ?? [];
        payload.mint = decoded.keys.mint?.pubkey?.toBase58() ?? 'Unknown';
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        payload.amount = decoded.data.amount?.toString() ?? '0';
        if (instructionType === 'MintToChecked') {
          payload.decimals = decoded.data.decimals;
          payload.uiAmount = Number(decoded.data.amount ?? 0) / 10 ** Number(decoded.data.decimals);
        }
        break;

      case 'Revoke':
        payload.owner = decoded.keys.owner?.pubkey?.toBase58() ?? 'Unknown';
        payload.account = decoded.keys.account?.pubkey?.toBase58() ?? 'Unknown';
        payload.multiSigners = decoded.keys.multiSigners?.map(signer => signer.pubkey?.toBase58()) ?? [];
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        break;

      case 'SetAuthority':
        payload.currentAuthority = decoded.keys.currentAuthority?.pubkey?.toBase58() ?? 'Unknown';
        payload.newAuthority = decoded.data.newAuthority?.pubkey?.toBase58() ?? 'Unknown';
        payload.account = decoded.keys.account?.pubkey?.toBase58() ?? 'Unknown';
        payload.multiSigners = decoded.keys.multiSigners?.map(signer => signer.pubkey?.toBase58()) ?? [];
        payload.authorityType = decoded.data.authorityType;
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        break;

      case 'SyncNative':
        payload.account = decoded.keys.account?.pubkey?.toBase58() ?? 'Unknown';
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        break;

      case 'Transfer':
      case 'TransferChecked':
        payload.owner = decoded.keys.owner?.pubkey?.toBase58() ?? 'Unknown';
        payload.source = decoded.keys.source?.pubkey?.toBase58() ?? 'Unknown';
        const destination = decoded.keys.destination?.pubkey?.toBase58() ?? 'Unknown';
        payload.destination = destination;
        payload.multiSigners = decoded.keys.multiSigners?.map(signer => signer.pubkey?.toBase58()) ?? [];
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        payload.amount = Number(decoded.data.amount ?? 0);

        const tokenAccountData = await getTokenAccountDetails(SOLANA_CONNECTION, destination);
        if (tokenAccountData.error) {
          payload.error = tokenAccountData.error;
        } else {
          payload.ownerAddress = tokenAccountData.ownerAddress;
          const mintResult = await getMintDecimals(SOLANA_CONNECTION, tokenAccountData.mintAddress);
          if (mintResult.error) {
            payload.error = mintResult.error;
          } else {
            payload.decimals = mintResult.decimals;
            payload.mint = tokenAccountData.mintAddress;
            payload.uiAmount = Number(decoded.data.amount ?? 0) / 10 ** Number(mintResult.decimals);
          }
        }
        break;

      case 'UiAmountToAmount':
        payload.amount = Number(decoded.data.amount ?? 0);
        payload.mint = decoded.keys.mint?.pubkey?.toBase58() ?? 'Unknown';
        payload.programId = decoded.programId?.toBase58() ?? 'Unknown';
        break;

      default:
        payload.error = `Unhandled SPL Token instruction type: ${instructionType}`;
        payload.rawData = Buffer.from(ix).toString('hex');
    }
  } catch (error) {
    console.warn(`Error parsing SPL Token instruction: ${error.message}`);
    payload.error = error.message;
    payload.rawData = Buffer.from(ix).toString('hex');
  }

  return payload;
}

export { parseSplTokenInstruction };


// // require('dotenv').config();
// // const bs58 = require('bs58');
// // const BN = require('bn.js');
// // const Buffer = require('buffer').Buffer;
// // const { Connection, LAMPORTS_PER_SOL, PublicKey} = require('@solana/web3.js');
// // const { decodeInstruction, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
// // const { TokenInstructionLookup } = require('./spl_token_layout');

// import dotenv from 'dotenv';
// import bs58 from 'bs58';
// import BN from 'bn.js';
// import { Buffer } from 'buffer';
// import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
// import { decodeInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
// import { TokenInstructionLookup } from './spl_token_layout.js';

// // Call dotenv.config() after importing
// dotenv.config();

// const SOLANA_CONNECTION = new Connection(process.env.SOLANA_CONNECTION, 'confirmed', {
//   maxSupportedTransactionVersion: 0
// });


// // SPL Token Instructions Key: (these are not really needed, since decodeInstruction handles the logic. But they are here for reference)
// // AmountToUiAmount       decodeAmountToUiAmountInstruction
// // Approve              	decodeApproveInstruction
// // ApproveChecked         decodeApproveCheckedInstruction
// // Burn             	    decodeBurnInstruction
// // BurnChecked            decodeBurnCheckedInstruction
// // CloseAccount           decodeCloseAccountInstruction
// // FreezeAccount          decodeFreezeAccountInstruction
// // InitializeAccount      decodeInitializeAccountInstruction
// // InitializeAccount2     decodeInitializeAccount2Instruction
// // InitializeAccount3     decodeInitializeAccount3Instruction
// // InitializeMint         decodeInitializeMintInstruction
// // InitializeMint2        decodeInitializeMint2Instruction
// // InitializeMultisig2    decodeInitializeMultisigInstruction
// // MintTo             	  decodeMintToInstruction
// // MintToChecked          decodeMintToCheckedInstruction
// // Revoke                 decodeRevokeInstruction
// // SetAuthority           decodeSetAuthorityInstruction
// // SyncNative             decodeSyncNativeInstruction
// // ThawAccount            decodeThawAccountInstruction
// // Transfer             	decodeTransferInstruction
// // TransferChecked        decodeTransferCheckedInstruction
// // UiAmountToAmount       decodeUiAmountToAmountInstruction


// async function getTokenAccountDetails(connection, tokenAccountAddress) {
//   // Fetch the account info
//   const accountInfo = await connection.getAccountInfo(new PublicKey(tokenAccountAddress));

//   if (accountInfo === null) {
//     throw new Error('Failed to find token account');
//   }

//   // Ensure the account data is the expected length (at least 64 bytes for Mint and Owner)
//   if (accountInfo.data.length < 64) {
//     throw new Error('Invalid token account data length');
//   }

//   // Extract the Mint and Owner addresses from the account data
//   const mintAddress = new PublicKey(accountInfo.data.slice(0, 32));
//   const ownerAddress = new PublicKey(accountInfo.data.slice(32, 64));

//   return { mintAddress: mintAddress.toString(), ownerAddress: ownerAddress.toString() };
// }

// async function getMintDecimals(connection, mintAddress) {
//   // Fetch the mint account info
//   const mintAccountInfo = await connection.getAccountInfo(new PublicKey(mintAddress));

//   if (mintAccountInfo === null) {
//     throw new Error('Failed to find mint account');
//   }

//   // SPL Token Mint layout: The decimals field is at byte offset 44 and is 1 byte long
//   const decimals = mintAccountInfo.data[44];

//   return decimals;
// }

// async function parseSplTokenInstruction(txContext, disc, instruction, ix) {

//   const payload = {
//       program: 'spl-token',
//       type: 'unknown'
//   };

//   try {
//       const instructionType = TokenInstructionLookup[disc];
//       if (!instructionType) {
//           throw new Error(`Unknown SPL Token instruction: ${disc}`);
//       }

//       payload.type = instructionType;
//       const decoded = decodeInstruction(instruction);

//       switch (instructionType) {
//           case 'AmountToUiAmount':
//               payload.programId = decoded.programId.toBase58();
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.amount = Number(decoded.data.amount);
//               break;

//           case 'Approve':
//               payload.owner = decoded.keys.owner.pubkey.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.delegate = decoded.keys.delegate.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners;
//               payload.amount = Number(decoded.data.amount);
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'ApproveChecked':
//               payload.owner = decoded.keys.owner.pubkey.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.delegate = decoded.keys.delegate.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners;
//               payload.decimals = decoded.data.decimals;
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               payload.amount = Number(decoded.data.amount);
//               payload.uiAmount = Number(decoded.data.amount) / 10 ** Number(decoded.data.decimals);
//               break;

//           case 'Burn':
//               payload.owner = decoded.keys.owner.pubkey.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners;
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               payload.amount = Number(decoded.data.amount);
//               break;

//           case 'BurnChecked':
//               payload.owner = decoded.keys.owner.pubkey.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners;
//               payload.decimals = Number(decoded.data.decimals);
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               payload.amount = Number(decoded.data.amount);
//               payload.uiAmount = Number(decoded.data.amount) / 10 ** Number(decoded.data.decimals);
//               break;

//           case 'CloseAccount':
//               payload.authority = decoded.keys.authority.pubkey.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.destination = decoded.keys.destination.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners;
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'FreezeAccount':
//               payload.authority = decoded.keys.authority.pubkey.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners;
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'InitializeAccount':
//           case 'InitializeAccount2':
//           case 'InitializeAccount3':
//               payload.owner = decoded.data.owner.pubkey.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'InitializeImmutableOwner':
//               payload.programId = decoded.programId.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.data = decoded.data;
//               break;

//           case 'InitializeMint':
//               payload.mintAuthority = decoded.data.mintAuthority;
//               payload.decimals = Number(decoded.data.decimals);
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'InitializeMint2':
//               payload.mintAuthority = decoded.data.mintAuthority.pubkey.toBase58();
//               payload.decimals = Number(decoded.data.decimals);
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'InitializeMintCloseAuthority':
//               payload.closeAuthority = decoded.data.closeAuthority.pubkey.toBase58();
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'InitializeMultisig':
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.signers = decoded.keys.signers.map(signer => signer.pubkey.toBase58());
//               payload.rent = decoded.keys.rent.pubkey.toBase58();
//               payload.m = decoded.data.m;
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'InitializeMultisig2':
//           case 'InitializePermanentDelegate':
//           case 'Reallocate':
//               // These cases are not implemented or have no functionality in spl-token currently
//               break;

//           case 'MintTo':
//               payload.authority = decoded.keys.authority.pubkey.toBase58();
//               payload.destination = decoded.keys.destination.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners.map(signer => signer.pubkey.toBase58());
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               payload.amount = decoded.data.amount;
//               break;

//           case 'MintToChecked':
//               payload.authority = decoded.keys.authority.pubkey.toBase58();
//               payload.destination = decoded.keys.destination.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners.map(signer => signer.pubkey.toBase58());
//               payload.decimals = decoded.data.decimals;
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               payload.amount = decoded.data.amount;
//               payload.uiAmount = Number(decoded.data.amount) / 10 ** Number(decoded.data.decimals);
//               break;

//           case 'Revoke':
//               payload.owner = decoded.keys.owner.pubkey.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners;
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'SetAuthority':
//               payload.currentAuthority = decoded.keys.currentAuthority.pubkey.toBase58();
//               payload.newAuthority = decoded.data.newAuthority.pubkey.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners.map(signer => signer.pubkey.toBase58());
//               payload.authorityType = decoded.data.authorityType;
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'SyncNative':
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'ThawAccount':
//               payload.authority = decoded.keys.authority.pubkey.toBase58();
//               payload.account = decoded.keys.account.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners.map(signer => signer.pubkey.toBase58());
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               break;

//           case 'Transfer':
//               payload.owner = decoded.keys.owner.pubkey.toBase58();
//               payload.source = decoded.keys.source.pubkey.toBase58();
//               const destination = decoded.keys.destination.pubkey.toBase58();
//               payload.destination = destination;
//               const tokenAccountData = await getTokenAccountDetails(SOLANA_CONNECTION, destination);
//               payload.ownerAddress = tokenAccountData.ownerAddress;
//               payload.multiSigners = decoded.keys.multiSigners.map(signer => signer.pubkey.toBase58());
//               const mint = tokenAccountData.mintAddress;
//               const decimals = await getMintDecimals(SOLANA_CONNECTION, mint);
//               payload.decimals = decimals;
//               payload.mint = mint;
//               payload.programId = decoded.programId.toBase58();
//               payload.amount = Number(decoded.data.amount);
//               payload.uiAmount = Number(decoded.data.amount) / 10 ** Number(decimals);
//               break;

//           case 'TransferChecked':
//               payload.owner = decoded.keys.owner.pubkey.toBase58();
//               payload.destinationOwner = await SOLANA_CONNECTION.getAccountInfo(decoded.keys.destination.pubkey).then((data) => { return bs58.encode(Buffer.from(data.data).slice(32, 64)) });
//               payload.source = decoded.keys.source.pubkey.toBase58();
//               payload.destination = decoded.keys.destination.pubkey.toBase58();
//               payload.multiSigners = decoded.keys.multiSigners.map(signer => signer.pubkey.toBase58());
//               payload.decimals = Number(decoded.data.decimals);
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               payload.amount = Number(decoded.data.amount);
//               payload.uiAmount = Number(decoded.data.amount) / 10 ** Number(decoded.data.decimals);
//               break;

//           case 'UiAmountToAmount':
//               payload.amount = Number(decoded.data.amount);
//               payload.mint = decoded.keys.mint.pubkey.toBase58();
//               payload.programId = decoded.programId.toBase58();
//               break;

//           default:
//               console.warn(`Unhandled SPL Token instruction type: ${instructionType}`);
//               payload.rawData = Buffer.from(ix).toString('hex');
//       }

//   } catch (error) {
//       console.warn(`Error parsing SPL Token instruction: ${error.message}`);
//       payload.error = error.message;
//       payload.rawData = Buffer.from(ix).toString('hex');
//   }

//   return payload;
// }
// //  module.exports = { parseSplTokenInstruction };
// export { parseSplTokenInstruction };