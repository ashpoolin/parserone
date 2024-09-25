const programIdlMap = new Map([
    [
      "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
      {
        programName: "associated-token",
        programIDL: "spl_associated_token_account.json"
      }
    ],
    [
      "F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7",
      {
        programName: "sol-incinerator",
        programIDL: "incinerator_contract.json"
      }
    ],
    [
      "SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy",
      {
        programName: "stake-pool",
        programIDL: "spl_stake_pool.json"
      }
    ],
    [
      "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
      {
        programName: "drift",
        programIDL: "drift.json"
      }
    ],
    [
    	"strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m",
    	{
    		programName: "streamflow",
    		programIDL: "streamflow-timelock.json"
    	}
    ],
    [
    	"meRjbQXFNf5En86FXT2YPz1dQzLj4Yb3xK8u1MVgqpb",
    	{
    		programName: "jupiter-merkle-distributor",
    		programIDL: "jupiter_merkle_distributor.json"
    	}
    ],
    [
    	"mERKcfxMC5SqJn4Ld4BUris3WKZZ1ojjWJ3A3J5CKxv",
    	{
    		programName: "jito-merkle-distributor",
    		programIDL: "jito_merkle_distributor.json"
    	}
    ],
    [
    	"MErKy6nZVoVAkryxAejJz2juifQ4ArgLgHmaJCQkU7N",
    	{
    		programName: "merkle-distributor",
    		programIDL: "merkle_distributor.json"
    	}
    ],
    [
    	"MRKGLMizK9XSTaD1d1jbVkdHZbQVCSnPpYiTw9aKQv8",
    	{
    		programName: "saber-merkle-distributor",
        programIDL: "saber_merkle_distributor.json"
      }
    ],
    [
      "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY",
      {
        programName: "phoenix",
        programIDL: "phoenix_v1.json"
      }
    ],
    [
      "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
      {
        programName: "raydium-lp-amm",
        programIDL: "raydium_amm.json"
      }
    ],
    [
      "ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD",
      {
        programName: "zeta",
        programIDL: "zeta.json"
      }
    ],
    [
      "4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg",
      {
        programName: "mango-v4",
        programIDL: "mango_v4.json"
      }
    ],
    [
      "opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb",
      {
        programName: "openbook-v2",
        programIDL: "openbook_v2.json"
      }
    ],
    [
      "monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih",
      {
        programName: "monaco-protocol",
        programIDL: "monaco_protocol.json"
      }
    ],
    [
      "GFXsSL5sSaDfNFQUYsHekbWBW1TsFdjDYzACh62tEHxn",
      {
        programName: "gfx-ssl-v2",
        programIDL: "gfx_ssl_v2.json"
      }
    ],
    [
      "TCMPhJdwDryooaGtiocG1u3xcYbRpiJzb283XfCZsDp",
      {
        programName: "tcomp",
        programIDL: "tcomp.json"
      }
    ],
    [
      "PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu",
      {
        programName: "perpetuals",
        programIDL: "perpetuals.json"
      }
    ],
    [
      "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD",
      {
        programName: "kamino-lending",
        programIDL: "kamino_lending.json"
      }
    ],
    [
      "rorcfdX4h9m9swCKgcypaHJ8NGYVANBpmV9EHn3cYrF",
      {
        programName: "helium-rewards-oracle",
        programIDL: "rewards_oracle.json"
      }
    ],
    [
      "sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx",
      {
        programName: "switchboard-attestation-program",
        programIDL: "switchboard_attestation_program.json"
      }
    ],
    [
      "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
      {
        programName: "pump-fun",
        programIDL: "pump-fun.json"
      }
    ],
    [
      "MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA",
      {
        programName: "marginfi-v2",
        programIDL: "marginfi.json"
      }
    ],
    [
      "nosJhNRqr2bc9g1nfGDcXXTXvYUmxD4cVwy2pMWhrYM",
      {
        programName: "nosana-jobs",
        programIDL: "nosana_jobs.json"
      }
    ],
    [
      "voTpe3tHQ7AjQHMapgSue2HJFAh2cGsdokqN3XqmVSj",
      {
        programName: "locked-voter",
        programIDL: "locked_voter.json"
      }
    ],
    [
      "nosRB8DUV67oLNrL45bo2pFLrmsWPiewe2Lk2DRNYCp",
      {
        programName: "nosana-rewards",
        programIDL: "nosana_rewards.json"
      }
    ],
    [
      "nosScmHY2uR24Zh751PmGj9ww9QRNHewh9H59AfrTJE",
      {
        programName: "nosana-staking",
        programIDL: "nosana_staking.json"
      }
    ],
    [
      "nosPdZrfDzND1LAR28FLMDEATUPK53K8xbRBXAirevD",
      {
        programName: "nosana-pools",
        programIDL: "nosana_pools.json"
      }
    ],
    [
      "1atrmQs3eq1N2FEYWu6tyTXbCjP4uQwExpjtnhXtS8h",
      {
        programName: "helium-lazy-transactions",
        programIDL: "1atrmQs3eq1N2FEYWu6tyTXbCjP4uQwExpjtnhXtS8h.json"
      }
    ],
    [
      "1NSCRfGeyo7wPUazGbaPBUsTM49e1k2aXewHGARfzSo",
      {
        programName: "1NSCRfGeyo7wPUazGbaPBUsTM49e1k2aXewHGARfzSo",
        programIDL: "1NSCRfGeyo7wPUazGbaPBUsTM49e1k2aXewHGARfzSo.json"
      }
    ],
    [
      "24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi",
      {
        programName: "meteora-vault-program",
        programIDL: "24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi.json"
      }
    ],
    [
      "4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt",
      {
        programName: "4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt",
        programIDL: "4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt.json"
      }
    ],
    [
      "5ocnV1qiCgaQR8Jb8xWnVbApfaygJ8tNoZfgPwsgx9kx",
      {
        programName: "sanctum",
        programIDL: "5ocnV1qiCgaQR8Jb8xWnVbApfaygJ8tNoZfgPwsgx9kx.json"
      }
    ],
    [
      "5pBn2Sxa41SUuTxKR8s91kMn9LHptd7Q9AA7nP6mqa4W",
      {
        programName: "mooar",
        programIDL: "5pBn2Sxa41SUuTxKR8s91kMn9LHptd7Q9AA7nP6mqa4W.json"
      }
    ],
    [
      "5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h",
      {
        programName: "raydium-liquidity-pool-amm",
        programIDL: "5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h.json"
      }
    ],
    [
      "6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc",
      {
        programName: "kamino",
        programIDL: "6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc.json"
      }
    ],
    [
      "8bvPnYE5Pvz2Z9dE6RAqWr1rzLknTndZ9hwvRE6kPDXP",
      {
        programName: "8bvPnYE5Pvz2Z9dE6RAqWr1rzLknTndZ9hwvRE6kPDXP",
        programIDL: "8bvPnYE5Pvz2Z9dE6RAqWr1rzLknTndZ9hwvRE6kPDXP.json"
      }
    ],
    [
      "ArmN3Av2boBg8pkkeCK9UuCN9zSUVc2UQg1qR2sKwm8d",
      {
        programName: "ArmN3Av2boBg8pkkeCK9UuCN9zSUVc2UQg1qR2sKwm8d",
        programIDL: "ArmN3Av2boBg8pkkeCK9UuCN9zSUVc2UQg1qR2sKwm8d.json"
      }
    ],
    [
      "AU428Z7KbjRMjhmqWmQwUta2AvydbpfEZNBh8dStHTDi",
      {
        programName: "AU428Z7KbjRMjhmqWmQwUta2AvydbpfEZNBh8dStHTDi",
        programIDL: "AU428Z7KbjRMjhmqWmQwUta2AvydbpfEZNBh8dStHTDi.json"
      }
    ],
    [
      "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
      {
        programName: "bubblegum",
        programIDL: "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY.json"
      }
    ],
    [
      "BSwp6bEBihVLdqJRKGgzjcGLHkcTuzmSo1TQkHepzH8p",
      {
        programName: "bonkswap",
        programIDL: "BSwp6bEBihVLdqJRKGgzjcGLHkcTuzmSo1TQkHepzH8p.json"
      }
    ],
    [
      "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
      {
        programName: "raydium-clamm",
        programIDL: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK.json"
      }
    ],
    [
      "CCTPiPYPc6AsJuwueEnWgSgucamXDZwBd53dQ11YiKX3",
      {
        programName: "circle-cctp",
        programIDL: "CCTPiPYPc6AsJuwueEnWgSgucamXDZwBd53dQ11YiKX3.json"
      }
    ],
    [
      "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ",
      {
        programName: "metaplex-nft-candy-machine-v2",
        programIDL: "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ.json"
      }
    ],
    [
      "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
      {
        programName: "jupiter-dca",
        programIDL: "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M.json"
      }
    ],
    [
      "Dooar9JkhdZ7J3LHN3A7YCuoGRUggXhQaG4kijfLGU2j",
      {
        programName: "stepn-swap",
        programIDL: "Dooar9JkhdZ7J3LHN3A7YCuoGRUggXhQaG4kijfLGU2j.json"
      }
    ],
    [
      "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB",
      {
        programName: "meteora-pools-program",
        programIDL: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB.json"
      }
    ],
    [
      "FACTNmq2FhA2QNTnGM2aWJH3i7zT3cND5CgvjYTjyVYe",
      {
        programName: "FACTNmq2FhA2QNTnGM2aWJH3i7zT3cND5CgvjYTjyVYe",
        programIDL: "FACTNmq2FhA2QNTnGM2aWJH3i7zT3cND5CgvjYTjyVYe.json"
      }
    ],
    [
      "FBRWDXSLysNbFQk64MQJcpkXP8e4fjezsGabV8jV7d7o",
      {
        programName: "FBRWDXSLysNbFQk64MQJcpkXP8e4fjezsGabV8jV7d7o",
        programIDL: "FBRWDXSLysNbFQk64MQJcpkXP8e4fjezsGabV8jV7d7o.json"
      }
    ],
    [
      "FLASH6Lo6h3iasJKWDs2F8TkW2UKf3s15C8PMGuVfgBn",
      {
        programName: "FLASH6Lo6h3iasJKWDs2F8TkW2UKf3s15C8PMGuVfgBn",
        programIDL: "FLASH6Lo6h3iasJKWDs2F8TkW2UKf3s15C8PMGuVfgBn.json"
      }
    ],
    [
      "FLEET1qqzpexyaDpqb2DGsSzE2sDCizewCg9WjrA6DBW",
      {
        programName: "staratlas-score-program",
        programIDL: "FLEET1qqzpexyaDpqb2DGsSzE2sDCizewCg9WjrA6DBW.json"
      }
    ],
    [
      "FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH",
      {
        programName: "pyth-oracle",
        programIDL: "FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH.json"
      }
    ],
    [
      "FSWAPViR8ny5K96hezav8jynVubP2dJ2L7SbKzds2hwm",
      {
        programName: "FSWAPViR8ny5K96hezav8jynVubP2dJ2L7SbKzds2hwm",
        programIDL: "FSWAPViR8ny5K96hezav8jynVubP2dJ2L7SbKzds2hwm.json"
      }
    ],
    [
      "GovaE4iu227srtG2s3tZzB4RmWBzw8sTwrCLZz7kN7rY",
      {
        programName: "jupiter-governance",
        programIDL: "GovaE4iu227srtG2s3tZzB4RmWBzw8sTwrCLZz7kN7rY.json"
      }
    ],
    [
      "Hb9pHgxkBMiT15yZvtFKN7a1tRcUAYkSqRkoCuzMFrXq",
      {
        programName: "Hb9pHgxkBMiT15yZvtFKN7a1tRcUAYkSqRkoCuzMFrXq",
        programIDL: "Hb9pHgxkBMiT15yZvtFKN7a1tRcUAYkSqRkoCuzMFrXq.json"
      }
    ],
    [
      "HistoryJTGbKQD2mRgLZ3XhqHnN811Qpez8X9kCcGHoa",
      {
        programName: "jito-stakenet-history-program",
        programIDL: "HistoryJTGbKQD2mRgLZ3XhqHnN811Qpez8X9kCcGHoa.json"
      }
    ],
    [
      "Stewardf95sJbmtcZsyagb2dg4Mo8eVQho8gpECvLx8",
      {
        programName: "jito-steward",
        programIDL: "steward.json"
      }
    ],
    [
      "inscokhJarcjaEs59QbQ7hYjrKz25LEPRfCbP8EmdUp",
      {
        programName: "inscokhJarcjaEs59QbQ7hYjrKz25LEPRfCbP8EmdUp",
        programIDL: "inscokhJarcjaEs59QbQ7hYjrKz25LEPRfCbP8EmdUp.json"
      }
    ],
    [
      "JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp",
      {
        programName: "JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp",
        programIDL: "JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp.json"
      }
    ],
    [
      "JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo",
      {
        programName: "jupiter-aggregator-v2",
        programIDL: "JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo.json"
      }
    ],
    [
      "JUP3c2Uh3WA4Ng34tw6kPd2G4C5BB21Xo36Je1s32Ph",
      {
        programName: "jupiter-aggregator-v3",
        programIDL: "JUP3c2Uh3WA4Ng34tw6kPd2G4C5BB21Xo36Je1s32Ph.json"
      }
    ],
    [
      "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB",
      {
        programName: "jupiter-aggregator-v4",
        programIDL: "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB.json"
      }
    ],
    [
      "JUP5cHjnnCx2DppVsufsLrXs8EBZeEZzGtEK9Gdz6ow",
      {
        programName: "jupiter-aggregator-v5",
        programIDL: "JUP5cHjnnCx2DppVsufsLrXs8EBZeEZzGtEK9Gdz6ow.json"
      }
    ],
    [
      "JUP5pEAZeHdHrLxh5UCwAbpjGwYKKoquCpda2hfP4u8",
      {
        programName: "jupiter-aggregator-v5.1",
        programIDL: "JUP5pEAZeHdHrLxh5UCwAbpjGwYKKoquCpda2hfP4u8.json"
      }
    ],
    [
      "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
      {
        programName: "jupiter-aggregator-v6",
        programIDL: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4.json"
      }
    ],
    [
      "jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu",
      {
        programName: "jupiter-limit-order",
        programIDL: "jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu.json"
      }
    ],
    [
      "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
      {
        programName: "meteora-dlmm",
        programIDL: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo.json"
      }
    ],
    [
      "Leg1xVbrpq5gY6mprak3Ud4q4mBwcJi5C9ZruYjWv7n",
      {
        programName: "Leg1xVbrpq5gY6mprak3Ud4q4mBwcJi5C9ZruYjWv7n",
        programIDL: "Leg1xVbrpq5gY6mprak3Ud4q4mBwcJi5C9ZruYjWv7n.json"
      }
    ],
    [
      "LiquGRWGrp8JKspo8zDDu6qpRmX1p6U3PX2USqiE1eg",
      {
        programName: "LiquGRWGrp8JKspo8zDDu6qpRmX1p6U3PX2USqiE1eg",
        programIDL: "LiquGRWGrp8JKspo8zDDu6qpRmX1p6U3PX2USqiE1eg.json"
      }
    ],
    [
      "Lock7kBijGCQLEFAmXcengzXKA88iDNQPriQ7TbgeyG",
      {
        programName: "Lock7kBijGCQLEFAmXcengzXKA88iDNQPriQ7TbgeyG",
        programIDL: "Lock7kBijGCQLEFAmXcengzXKA88iDNQPriQ7TbgeyG.json"
      }
    ],
    [
      "LocktDzaV1W2Bm9DeZeiyz4J9zs4fRqNiYqQyracRXw",
      {
        programName: "LocktDzaV1W2Bm9DeZeiyz4J9zs4fRqNiYqQyracRXw",
        programIDL: "LocktDzaV1W2Bm9DeZeiyz4J9zs4fRqNiYqQyracRXw.json"
      }
    ],
    [
      "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K",
      {
        programName: "magic-eden-v2",
        programIDL: "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K.json"
      }
    ],
    [
      "M3mxk5W2tt27WGT7THox7PmgRDp4m6NEhL5xvxrBfS1",
      {
        programName: "M3mxk5W2tt27WGT7THox7PmgRDp4m6NEhL5xvxrBfS1",
        programIDL: "M3mxk5W2tt27WGT7THox7PmgRDp4m6NEhL5xvxrBfS1.json"
      }
    ],
    [
      "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD",
      {
        programName: "marinade-finance",
        programIDL: "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD.json"
      }
    ],
    [
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
      {
        programName: "metaplex-token-metadata",
        programIDL: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s.json"
      }
    ],
    [
      "metaX99LHn3A7Gr7VAcCfXhpfocvpMpqQ3eyp3PGUUq",
      {
        programName: "metaX99LHn3A7Gr7VAcCfXhpfocvpMpqQ3eyp3PGUUq",
        programIDL: "metaX99LHn3A7Gr7VAcCfXhpfocvpMpqQ3eyp3PGUUq.json"
      }
    ],
    [
      "mmm3XBJg5gk8XJxEKBvdgptZz6SgK4tXvn36sodowMc",
      {
        programName: "coralcube-magiceden-amm",
        programIDL: "mmm3XBJg5gk8XJxEKBvdgptZz6SgK4tXvn36sodowMc.json"
      }
    ],
    [
      "MR2LqxoSbw831bNy68utpu5n4YqBH3AzDmddkgk9LQv",
      {
        programName: "marinade-staking",
        programIDL: "MR2LqxoSbw831bNy68utpu5n4YqBH3AzDmddkgk9LQv.json"
      }
    ],
    [
      "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ",
      {
        programName: "pyth-staking",
        programIDL: "pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ.json"
      }
    ],
    [
      "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB",
      {
        programName: "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB",
        programIDL: "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB.json"
      }
    ],
    [
      "RainEraPU5yDoJmTrHdYynK9739GkEfDsE4ffqce2BR",
      {
        programName: "RainEraPU5yDoJmTrHdYynK9739GkEfDsE4ffqce2BR",
        programIDL: "RainEraPU5yDoJmTrHdYynK9739GkEfDsE4ffqce2BR.json"
      }
    ],
    [
      "RANDMo5gFnqnXJW5Z52KNmd24sAo95KAd5VbiCtq5Rh",
      {
        programName: "RANDMo5gFnqnXJW5Z52KNmd24sAo95KAd5VbiCtq5Rh",
        programIDL: "RANDMo5gFnqnXJW5Z52KNmd24sAo95KAd5VbiCtq5Rh.json"
      }
    ],
    [
      "SAGEqqFewepDHH6hMDcmWy7yjHPpyKLDnRXKb3Ki8e6",
      {
        programName: "star-atlas-sage",
        programIDL: "SAGEqqFewepDHH6hMDcmWy7yjHPpyKLDnRXKb3Ki8e6.json"
      }
    ],
    [
      "SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv",
      {
        programName: "SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv",
        programIDL: "SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv.json"
      }
    ],
    [
      "SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP",
      {
        programName: "sharkyfi",
        programIDL: "SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP.json"
      }
    ],
    [
      "SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu",
      {
        programName: "squads-multisig-program",
        programIDL: "SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu.json"
      }
    ],
    [
      "SNPRohhBurQwrpwAptw1QYtpFdfEKitr4WSJ125cN1g",
      {
        programName: "sniper-market",
        programIDL: "SNPRohhBurQwrpwAptw1QYtpFdfEKitr4WSJ125cN1g.json"
      }
    ],
    [
      "SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf",
      {
        programName: "squads-program-id-v4",
        programIDL: "SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf.json"
      }
    ],
    [
      "stkitrT1Uoy18Dk1fTrgPw8W6MVzoCfYoAFT4MLsmhq",
      {
        programName: "sanctum-router-program",
        programIDL: "stkitrT1Uoy18Dk1fTrgPw8W6MVzoCfYoAFT4MLsmhq.json"
      }
    ],
    [
      "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f",
      {
        programName: "switchboard-v2",
        programIDL: "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f.json"
      }
    ],
    [
      "TLoCKic2wGJm7VhZKumih4Lc35fUhYqVMgA4j389Buk",
      {
        programName: "TLoCKic2wGJm7VhZKumih4Lc35fUhYqVMgA4j389Buk",
        programIDL: "TLoCKic2wGJm7VhZKumih4Lc35fUhYqVMgA4j389Buk.json"
      }
    ],
    [
      "tovt1VkTE2T4caWoeFP6a2xSFoew5mNpd7FWidyyMuk",
      {
        programName: "tovt1VkTE2T4caWoeFP6a2xSFoew5mNpd7FWidyyMuk",
        programIDL: "tovt1VkTE2T4caWoeFP6a2xSFoew5mNpd7FWidyyMuk.json"
      }
    ],
    [
      "traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg",
      {
        programName: "staratlas-marketplace-program",
        programIDL: "traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg.json"
      }
    ],
    [
      "TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN",
      {
        programName: "tensor-swap",
        programIDL: "TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN.json"
      }
    ],
    [
      "TWAPrdhADy2aTKN5iFZtNnkQYXERD9NvKjPFVPMSCNN",
      {
        programName: "TWAPrdhADy2aTKN5iFZtNnkQYXERD9NvKjPFVPMSCNN",
        programIDL: "TWAPrdhADy2aTKN5iFZtNnkQYXERD9NvKjPFVPMSCNN.json"
      }
    ],
    [
      "vaU1tVLj8RFk7mNj1BxqgAsMKKaL8UvEUHvU3tdbZPe",
      {
        programName: "vaU1tVLj8RFk7mNj1BxqgAsMKKaL8UvEUHvU3tdbZPe",
        programIDL: "vaU1tVLj8RFk7mNj1BxqgAsMKKaL8UvEUHvU3tdbZPe.json"
      }
    ],
    [
      "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
      {
        programName: "orca",
        programIDL: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc.json"
      }
    ],
    [
      "zF2vSz6V9g1YHGmfrzsY497NJzbRr84QUrPry4bLQ25",
      {
        programName: "zF2vSz6V9g1YHGmfrzsY497NJzbRr84QUrPry4bLQ25",
        programIDL: "zF2vSz6V9g1YHGmfrzsY497NJzbRr84QUrPry4bLQ25.json"
      }
    ]
  ]);
  
  export default programIdlMap;