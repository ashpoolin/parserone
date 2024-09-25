// stake.js

// const { LAMPORTS_PER_SOL, StakeInstruction } = require('@solana/web3.js');
import { LAMPORTS_PER_SOL, StakeInstruction } from '@solana/web3.js';

// Stake Program Instructions Key:
// Authorize	        decodeAuthorize
// AuthorizeWithSeed	decodeAuthorizeWithSeed
// Deactivate	        decodeDeactivate
// Delegate	            decodeDelegate
// Initialize	        decodeInitialize
// Merge	            decodeMerge
// Split	            decodeSplit
// Withdraw	            decodeWithdraw

async function parseStakeInstruction(accountKeys, preBalances, postBalances, disc, instruction, ix) {

    const program = 'stake'
    // const data = txContext.data
    // const instructionType = stakeProgramDiscriminatorMap.get(disc);
    const instructionType = StakeInstruction.decodeInstructionType(instruction);

    // const preBalances = data.meta.preBalances
    // const postBalances = data.meta.postBalances

    const payload = {}
    payload.program = program
    payload.type = instructionType

    if (instructionType == 'Authorize') {
        const decoded = StakeInstruction.decodeAuthorize(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58()
        payload.newAuthorizedPubkey = decoded.newAuthorizedPubkey.toBase58()
        payload.stakePubkey = decoded.stakePubkey.toBase58()
        payload.stakeAuthorizationType = decoded.stakeAuthorizationType
        payload.index = decoded.index
    }
    else if (instructionType == 'AuthorizeWithSeed') {
        const decoded = StakeInstruction.decodeAuthorizeWithSeed(instruction);
        payload.authorityOwner = decoded.authorityOwner.toBase58()
        payload.newAuthorizedPubkey = decoded.newAuthorizedPubkey.toBase58()
        payload.custodianPubkey = decoded.custodianPubkey.toBase58()
        payload.stakePubkey = decoded.stakePubkey.toBase58()
        payload.authoritySeed = decoded.authoritySeed
        payload.stakeAuthorizationType = decoded.stakeAuthorizationType
        payload.index = decoded.index
        payload.authorityBase = decoded.authorityBase.toBase58()
    }
    else if (instructionType == 'Deactivate') {
        const decoded = StakeInstruction.decodeDeactivate(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58()
        payload.stakePubkey = decoded.stakePubkey.toBase58()
    }
    else if (instructionType == 'Delegate') {
        const decoded = StakeInstruction.decodeDelegate(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58()
        payload.stakePubkey = decoded.stakePubkey.toBase58()
        payload.votePubkey = decoded.votePubkey.toBase58()
    }
    else if (instructionType == 'Initialize') {
        const decoded = StakeInstruction.decodeInitialize(instruction);
        payload.staker = decoded.authorized.staker.toBase58()
        payload.withdrawer = decoded.authorized.withdrawer.toBase58()
        payload.custodian = decoded.lockup.custodian.toBase58()
        payload.stakePubkey = decoded.stakePubkey.toBase58()
        payload.epoch = decoded.lockup.epoch
        payload.unixTimestamp = decoded.lockup.unixTimestamp
    }
    else if (instructionType == 'Merge') {
        const decoded = StakeInstruction.decodeMerge(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58()
        payload.sourceStakePubKey = decoded.sourceStakePubKey.toBase58()
        payload.stakePubkey = decoded.stakePubkey.toBase58()
        payload.uiAmount = accountKeys.map((key, index) => {
        // payload.uiAmount = data?.transaction.message.accountKeys.map((key, index) => {
            if (key.toString() === decoded.stakePubkey.toString()) {
                const balanceChange = postBalances[index] - preBalances[index];
                return balanceChange / LAMPORTS_PER_SOL;
            }
        }).filter(Boolean)[0]; // Filter out undefined and take the first valid entry
        // add uiAmount based on final balance of the stake
    }
    else if (instructionType == 'Split') {
        const decoded = StakeInstruction.decodeSplit(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58()
        payload.stakePubkey = decoded.stakePubkey.toBase58()
        payload.splitStakePubkey = decoded.splitStakePubkey.toBase58()
        payload.lamports = Number(decoded.lamports)
        payload.uiAmount = Number(decoded.lamports) / LAMPORTS_PER_SOL
    }
    else if (instructionType == 'Withdraw') {
        const decoded = StakeInstruction.decodeWithdraw(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58()
        payload.custodianPubkey = decoded.custodianPubkey ? decoded.custodianPubkey.toBase58() : null
        payload.stakePubkey = decoded.stakePubkey.toBase58()
        payload.toPubkey = decoded.toPubkey.toBase58()
        payload.lamports = Number(decoded.lamports)
        payload.uiAmount = Number(decoded.lamports) / LAMPORTS_PER_SOL
    }

    return payload;
}
// module.exports = { parseStakeInstruction };
export { parseStakeInstruction };