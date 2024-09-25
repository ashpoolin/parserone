import dotenv from 'dotenv';
import bs58 from 'bs58';
import BN from 'bn.js';
import { Buffer } from 'buffer';
import { Connection, LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { stringify } from 'csv-stringify/sync';

// Call dotenv.config() after importing
dotenv.config();

import programMap from './src/utils/programMap.js';

import { parseSystemInstruction } from './src/system/system.js';
import { parseStakeInstruction } from './src/stake/stake.js';
import { parseVoteInstruction } from './src/vote/vote.js';
import { parseSplTokenInstruction } from './src/spl-token/spl-token.js';
import { parseComputeBudgetInstruction } from './src/compute-budget/compute-budget.js';
import { getOwnerOrTokenOwner, findOwnerBalanceChanges, findTokenBalanceChanges, findAllBalanceChanges, findAllTokenBalanceChanges } from './src/utils/balanceChanges.js';
import { parseUnknownInstruction } from './src/unknown.js';
import { logCSV, getCSVHeader } from './src/utils/csvlogger.js';
import { logJSON, logTxMetaData } from './src/utils/jsonlogger.js';


const SOLANA_CONNECTION = new Connection(process.env.SOLANA_CONNECTION, 'confirmed', {
  maxSupportedTransactionVersion: 0
});

const signature = process.argv[2];
const userAccount = process.argv[3];
const enhancedToggle = process.argv[4];

// Add this function at the top of your file or before using JSON.stringify
function bigIntReplacer(key, value) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  // Check for BN (assuming you're using bn.js)
  if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'BN') {
    return value.toString();
  }
  return value;
}

