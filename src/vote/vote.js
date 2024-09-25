   // vote.js
import { LAMPORTS_PER_SOL, VoteInstruction } from '@solana/web3.js';

// Vote Program Instruction Key:
// Authorize        	decodeAuthorize
// AuthorizeWithSeed    decodeAuthorizeWithSeed
// InitializeAccount    decodeInitializeAccount
// Withdraw     	    decodeWithdraw

async function parseVoteInstruction(txContext, disc, instruction, ix) {

    const program = 'vote'
    const instructionType = VoteInstruction.decodeInstructionType(instruction);

    const payload = {}
    payload.program = program
    payload.type = instructionType


    if ( instructionType == 'Authorize') {
        const decoded = VoteInstruction.decodeAuthorize(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58()
        payload.newAuthorizedPubkey = decoded.newAuthorizedPubkey.toBase58()
        payload.votePubkey = decoded.votePubkey.toBase58()
        payload.index = decoded.voteAuthorizationType.index
    }
    else if ( instructionType == 'AuthorizeWithSeed') {
        const decoded = VoteInstruction.decodeAuthorizeWithSeed(instruction);
        payload.currentAuthorityDerivedKeyOwnerPubkey = decoded.currentAuthorityDerivedKeyOwnerPubkey.toBase58()
        payload.newAuthorizedPubkey = decoded.newAuthorizedPubkey.toBase58()
        payload.votePubkey = decoded.votePubkey.toBase58()
        payload.currentAuthorityDerivedKeySeed = decoded.currentAuthorityDerivedKeySeed
        payload.index = decoded.voteAuthorizationType.index
        payload.currentAuthorityDerivedKeyBasePubkey = decoded.currentAuthorityDerivedKeyBasePubkey.toBase58()
    }
    else if ( instructionType == 'InitializeAccount') {
        const decoded = VoteInstruction.decodeInitializeAccount(instruction);
        payload.authorizedVoter = decoded.voteInit.authorizedVoter.toBase58()
        payload.authorizedWithdrawer = decoded.voteInit.authorizedWithdrawer.toBase58()
        payload.votePubkey = decoded.votePubkey.toBase58()
        payload.nodePubkey = decoded.nodePubkey.toBase58()
        payload.voteInit = decoded.voteInit
        payload.commission = decoded.voteInit.commission
    }
    else if ( instructionType == 'Withdraw') {
        const decoded = VoteInstruction.decodeWithdraw(instruction);
        payload.authorizedWithdrawerPubkey = decoded.authorizedWithdrawerPubkey.toBase58()
        payload.votePubkey = decoded.votePubkey.toBase58()
        payload.toPubkey = decoded.toPubkey.toBase58()
        payload.lamports = decoded.lamports
        payload.uiAmount = decoded.lamports / LAMPORTS_PER_SOL
    }

    return payload;
}

export { parseVoteInstruction };