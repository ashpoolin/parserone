# ParserOne
IDL-based command-line parser for Solana transactions (written in Node.js).

## Native Program Support
- System Program
- Stake Program
- Token Program
- Vote Program
- Compute Budget Program

Changes (from parserzero)
- format output to JSON by default. Too many variables to consistently print to csv. However, added csvify program to give transaction metadata, Helius-augmented descriptions (optional), and balance changes (owner or signer [default]).

## Upgrades 
- NEW: Now supports parsing of IDLs for about 100 programs (see Appendix: Supported IDLs)
- Inner instructions
- Supports versioned transactions (legacy + V0)
- "Augmented" tx parsing Descriptions from Helius enhanced API
- Owner or signer SOL and token balance changes
- Trade indicator flag (find presence of 2 balance changes for sol balance and/or token balances)
- Includes signatures.js script for merely recovering all signatures for a specific address. This is helpful for acquiring metadata about account behavior, or isolating the first transaction for an address.
- Added csvify_parsed.js for easy parsing of the output into a csv summary file.

## To Do
- Fix the discriminator error for SPL token program
- Add token22 support
- Fix various broken IDLs
- Increase parsing speed (slow as fuck)
- ???
- Profit. 

## ParserOne Usage
1. You need to create an anchor wallet and keep it in the same directory as index.js to be able to parse transactions. IDK why, but it's required to work properly.

    `$ solana-keygen new --no-bip39-passphrase --outfile ./anchor_wallet.json`

2. Update the .env file. You will need to declare the following:
    - SOLANA_CONNECTION - Your Solana RPC endpoint
    - HELIUS_ENHANCED_API - Your Helius enhanced API endpoint (optional, only if you want to use the Helius enhanced API flag)
    - ANCHOR_WALLET - Your anchor wallet file location (required)

3. Run the script:

    `$ node index.js <signature> <owner or __NULL__> <enhanced api flag>`

    Example:

    `node index.js 5Jqj6M5jhQoWfzJEfqrY8GqBgn8TqL9xwbv7RDyUZiyEfH2H2CfGPTJSxgFZuxsRbnqhBDN3d7bPwEy1ju76YZot __NULL__ 1`

    This will parse the transaction and use the signer as the "owner" for the of the SOL and token balances. If you want to return balance changes for a specific address, you can do so by specifying that address as the "owner" address for the second parameter.

    The parsed transaction is outputted as an array of objects. The first object is the transaction metadata, and the rest of the objects are the instructions within the transaction.

    Example Output:
    ```
    [
        {
            "signature": "5Jqj6M5jhQoWfzJEfqrY8GqBgn8TqL9xwbv7RDyUZiyEfH2H2CfGPTJSxgFZuxsRbnqhBDN3d7bPwEy1ju76YZot",
            "slot": 291699280,
            "blocktime": 1727169639,
            "err": null,
            "fee": 0.00001,
            "enhancedDescription": "2t7tHVuwWvMjAETbeETBisGtf7CPXgdFagNfrjfFNWEm withdrew 25040.382830073 SOL from B3wwgWYQcNze911MGz9BgN2E4spv48j4LnNUNhZhvaPS.",
            "enhancedType": "WITHDRAW",
            "enhancedSource": "STAKE_PROGRAM",
            "enhancedFeePayer": "2t7tHVuwWvMjAETbeETBisGtf7CPXgdFagNfrjfFNWEm",
            "owner": null,
            "allBalanceChanges": [
            {
                "pubkey": "2t7tHVuwWvMjAETbeETBisGtf7CPXgdFagNfrjfFNWEm",
                "isOwner": true,
                "isSigner": true,
                "preBalance": 4025.976472233,
                "postBalance": 29066.359292306,
                "changeBalance": 25040.382820073
            },
            {
                "pubkey": "6WwYZH8zdqF7kELtRfo1yAnvD1wvXwTg4m1jBhUCqC68",
                "isOwner": false,
                "isSigner": true,
                "preBalance": 0.01999,
                "postBalance": 0.01999,
                "changeBalance": 0
            },
            {
                "pubkey": "B3wwgWYQcNze911MGz9BgN2E4spv48j4LnNUNhZhvaPS",
                "isOwner": false,
                "isSigner": false,
                "preBalance": 25040.382830073,
                "postBalance": 0,
                "changeBalance": -25040.382830073
            }
            ],
            "allTokenBalanceChanges": [],
            "ownerBalanceChanges": {
            "pubkey": "2t7tHVuwWvMjAETbeETBisGtf7CPXgdFagNfrjfFNWEm",
            "isOwner": true,
            "isSigner": true,
            "preBalance": 4025.976472233,
            "postBalance": 29066.359292306,
            "changeBalance": 25040.382820073
            },
            "ownerTokenBalanceChanges": [],
            "signers": [
            "2t7tHVuwWvMjAETbeETBisGtf7CPXgdFagNfrjfFNWEm",
            "6WwYZH8zdqF7kELtRfo1yAnvD1wvXwTg4m1jBhUCqC68"
            ],
            "preBalance_sol": 4025.976472233,
            "postBalance_sol": 29066.359292306,
            "changeBalance_sol": 25040.382820073,
            "accountIndex_inc": null,
            "account_inc": null,
            "mint_inc": null,
            "preBalance_inc": null,
            "postBalance_inc": null,
            "changeBalance_inc": null,
            "accountIndex_dec": null,
            "account_dec": null,
            "mint_dec": null,
            "preBalance_dec": null,
            "postBalance_dec": null,
            "changeBalance_dec": null,
            "ownerTokenBalanceChanges_overflow": null,
            "trade": 0
        },
        [
            {
            "program": "system",
            "type": "AdvanceNonceAccount",
            "authorizedPubkey": "6WwYZH8zdqF7kELtRfo1yAnvD1wvXwTg4m1jBhUCqC68",
            "noncePubkey": "HoAGnvTdp4Qgrq3NWtNQFS6FixasBhLqui23Seq7riSw"
            }
        ],
        [
            {
            "program": "stake",
            "type": "Withdraw",
            "authorizedPubkey": "2t7tHVuwWvMjAETbeETBisGtf7CPXgdFagNfrjfFNWEm",
            "custodianPubkey": null,
            "stakePubkey": "B3wwgWYQcNze911MGz9BgN2E4spv48j4LnNUNhZhvaPS",
            "toPubkey": "2t7tHVuwWvMjAETbeETBisGtf7CPXgdFagNfrjfFNWEm",
            "lamports": 25040382830073,
            "uiAmount": 25040.382830073
            }
        ],
        [
            {
            "program": "compute-budget",
            "type": "SetComputeUnitLimit",
            "units": 1260
            }
        ],
        [
            {
            "program": "compute-budget",
            "type": "SetComputeUnitPrice",
            "microLamports": 0
            }
        ]
    ]
    ```