async function parseSolanaTransaction(signature, userAccount) {
  try {
    const promises = []; // Array to hold promises
    const format = "json"
    // const format = process.argv[4]
    const data = await SOLANA_CONNECTION.getTransaction(signature, {
      maxSupportedTransactionVersion: 0
    });
    // console.log(`data: ${JSON.stringify(data, null, 2)}`);

    let enhancedDescription;
    let enhancedType;
    let enhancedSource;
    let enhancedFeePayer;
    if (enhancedToggle === "1") {
      const enhancedResponse = await fetch(process.env.HELIUS_ENHANCED_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: [signature],
        }),
      });

      const enhancedData = await enhancedResponse.json();
      enhancedDescription = enhancedData[0].description;
      enhancedType = enhancedData[0].type;
      enhancedSource = enhancedData[0].source;
      enhancedFeePayer = enhancedData[0].feePayer;
    }

    let jsonOutput = [];
    let csvOutput = [getCSVHeader()];
    const tx_version = data?.version;
    // console.log(`tx_version: ${tx_version}`);
    // const tx_version = data?.transaction?.version ?? 'legacy'; // DO NOT USE, DON'T THINK THIS IS CORRECT
    const accountKeys = tx_version === 'legacy'
      ? data.transaction.message.accountKeys
      : [...data.transaction.message.staticAccountKeys, ...(data.meta.loadedAddresses.writable || []), ...(data.meta.loadedAddresses.readonly || [])];

    const getAccountKey = (index) => {
      if (tx_version === 'legacy') {
        return new PublicKey(data.transaction.message.accountKeys[index]);
      } else {
        return new PublicKey(accountKeys[index]);
      }
    };

    // let accountKeys = []; // restore if you remove the other stuff
    let preBalances = [];
    let postBalances = [];
    let preTokenBalances = [];
    let postTokenBalances = [];
    let signers = [];

    if (tx_version === "legacy") {
      // accountKeys = data?.transaction.message.accountKeys; // restore if you remove the other stuff
      preBalances = data?.meta.preBalances;
      postBalances = data?.meta.postBalances;
      preTokenBalances = data?.meta.preTokenBalances;
      postTokenBalances = data?.meta.postTokenBalances;
      signers = data?.transaction.message.accountKeys.slice(0, data?.transaction.message.header.numRequiredSignatures) || null;

    } else if (tx_version === 0) {
      // accountKeys = data?.transaction.message.staticAccountKeys // restore if you remove the other stuff
      preBalances = data?.meta.preBalances
      postBalances = data?.meta.postBalances
      preTokenBalances = data?.meta.preTokenBalances
      postTokenBalances = data?.meta.postTokenBalances

      signers = data?.transaction.message.staticAccountKeys.slice(0, data?.transaction.message.header.numRequiredSignatures) || null;

    } else {
      console.log(`tx_version not supported: ${tx_version}`);
    }

    let owner;
    if (userAccount.length > 40) { // userAccount = string; if length > 40, it's a pubkey provided
      owner = await getOwnerOrTokenOwner(userAccount);
      // console.log(`owner provided: ${owner}`);  
    } else { // if an empty or null field provided, use the first signer as the owner
      owner = new PublicKey(signers[0]).toBase58();
      // owner = signers[0];
      // console.log(`owner extracted: ${owner}`);  
    }

    // console.log(JSON.stringify(data, null, 2));
    // console.log(`signers: ${JSON.stringify(signers, null, 2)}`);

    const allBalanceChanges = await findAllBalanceChanges(accountKeys, preBalances, postBalances, owner, signers.map(s => s.toBase58()));
    const allTokenBalanceChanges = await findAllTokenBalanceChanges(preTokenBalances, postTokenBalances, accountKeys, owner, signers.map(s => s.toBase58()));




    // // create txContext
    const transaction = data;
    const txContext = {};

    txContext.signature = signature;
    txContext.slot = data?.slot;
    txContext.blocktime = data?.blockTime;
    txContext.err = data?.meta.err;
    txContext.fee = data?.meta.fee / LAMPORTS_PER_SOL;
    txContext.enhancedDescription = enhancedDescription;
    txContext.enhancedType = enhancedType;
    txContext.enhancedSource = enhancedSource;
    txContext.enhancedFeePayer = enhancedFeePayer;
    // txContext.data = data;
    txContext.owner = owner;
    txContext.allBalanceChanges = allBalanceChanges;
    txContext.allTokenBalanceChanges = allTokenBalanceChanges;
    txContext.ownerBalanceChanges = allBalanceChanges.find(change => change.isOwner);
    txContext.ownerTokenBalanceChanges = allTokenBalanceChanges.filter(change => change.isOwner);
    // txContext.ownerBalanceChanges = ownerBalanceChanges;
    // txContext.ownerTokenBalanceChanges = ownerTokenBalanceChanges;
    txContext.signers = signers;
    jsonOutput.push(logTxMetaData([txContext]));

    // console.log(`txContext: ${JSON.stringify(txContext, null, 2)}`);

    // iterate through all instructions
    if (tx_version == "legacy") {
      data?.transaction.message.instructions.map(async (instr, index) => {
        const { accounts, data, programIdIndex } = instr;
        const keys = accounts.map(accountIndex => ({
          pubkey: new PublicKey(transaction.transaction.message.accountKeys[accountIndex]),
          isSigner: transaction.transaction.message.header.numRequiredSignatures > accountIndex,
          isWritable: transaction.transaction.message.header.numReadonlySignedAccounts > accountIndex ||
            transaction.transaction.message.header.numReadonlyUnsignedAccounts > (accountIndex - transaction.transaction.message.header.numRequiredSignatures)
        }));
        const programId = new PublicKey(transaction.transaction.message.accountKeys[programIdIndex]);
        const dataBuffer = bs58.decode(data);

        const instruction = new TransactionInstruction({
          keys,
          programId,
          data: dataBuffer
        });
        const program = programMap.get(programId.toBase58()) || "unknown";

        // fetch the instruction discriminator
        let ix;
        try {
          ix = bs58.decode(instr.data);
        } catch (err) {
          console.log(`error decoding instruction: ${err}`);
        }
        let disc;
        try {
          if (program === 'spl-token') {
            disc = ix.slice(0, 1);
          } else {
            disc = (Buffer.from(ix.slice(0, 4))).readUInt32LE()
          }
        } catch (err) {
          disc = 999;
        }
        // console.log(`program: ${program}, disc: ${disc}, ix: ${ix}`);
        let resultPromise; // Declare resultPromise here
        // pass each instruction off to different parser modules
        if (program == 'system') {
          resultPromise = parseSystemInstruction(txContext, disc, instruction, ix);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
        else if (program == 'stake') {
          resultPromise = parseStakeInstruction(accountKeys, preBalances, postBalances, disc, instruction, ix);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
        else if (program == 'vote') {
          resultPromise = parseVoteInstruction(txContext, disc, instruction, ix);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
        else if (program == 'spl-token') {
          const resultPromise = parseSplTokenInstruction(txContext, disc, instruction, ix);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
        else if (program == 'compute-budget') {
          // promise wasn't needed, because parseComputeBudgetInstruction was not async until you messed with it.
          const resultPromise = parseComputeBudgetInstruction(txContext, disc, instruction, ix);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
        else {
          resultPromise = parseUnknownInstruction(txContext, disc, instruction, ix, program, programId);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
      });
    }
    else if (tx_version === 0) {
      data?.transaction.message.compiledInstructions.map(async (instr, index) => {
        const { accountKeyIndexes, data: instrData, programIdIndex } = instr;
        const keys = accountKeyIndexes.map(accountIndex => ({
          pubkey: getAccountKey(accountIndex),
          isSigner: data.transaction.message.isAccountSigner(accountIndex),
          isWritable: data.transaction.message.isAccountWritable(accountIndex)
        }));

        const programId = getAccountKey(programIdIndex);

        // Handle the Buffer data
        let dataBuffer;
        if (Buffer.isBuffer(instrData)) {
          dataBuffer = instrData;
        } else if (Array.isArray(instrData)) {
          dataBuffer = Buffer.from(instrData);
        } else {
          dataBuffer = Buffer.from(instrData, 'base64');
        }

        const instruction = new TransactionInstruction({
          keys,
          programId,
          data: dataBuffer
        });
        // console.log(`instruction: ${JSON.stringify(instruction)}`);

        // console.log(`programId: ${programId}`)
        const program = programMap.get(programId.toBase58()) || "unknown";
        // console.log(`program: ${program}`)

        // fetch the instruction discriminator
        const ix = dataBuffer;
        // const ix = bs58.decode(instr.data);
        let disc;
        try {
          if (program === 'spl-token') {
            disc = ix.slice(0, 1);
          } else {
            disc = (Buffer.from(ix.slice(0, 4))).readUInt32LE()
          }
        } catch (err) {
          disc = 999;
        }

        let resultPromise; // Declare resultPromise here
        // pass each instruction off to different parser modules
        if (program == 'system') {
          resultPromise = parseSystemInstruction(txContext, disc, instruction, ix);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
        else if (program == 'stake') {
          resultPromise = parseStakeInstruction(accountKeys, preBalances, postBalances, disc, instruction, ix);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
        else if (program == 'vote') {
          resultPromise = parseVoteInstruction(txContext, disc, instruction, ix);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
        else if (program == 'spl-token') {
          const resultPromise = parseSplTokenInstruction(txContext, disc, instruction, ix);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result)); 
          }));
        }
        else if (program == 'compute-budget') {
          // promise wasn't needed, because parseComputeBudgetInstruction was not async until you messed with it.
          const resultPromise = parseComputeBudgetInstruction(txContext, disc, instruction, ix);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
        else {
          // console.log(`parsing an unknown instruction: ${program}`)
          resultPromise = parseUnknownInstruction(txContext, disc, instruction, ix, program, programId);
          promises.push(resultPromise.then(result => {
            if (format == 'csv')
              csvOutput.push(logCSV([result]));
            else if (format == 'json')
              jsonOutput.push([result]);
            // jsonOutput.push(logJSON([result]));
            // console.log(JSON.stringify(result));
          }));
        }
      });
    }

    // Process inner instructions
    if (data?.meta?.innerInstructions) {
      // console.log("Processing inner instructions...");
      data.meta.innerInstructions.forEach((innerInstructionSet, outerIndex) => {
        innerInstructionSet.instructions.forEach((instr, innerIndex) => {
          const { accounts, data: instrData, programIdIndex } = instr;
          // console.log(`accounts: ${accounts}`)
          // console.log(`data: ${instrData}`)
          // console.log(`programIdIndex: ${programIdIndex}`)
          let keys, programId;
          if (tx_version === "legacy") {
            keys = accounts.map(accountIndex => ({
              pubkey: new PublicKey(transaction.transaction.message.accountKeys[accountIndex]),
              isSigner: transaction.transaction.message.isAccountSigner(accountIndex),
              isWritable: transaction.transaction.message.isAccountWritable(accountIndex)
            }));
            programId = new PublicKey(transaction.transaction.message.accountKeys[programIdIndex]);
          } else if (tx_version === 0) {
            keys = accounts.map(accountIndex => ({
              pubkey: getAccountKey(accountIndex),
              isSigner: data.transaction.message.isAccountSigner(accountIndex),
              isWritable: data.transaction.message.isAccountWritable(accountIndex)
            }));
            programId = getAccountKey(programIdIndex);
          } else {
            console.error(`Unsupported transaction version: ${tx_version}`);
            return;
          }

          // Decode the instruction data
          const ix = Buffer.from(bs58.decode(instrData));
          // console.log(`ix: ${ix}`)
          // Determine the program
          const program = programMap.get(programId.toBase58()) || "unknown";
          // console.log(`program: ${program}`)
          // Extract the instruction discriminator
          let disc;
          if (program === 'spl-token') {
            disc = ix[0]; // SPL Token uses the first byte as discriminator
          } else {
            disc = ix.slice(0, 8); // Most other programs use the first 8 bytes
          }
          // console.log(`disc: ${disc}`)
          // console.log(`Inner Instruction - Program: ${program}, Discriminator: ${disc.toString('hex')}, Data: ${ix.toString('hex')}`);

          const instruction = new TransactionInstruction({
            keys,
            programId,
            data: ix
          });

          let resultPromise;
          switch (program) {
            case 'system':
              resultPromise = parseSystemInstruction(txContext, disc, instruction, ix);
              break;
            case 'stake':
              resultPromise = parseStakeInstruction(accountKeys, preBalances, postBalances, disc, instruction, ix);
              break;
            case 'vote':
              resultPromise = parseVoteInstruction(txContext, disc, instruction, ix);
              break;
            case 'spl-token':
              resultPromise = parseSplTokenInstruction(txContext, disc, instruction, ix);
              break;
            case 'compute-budget':
              resultPromise = parseComputeBudgetInstruction(txContext, disc, instruction, ix);
              break;
            default:
              resultPromise = parseUnknownInstruction(txContext, disc, instruction, ix, program, programId);
          }

          promises.push(resultPromise.then(result => {
            result.isInnerInstruction = true;
            result.innerInstructionIndex = `${outerIndex}.${innerIndex}`;
            result.parentInstructionIndex = innerInstructionSet.index;
            if (format === 'csv')
              csvOutput.push(logCSV([result]));
            else if (format === 'json')
              jsonOutput.push([result]);
          }));
        });
      });
    }

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Return the jsonOutput instead of logging it
    // return jsonOutput;
    // console.log(`${JSON.stringify(jsonOutput, null, 2)}`)
    console.log(JSON.stringify(jsonOutput, bigIntReplacer, 2));


  } catch (error) {
    console.error('Error in parseSolanaTransaction:', error);
    throw error;
  }
}

parseSolanaTransaction(signature, userAccount);


