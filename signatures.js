const { Connection, PublicKey } = require('@solana/web3.js');
require('dotenv').config();
const SOLANA_CONNECTION = process.env.SOLANA_CONNECTION;
const connection = new Connection(SOLANA_CONNECTION, 'confirmed');

const address = process.argv[2];
const limit = parseInt(process.argv[3]);
const minimum_blocktime_lookback = parseInt(process.argv[4]);
const pubkey = new PublicKey(address);

const getSignatures = async (pkey) => {
    signatureBlock = await connection.getSignaturesForAddress(pkey);
    // console.log(JSON.stringify(signatures));
    return signatureBlock        // console.log(JSON.stringify(signatures));
};
const getSignaturesBefore = async (pkey, params) => {
    signatureBlock = await connection.getSignaturesForAddress(pkey, params);
    // console.log(JSON.stringify(signatures));  
    return signatureBlock      // console.log(JSON.stringify(signatures));
};

let signatures = [];
let finished = false;

const getSignaturesWithLimit = async () => {
    const signaturesBlock = await getSignatures(pubkey);
    if (signaturesBlock.length === 0) {
        console.log(JSON.stringify([]));
        return;
    }
    signatures.push(...signaturesBlock);
    
    while (!finished && signatures.length < limit) {
        const earliest = signatures[signatures.length - 1].signature;
        const params = { before: earliest };
        const signaturesBlock = await getSignaturesBefore(pubkey, params);
        
        if (signaturesBlock.length === 0) {
            break;  // No more signatures to fetch
        }
        
        signatures.push(...signaturesBlock);

        // Check if we've reached the minimum blocktime lookback
        const lastBlockTime = signaturesBlock[signaturesBlock.length - 1].blockTime;
        if (lastBlockTime < minimum_blocktime_lookback) {
            finished = true;
        }

        // Break the loop if we've fetched less than 1000 signatures
        if (signaturesBlock.length < 1000) {
            break;
        }
    }

    // Trim signatures based on minimum_blocktime_lookback and limit
    signatures = signatures.filter(sig => sig.blockTime >= minimum_blocktime_lookback);
    if (signatures.length > limit) {
        signatures = signatures.slice(0, limit);
    }

    console.log(JSON.stringify(signatures));
};

getSignaturesWithLimit();