## Signatures.js Usage

Basic usage (output to JSON):
`node signatures.js <ADDRESS> <sig_limit> <blocktime_limit>`

Output to CSV:
`node signatures.js <ADDRESS> <sig_limit> <blocktime_limit> | jq . | grep -v memo | sed 's/\\//g' | sed 's/$//g' | in2csv --format json > <ADDRESS>_signatures.csv`

This will output a file with all the signatures for the given address.

Get only signatures using csvkit: 
`csvcut -c signature signatures.csv | tail -n +2 > signatures.txt`

## Advanced Usage
The value of having the parser on the command line is that you can parse transactions in bulk. With a suitable machine, you can parse many signatures in parallel. Say you have a list of signatures (see step above), you can parse them like so:
`cat signatures.txt | parallel -j 32 node index.js {} __NULL__ 1 ">" {}.json`

This creates a lot of files of parsed transactions. If you want to get the high-level view of these transactions in a csv, you can use the following command:

`cat *.json | parallel -j 32 node csvify_parsed.js {} > csv_summary.csv`


### It's really that easy!


## Contribute
If this tool is helpful to you, please consider contributing to the project by adding support for more programs or refining the existing code. I am not a code artisan, rather a pragmatist. Somebody with a modicum of standards and a knack for performance improvements would be welcome. Thanks!


