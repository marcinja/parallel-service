import { gql, request } from 'graphql-request'
import { getConnection } from 'typeorm'
import { getAppLogger, dayFromUtcTimestamp, sleeps } from '@parallel/lib'
import { LendingAction, LendingAssetConfigure, LendingMarketConfigure, LendingPosition } from '../../models'
import { addNewAction } from '../pgsql'
import { RedisService } from '../redis'
import { lastProcessedData } from '.'

const log = getAppLogger('service-lending')
const FETCH_BLOCK = 1

type ActionNode = {
    id: string
    blockHeight: number
    address: string
    method: string
    assetId: number
    value: string
    exchangeRate: string
    borrowIndex: string
    supplyBalance: string
    borrowBalance: string
    timestamp: string
    totalEarnedPrior: number
    exchangeRatePrior: string
}

type MarketConfigNode = {
    id: string
    blockHeight: number
    assetId: number
    collateralFactor: string
    closeFactor: string
    reserveFactor: string
    borrowCap: string
    liquidationIncentive: string
    marketStatus: string
    timestamp: string
}

type AssetConfigNode = {
    id: string
    assetId: number
    blockHeight: number
    totalSupply: string
    totalBorrows: string
    totalReserves: string
    borrowIndex: string
    borrowRate: string
    supplyRate: string
    exchangeRate: string
    utilizationRatio: string
    lastAccruedTimestamp: string
    timestamp: string
}

async function actionHandler(nodes: ActionNode[]) {
    try {
        for (let node of nodes) {
            const token = await RedisService.getToken(node.assetId)
            log.debug(`add new action[${node.method}] of token[${token}]`)
            await addNewAction({
                id: node.id,
                block_number: node.blockHeight,
                address: node.address,
                token,
                amount: node.value,
                method: node.method,
                exchange_rate: node.exchangeRate,
                supply_balance: node.supplyBalance,
                borrow_balance: node.borrowBalance,
                borrow_index: node.borrowIndex,
                block_timestamp: node.timestamp,
            } as LendingAction)

            await positionHandler(node)
        }
    } catch (e: any) {
        log.error(`handle action nodes error: %o`, e)
    }
}

async function positionHandler(node: ActionNode) {
    // add or update new position data according to action
    // update account & asset info to redis cache

    try {
        const symbol = await RedisService.getToken(node.assetId)
        const decimals = await RedisService.getDecimals(node.assetId)
        const day = dayFromUtcTimestamp(node.timestamp)

        await getConnection()
            .getRepository(LendingPosition)
            .save({
                id: `${node.address}-${node.assetId}-${day}`,
                address: node.address,
                symbol,
                decimals,
                supply_balance: node.supplyBalance,
                borrow_balance: node.borrowBalance,
                exchange_rate: node.exchangeRate,
                block_number: node.blockHeight,
                block_timestamp: node.timestamp,
            } as LendingPosition)

        // update cache
        await RedisService.updateAccount(node.address, node.assetId)
    } catch (e: any) {
        log.error(`handle position error: %o`, e)
    }
}

async function marketHandler(nodes: MarketConfigNode[]) {
    try {
        for (let node of nodes) {
            const symbol = await RedisService.getToken(node.assetId)
            const decimals = await RedisService.getDecimals(node.assetId)

            const day = dayFromUtcTimestamp(node.timestamp)
            log.debug(`add new market configure of token[${symbol}]`)

            await getConnection()
                .getRepository(LendingMarketConfigure)
                .save({
                    id: `${node.assetId}-${day}`,
                    symbol,
                    collateral_factor: node.collateralFactor,
                    close_factor: node.closeFactor,
                    reserve_factor: node.reserveFactor,
                    borrow_cap: node.borrowCap,
                    liquidation_incentive: node.liquidationIncentive,
                    decimals,
                    borrow_enabled: node.marketStatus === 'Active',
                    block_number: node.blockHeight,
                    block_timestamp: node.timestamp,
                } as LendingMarketConfigure)
        }
    } catch (e: any) {
        log.error(`handle market configure error: %o`, e)
    }
}

