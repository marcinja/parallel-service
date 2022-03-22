import { ApiPromise, WsProvider } from '@polkadot/api'
import { options } from '@parallel-finance/api'
import { typesBundle } from '@parallel-finance/type-definitions'
import { BigNumber } from 'bignumber.js'
import { toUtcTimestamp, getAppLogger } from '@parallel/lib'

const log = getAppLogger('service-query')

function bigIntStr(hex: string): string {
    return BigInt(hex).toString(10)
}

export type PositionData = {
    borrowBalance: string
    borrowIndex: string
    supplyBalance: string
    totalEarnedPrior: number
    exchangeRatePrior: string
    exchangeRate: string
}

type AssetMeta = {
    deposit: number
    name: string
    symbol: string
    decimals: number
    isFrozen: boolean
}

export class ApiService {
    static api: ApiPromise

    static async init(endpoint: string) {
        const api = await ApiPromise.create(
            options({
                types: {
                    TAssetBalance: 'Balance',
                },
                typesBundle,
                provider: new WsProvider(endpoint),
            })
        )
        this.api = api
    }

    static async getAssets(): Promise<number[]> {
        try {
            const assets = await this.api.query.assets.asset.keys()
            return assets.map((key: any) => {
                let asset: string = key.toHuman()[0]
                if (asset.includes(',')) {
                    asset = asset.replaceAll(',', '')
                }
                return Number(asset)
            })
        } catch (e: any) {
            log.error(`fetch asset list error: %o`, e)
            throw 'fetch asset id list error'
        }
    }

    static async getAssetMeta(assetId: number): Promise<AssetMeta> {
        const meta = (await this.api.query.assets.metadata(assetId)).toHuman()
        return meta as unknown as AssetMeta
    }

    static async getExchangeRate(assetId: number, blockHash?: string): Promise<string> {
        if (blockHash) {
            return bigIntStr((await (await ApiService.api.at(blockHash)).query.loans.exchangeRate(assetId)).toString())
        }
        return bigIntStr((await ApiService.api.query.loans.exchangeRate(assetId)).toString())
    }

    static async getBalance(assetId: number, address: string) {
        const re = (await ApiService.api.query.assets.account(assetId, address)).toJSON()
        log.info('get balance result: %o', re)
    }

    static async getAccountBorrows(assetId: number, address: string, blockHash?: string) {
        if (blockHash) {
            return (await (await ApiService.api.at(blockHash)).query.loans.accountBorrows(assetId, address)).toJSON()
        }
        return (await ApiService.api.query.loans.accountBorrows(assetId, address)).toJSON()
    }

    static async getAccountDeposits(assetId: number, address: string, blockHash?: string) {
        if (blockHash) {
            return (await (await ApiService.api.at(blockHash)).query.loans.accountDeposits(assetId, address)).toJSON()
        }
        return (await ApiService.api.query.loans.accountDeposits(assetId, address)).toJSON()
    }

    static async getAccountEarned(assetId: number, address: string, blockHash?: string) {
        if (blockHash) {
            return (await (await ApiService.api.at(blockHash)).query.loans.accountEarned(assetId, address)).toJSON()
        }
        return (await ApiService.api.query.loans.accountEarned(assetId, address)).toJSON()
    }

    static async getBorrowIndex(assetId: number, blockHash?: string) {
        if (blockHash) {
            return bigIntStr((await (await ApiService.api.at(blockHash)).query.loans.borrowIndex(assetId)).toString())
        }
        return bigIntStr((await ApiService.api.query.loans.borrowIndex(assetId)).toString())
    }

    static async getLiquidityValue(assetId: number, blockHash?: string) {
        if (blockHash)
            return (
                await ((await ApiService.api.at(blockHash)) as any).rpc.oracle.getValue('Aggregated', assetId)
            ).toHuman()
        return (await (ApiService.api as any).rpc.oracle.getValue('Aggregated', assetId)).toHuman()
    }

    static async getRawValue(assetId: number, blockHash?: string) {
        if (blockHash)
            return (
                await ((await ApiService.api.at(blockHash)) as any).query.oracle.rawValues(
                    'hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK',
                    assetId
                )
            ).toHuman()
        return (
            await (ApiService.api as any).query.oracle.rawValues(
                'hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK',
                assetId
            )
        ).toHuman()
    }

    static async getAccountLendingStorage(address: string, assetId: number) {
        const curBlock = Number((await this.api.query.system.number()).toHex())
        const curBlockHash = (await this.api.rpc.chain.getBlockHash(curBlock)).toString()
        const blockTimestamp = Number((await (await this.api.at(curBlockHash)).query.timestamp.now()).toHex())
        const timestamp = toUtcTimestamp(blockTimestamp)

        log.debug(
            `handle account position meta: block[${curBlock}]-blockHash[${curBlockHash}]-${blockTimestamp}-${timestamp}`
        )

        const re: any = await Promise.all([
            this.getAccountBorrows(assetId, address, curBlockHash),
            this.getBorrowIndex(assetId, curBlockHash),
            this.getAccountDeposits(assetId, address, curBlockHash),
            this.getAccountEarned(assetId, address, curBlockHash),
            this.getExchangeRate(assetId, curBlockHash),
        ])
        const [borrows, borrowIndex, supplys, totalEarned, exchangeRate] = re
        let borrowBalance = '0'
        const isZero = borrows.principal != 0
        if (isZero) {
            borrowBalance = new BigNumber(borrowIndex)
                .dividedBy(new BigNumber(borrows.borrowIndex))
                .multipliedBy(new BigNumber(borrows.principal))
                .integerValue()
                .toString()
            log.warn(`borrows princal not zero: get borrow balance: ${borrowBalance}`)
        }

        let supplyBalance = bigIntStr(supplys.voucherBalance.toString())
        const result = {
            borrowBalance,
            supplyBalance,
            borrowIndex,
            totalEarnedPrior: totalEarned.totalEarnedPrior,
            exchangeRatePrior: bigIntStr(totalEarned.exchangeRatePrior),
            exchangeRate,
            blockNumber: curBlock,
            blockTimestamp: timestamp,
        }
        return result
    }
}
