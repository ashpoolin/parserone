// compute-budget.js

// const { LAMPORTS_PER_SOL, ComputeBudgetInstruction } = require('@solana/web3.js');
import { LAMPORTS_PER_SOL, ComputeBudgetInstruction } from '@solana/web3.js';

// Compute Budget Program Instructions Key:
// RequestUnits         decodeRequestUnits
// RequestHeapFrame     decodeRequestHeapFrame
// SetComputeUnitLimit  decodeSetComputeUnitLimit
// SetComputeUnitPrice  decodeSetComputeUnitPrice

async function parseComputeBudgetInstruction(txContext, disc, instruction, ix) {

    const program = 'compute-budget'
    const instructionType = ComputeBudgetInstruction.decodeInstructionType(instruction);


    const payload = {}
    payload.program = program
    payload.type = instructionType


    if (instructionType == 'RequestUnits') {
        const decoded = ComputeBudgetInstruction.decodeRequestUnits(instruction);
        payload.units = decoded.units
        payload.additionalFee = decoded.additionalFee
    }
    else if (instructionType == 'RequestHeapFrame') {
        const decoded = ComputeBudgetInstruction.decodeRequestHeapFrame(instruction);
        payload.bytes = decoded.bytes
    }
    else if (instructionType == 'SetComputeUnitLimit') {
        const decoded = ComputeBudgetInstruction.decodeSetComputeUnitLimit(instruction);
        payload.units = decoded.units

    }
    else if (instructionType == 'SetComputeUnitPrice') {
        const decoded = ComputeBudgetInstruction.decodeSetComputeUnitPrice(instruction);
        payload.microLamports = Number(decoded.microLamports)
        // payload.uiAmount = Number(decoded.microLamports) * 1.0E-6 / LAMPORTS_PER_SOL
    }
    else {

    }
    return payload;
}
// module.exports = { parseComputeBudgetInstruction };
export { parseComputeBudgetInstruction };