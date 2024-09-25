import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import programIdlMap from './utils/idlMap.js'
import anchor from "@project-serum/anchor";
import bs58 from 'bs58';
import BN from 'bn.js';
import fs from "fs";
import { PublicKey } from '@solana/web3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function parseUnknownInstruction(txContext, disc, instruction, ix, program, programId) {
    let payload = {
        program: program || 'unknown',
        programId: programId.toBase58()
    };

    try {
        const programData = programIdlMap.get(programId.toBase58());
        if (!programData) {
            return payload; // Return early if no IDL is found
        } else {
            // console.log("Program data found:", programData);
        }

        payload.program = programData.programName || 'unknown';
        // console.log("Payload:", payload); // still good here

        const idlPath = path.resolve(__dirname, '.', 'idl', programData.programIDL);

        // console.log("Attempting to read IDL from:", idlPath);

        if (!fs.existsSync(idlPath)) {
            // console.log("IDL file doesn't exist:", idlPath);
            return payload; // Return early if IDL file doesn't exist
        }

        const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
        // console.log("IDL loaded successfully");
        const anchorProgram = new anchor.Program(idl, programId);
        // console.log("Anchor program created successfully");

        const ixHex = Buffer.from(ix).toString('hex');
        // console.log("Instruction hex:", ixHex);
        const decodedInstruction = anchorProgram.coder.instruction.decode(ixHex);
        // console.log("Decoded instruction:", decodedInstruction);

        if (!decodedInstruction) {
            return payload; // Return early if instruction couldn't be decoded
        }

        payload.type = decodedInstruction.name;

        // Process decoded data
        for (const [key, value] of Object.entries(decodedInstruction.data)) {
            if (value instanceof anchor.BN) {
                payload[key] = value.toString();
            } else if (value instanceof PublicKey) {
                payload[key] = value.toBase58();
            } else if (Array.isArray(value)) {
                payload[key] = value.map(item => 
                    item instanceof PublicKey ? item.toBase58() : 
                    item instanceof anchor.BN ? item.toString() : 
                    item
                );
            } else {
                payload[key] = value;
            }
        }

        // Process accounts
        const instructionAccounts = idl.instructions.find(instr => instr.name === decodedInstruction.name)?.accounts || [];
        instructionAccounts.forEach((account, index) => {
            if (index < instruction.keys.length) {
                payload[account.name] = instruction.keys[index].pubkey.toBase58();
            }
        });
        
        // avoiding weird overwrites, so putting this at the end.
        payload.program = programData.programName || program || 'unknown';


    } catch (error) {
        console.error(`Error parsing instruction for program ${programId.toBase58()}:`, error);
        payload.error = 'Failed to parse instruction';
    }

    // console.log("Payload:", payload);
    return payload;
}

export { parseUnknownInstruction };