async function assetHandler(nodes: AssetConfigNode[]) {
    try {
        for (let node of nodes) {
            const day = dayFromUtcTimestamp(node.timestamp)
            const symbol = await RedisService.getToken(node.assetId)
            log.debug(`add new asset [${node.assetId}]-${symbol}`)

            await getConnection()
                .getRepository(LendingAssetConfigure)
                .save({
                    id: `${node.assetId}-${day}`,
                    block_number: node.blockHeight,
                    asset_id: node.assetId,
                    symbol,
                    total_supply: node.totalSupply,
                    total_borrows: node.totalBorrows,
                    total_reserves: node.totalReserves,
                    borrow_index: node.borrowIndex,
                    borrow_rate: node.borrowRate,
                    supply_rate: node.supplyRate,
                    exchange_rate: node.exchangeRate,
                    utilization_ratio: node.utilizationRatio,
                    last_accrued_timestamp: node.lastAccruedTimestamp,
                    block_timestamp: node.timestamp,
                } as LendingAssetConfigure)
        }
    } catch (e: any) {
        log.error(`handle asset configure error: %o`, e)
    }
}

const lendingSubql = (block: number) =>
`{
    query {
        lendingActions(
            orderBy: BLOCK_HEIGHT_ASC,
            filter: {
                blockHeight: {
                    equalTo: ${block},
                }
            }
        ) {
            nodes {
                id
                blockHeight
                assetId
                address
                method
                value
                exchangeRate
                borrowIndex
                borrowBalance
                supplyBalance
                timestamp
                totalEarnedPrior
                exchangeRatePrior
            }
        }

        lendingMarketConfigures(
          orderBy: BLOCK_HEIGHT_ASC,
            filter: {
                blockHeight: {
                    equalTo: ${block},
                }
            }
        ) {
            nodes {
                id
                blockHeight
                assetId
                collateralFactor
                closeFactor
                reserveFactor
                liquidationIncentive
                borrowCap
                marketStatus
                timestamp
            }
        }
        lendingAssetConfigures(
          orderBy: BLOCK_HEIGHT_ASC,
            filter: {
                blockHeight: {
                    equalTo: ${block},
                }
            }
        ) {
            nodes {
                id
                blockHeight
                assetId
                totalSupply
                totalBorrows
                totalReserves
                borrowIndex
                borrowRate
                supplyRate
                exchangeRate
                utilizationRatio
                lastAccruedTimestamp
                timestamp
            }
        }
    }
}
`

export async function lendingScanner(endpoint: string, block: number) {
    let { lastProcessedHeight } = await lastProcessedData(endpoint)
    log.info(`lending scanner run at[${block}], current lastProcessedHeight: ${lastProcessedHeight}`)

    while (true) {
        try {
            log.debug(`start to fetch new MM subquery data, block[${block}]`)
            const res = await request(
                endpoint,
                gql`${lendingSubql(block)}`
            )
            const {
                query: { lendingActions, lendingMarketConfigures, lendingAssetConfigures },
            } = res
            const actionNodes = lendingActions.nodes
            const marketNodes = lendingMarketConfigures.nodes
            const assetNodes = lendingAssetConfigures.nodes

            await Promise.all([actionHandler(actionNodes), marketHandler(marketNodes), assetHandler(assetNodes)])
            // update scanner last block
            const newBlock = block + FETCH_BLOCK
            await RedisService.updateLastBlock('MM', newBlock)
            while (newBlock > lastProcessedHeight) {
                // sleep 5s
                await sleeps(5)
                lastProcessedHeight = (await lastProcessedData(endpoint)).lastProcessedHeight
                log.debug(`sleep for a while...fetch new lastProcessedHeight: ${lastProcessedHeight}`)
            }
            block = newBlock
        } catch (e: any) {
            log.error(`block scanner error: %o`, e)
        }
    }
}