## Appendix: Supported IDLs
ArmN3Av2boBg8pkkeCK9UuCN9zSUVc2UQg1qR2sKwm8d
AU428Z7KbjRMjhmqWmQwUta2AvydbpfEZNBh8dStHTDi
BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY
BSwp6bEBihVLdqJRKGgzjcGLHkcTuzmSo1TQkHepzH8p
CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK
CCTPiPYPc6AsJuwueEnWgSgucamXDZwBd53dQ11YiKX3
cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ
DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M
Dooar9JkhdZ7J3LHN3A7YCuoGRUggXhQaG4kijfLGU2j
drift
Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB
FACTNmq2FhA2QNTnGM2aWJH3i7zT3cND5CgvjYTjyVYe
FBRWDXSLysNbFQk64MQJcpkXP8e4fjezsGabV8jV7d7o
FLASH6Lo6h3iasJKWDs2F8TkW2UKf3s15C8PMGuVfgBn
FLEET1qqzpexyaDpqb2DGsSzE2sDCizewCg9WjrA6DBW
FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH
FSWAPViR8ny5K96hezav8jynVubP2dJ2L7SbKzds2hwm
gfx_ssl_v2
GovaE4iu227srtG2s3tZzB4RmWBzw8sTwrCLZz7kN7rY
Hb9pHgxkBMiT15yZvtFKN7a1tRcUAYkSqRkoCuzMFrXq
HistoryJTGbKQD2mRgLZ3XhqHnN811Qpez8X9kCcGHoa
incinerator_contract
inscokhJarcjaEs59QbQ7hYjrKz25LEPRfCbP8EmdUp
JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp
jito_merkle_distributor
JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo
JUP3c2Uh3WA4Ng34tw6kPd2G4C5BB21Xo36Je1s32Ph
JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB
JUP5cHjnnCx2DppVsufsLrXs8EBZeEZzGtEK9Gdz6ow
JUP5pEAZeHdHrLxh5UCwAbpjGwYKKoquCpda2hfP4u8
JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4
jupiter_merkle_distributor
jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu
kamino_lending
LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo
Leg1xVbrpq5gY6mprak3Ud4q4mBwcJi5C9ZruYjWv7n
LiquGRWGrp8JKspo8zDDu6qpRmX1p6U3PX2USqiE1eg
Lock7kBijGCQLEFAmXcengzXKA88iDNQPriQ7TbgeyG
locked_voter
LocktDzaV1W2Bm9DeZeiyz4J9zs4fRqNiYqQyracRXw
M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K
M3mxk5W2tt27WGT7THox7PmgRDp4m6NEhL5xvxrBfS1
mango_v4
MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD
marginfi
merkle_distributor
metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s
metaX99LHn3A7Gr7VAcCfXhpfocvpMpqQ3eyp3PGUUq
mmm3XBJg5gk8XJxEKBvdgptZz6SgK4tXvn36sodowMc
monaco_protocol
MR2LqxoSbw831bNy68utpu5n4YqBH3AzDmddkgk9LQv
nosana_jobs
nosana_pools
nosana_rewards
nosana_staking
openbook_v2
perpetuals
phoenix_v1
pump-fun
pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ
QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB
RainEraPU5yDoJmTrHdYynK9739GkEfDsE4ffqce2BR
RANDMo5gFnqnXJW5Z52KNmd24sAo95KAd5VbiCtq5Rh
raydium_amm
raydium_clmm_amm_v3
rewards_oracle
saber_merkle_distributor
SAGEqqFewepDHH6hMDcmWy7yjHPpyKLDnRXKb3Ki8e6
SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv
SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP
sharky
SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu
SNPRohhBurQwrpwAptw1QYtpFdfEKitr4WSJ125cN1g
spl_associated_token_account
spl_stake_pool
SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf
steward
stkitrT1Uoy18Dk1fTrgPw8W6MVzoCfYoAFT4MLsmhq
streamflow-timelock
SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f
switchboard_attestation_program
tcomp
TLoCKic2wGJm7VhZKumih4Lc35fUhYqVMgA4j389Buk
tovt1VkTE2T4caWoeFP6a2xSFoew5mNpd7FWidyyMuk
traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg
TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN
TWAPrdhADy2aTKN5iFZtNnkQYXERD9NvKjPFVPMSCNN
vaU1tVLj8RFk7mNj1BxqgAsMKKaL8UvEUHvU3tdbZPe
whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc
zeta
zF2vSz6V9g1YHGmfrzsY497NJzbRr84QUrPry4bLQ25
1atrmQs3eq1N2FEYWu6tyTXbCjP4uQwExpjtnhXtS8h
1NSCRfGeyo7wPUazGbaPBUsTM49e1k2aXewHGARfzSo
4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt
5ocnV1qiCgaQR8Jb8xWnVbApfaygJ8tNoZfgPwsgx9kx
5pBn2Sxa41SUuTxKR8s91kMn9LHptd7Q9AA7nP6mqa4W
5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h
6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc
8bvPnYE5Pvz2Z9dE6RAqWr1rzLknTndZ9hwvRE6kPDXP
24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi