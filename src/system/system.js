// system.js
import { LAMPORTS_PER_SOL, SystemInstruction } from '@solana/web3.js';

async function parseSystemInstruction(txContext, disc, instruction, ix) {

    const program = 'system'
    const instructionType = SystemInstruction.decodeInstructionType(instruction);

    const payload = {}
    payload.program = program
    payload.type = instructionType

// System Instruction Decoder Key:
//      Allocate	                decodeAllocate
//      AllocateWithSeed	        decodeAllocateWithSeed
//      Assign	                    decodeAssign
//      AssignWithSeed	            decodeAssignWithSeed
//      Create	                    decodeCreateAccount
//      CreateWithSeed	            decodeCreateWithSeed
//      AdvanceNonceAccount	        decodeNonceAdvance
//      AuthorizeNonceAccount	    decodeNonceAuthorize
//      InitializeNonceAccount	    decodeNonceInitialize
//      WithdrawNonceAccount	    decodeNonceWithdraw
//      Transfer	                decodeTransfer
//      TransferWithSeed	        decodeTransferWithSeed


    if (instructionType == 'Allocate') {
        const decoded = SystemInstruction.decodeAllocate(instruction);
        payload.accountPubkey = decoded.accountPubkey.toBase58();
        payload.space = decoded.space;
    } 
    else if (instructionType == 'AllocateWithSeed') {
        const decoded = SystemInstruction.decodeAllocateWithSeed(instruction);
        payload.accountPubkey = decoded.accountPubkey.toBase58();
        payload.seed = decoded.seed;
        payload.space = decoded.space;
        payload.programId = decoded.programId.toBase58();
        payload.basePubkey = decoded.basePubkey.toBase58();
    } 
    else if (instructionType == 'Assign') {
        const decoded = SystemInstruction.decodeAssign(instruction);
        payload.accountPubkey = decoded.accountPubkey.toBase58();
        payload.programId = decoded.programId.toBase58();
    } 
    else if (instructionType == 'AssignWithSeed') {
        const decoded = SystemInstruction.decodeAssignWithSeed(instruction);
        payload.accountPubkey = decoded.accountPubkey.toBase58();
        payload.seed = decoded.seed;
        payload.programId = decoded.programId.toBase58();
        payload.basePubkey = decoded.basePubkey.toBase58();
    } 
    else if (instructionType == 'Create') {
        const decoded = SystemInstruction.decodeCreateAccount(instruction);
        payload.fromPubkey = decoded.fromPubkey.toBase58();
        payload.newAccountPubkey = decoded.newAccountPubkey.toBase58();
        payload.space = decoded.space;
        payload.programId = decoded.programId.toBase58();
        const lamports = Number(decoded.lamports);
        const uiAmount = lamports / LAMPORTS_PER_SOL;
        payload.lamports = lamports;
        payload.uiAmount = uiAmount;
    }
    else if (instructionType == 'CreateWithSeed') {
        const decoded = SystemInstruction.decodeCreateWithSeed(instruction);
        payload.fromPubkey = decoded.fromPubkey.toBase58();
        payload.newAccountPubkey = decoded.newAccountPubkey.toBase58();
        payload.seed = decoded.seed;
        payload.space = decoded.space;
        payload.programId = decoded.programId.toBase58();
        payload.basePubkey = decoded.basePubkey.toBase58();
        const lamports = Number(decoded.lamports);
        const uiAmount = lamports / LAMPORTS_PER_SOL;
        payload.lamports = lamports;
        payload.uiAmount = uiAmount;
    }
    else if (instructionType == 'AdvanceNonceAccount') {
        const decoded = SystemInstruction.decodeNonceAdvance(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58();
        payload.noncePubkey = decoded.noncePubkey.toBase58();
    }
    else if (instructionType == 'AuthorizeNonceAccount') {
        const decoded = SystemInstruction.decodeNonceAuthorize(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58();
        payload.newAuthorizedPubkey = decoded.newAuthorizedPubkey.toBase58();
        payload.noncePubkey = decoded.noncePubkey.toBase58();
    }
    else if (instructionType == 'InitializeNonceAccount') {
        const decoded = SystemInstruction.decodeNonceInitialize(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58();
        payload.noncePubkey = decoded.noncePubkey.toBase58();
    }
    else if (instructionType == 'WithdrawNonceAccount') {
        const decoded = SystemInstruction.decodeNonceWithdraw(instruction);
        payload.authorizedPubkey = decoded.authorizedPubkey.toBase58();
        payload.noncePubkey = decoded.noncePubkey.toBase58();
        payload.toPubkey = decoded.toPubkey.toBase58();
        payload.lamports = decoded.lamports;
        payload.uiAmount = decoded.lamports / LAMPORTS_PER_SOL;
    }
    else if (instructionType == 'Transfer') {
        const decoded = SystemInstruction.decodeTransfer(instruction);
        payload.fromPubkey = decoded.fromPubkey.toBase58();
        payload.toPubkey = decoded.toPubkey.toBase58();
        const lamports = Number(decoded.lamports);
        payload.lamports = lamports;
        payload.uiAmount = lamports / LAMPORTS_PER_SOL;
    }
    else if (instructionType == 'TransferWithSeed') {
        const decoded = SystemInstruction.decodeTransferWithSeed(instruction);
        payload.fromPubkey = decoded.fromPubkey.toBase58();
        payload.toPubkey = decoded.toPubkey.toBase58();
        payload.seed = decoded.seed;
        payload.programId = decoded.programId.toBase58();
        payload.basePubkey = decoded.basePubkey.toBase58();
        const lamports = Number(decoded.lamports);
        payload.lamports = lamports;
        payload.uiAmount = lamports / LAMPORTS_PER_SOL;
    }
    else {
    }
    return payload;

}

// module.exports = { parseSystemInstruction };
export { parseSystemInstruction };