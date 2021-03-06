import { gql, request } from 'graphql-request'
import { getConnection } from 'typeorm'
import { getAppLogger, dayFromUtcTimestamp, sleeps, startOfHour, getTimestamp } from '@parallel/lib'
import { lastProcessedData } from '.'
import { RedisService } from '../redis'
import { Pool } from '../../models/pool'
import { AssetValue } from '../../models/asset_value'
import { LiquidityPool } from '../../models/liquidity_pool'
const log = getAppLogger('subql-amm')
const FETCH_BLOCK = 100

type PoolNode = {
    id: number
    blockHeight: number
    trader: string
    baseTokenId: number
    quoteTokenId: number
    timestamp: string
}

type LiquidityPoolNode = {
    id: string
    blockHeight: number
    poolId: number
    action: string
    baseVolume: string
    quoteVolume: string
    baseVolumeLast: string
    quoteVolumnLase: string
    basePriceCumulativeLast: string
    quotePriceCumulativeLast: string
    blockTimestampLast: string
    timestamp: string
}

type SwapNode = {
    id: string
    blockHeight: number
    trader: string
    poolId: number
    tokenFrom: number // asset id
    tokenTo: string
    amountFrom: string
    amountTo: number
    timestamp: string
}

type ContributeNode = {
    id: string
    blockHeight: number
    sender: string
    poolId: number
    baseAmountAdded: string
    quoteAmountAdded: string
    timestamp: string
}

type RemoveNode = {
    id: string
    sender: string
    blockHeight: number
    poolId: number
    baseAmountRemoved: string
    quoteAmountRemoved: string
    timestamp: string
}

type AssetNode = {
    id: string
    blockHeight: number
    assetId: number
    value: string
    blockTimevalue: string
}

async function handlePool(nodes: PoolNode[]) {
    try {
        for (let node of nodes) {
            log.debug(`pool node: %o`, node)
            const baseSymbol = await RedisService.getToken(node.baseTokenId)
            const quoteSymbol = await RedisService.getToken(node.quoteTokenId)
            await getConnection().getRepository(Pool).save({
                id: node.id,
                trader: node.trader,
                base_id: node.baseTokenId,
                base_symbol: baseSymbol,
                quote_id: node.quoteTokenId,
                quote_symbol: quoteSymbol,
                block_number: node.blockHeight,
                block_timestamp: node.timestamp,
            })
        }
    } catch (e: any) {
        log.error(`handle pool query error: ${e.message}`)
    }
}

async function handleLiquidityPool(nodes: LiquidityPoolNode[]) {
    try {
        for (let node of nodes) {
            log.debug(`liquidity pool node: %o`, node)
            const day = dayFromUtcTimestamp(node.timestamp)

            await getConnection()
                .getRepository(LiquidityPool)
                .save({
                    id: `${node.poolId}-${day}`,
                    poolId: node.poolId,
                    baseVolume: node.baseVolume,
                    quoteVolume: node.quoteVolume,
                    block_number: node.blockHeight,
                    block_timestamp: node.timestamp,
                })
        }
    } catch (e: any) {
        log.error(`handle liquidity pool query error: ${e.message}`)
    }
}

async function handleSwap(nodes: PoolNode[]) {
    try {
        for (let node of nodes) {
            log.debug(`swap node: %o`, node)
        }
    } catch (e: any) {
        log.error(`handle pool swap query error: ${e.message}`)
    }
}

async function handleContribute(nodes: PoolNode[]) {
    try {
        for (let node of nodes) {
            log.debug(`contribute node: %o`, node)
        }
    } catch (e: any) {
        log.error(`handle pool contribute query error: ${e.message}`)
    }
}

async function handleRemove(nodes: PoolNode[]) {
    try {
        for (let node of nodes) {
            log.debug(`remove node: %o`, node)
        }
    } catch (e: any) {
        log.error(`handle pool remove query error: ${e.message}`)
    }
}

async function handleAsset(nodes: AssetNode[]) {
    try {
        for (let node of nodes) {
            log.debug(`asset node: %o`, node)
            const t = startOfHour(node.blockTimevalue)
            const symbol = await RedisService.getToken(node.assetId)
            await getConnection()
                .getRepository(AssetValue)
                .save({
                    id: `${node.assetId}-${t}`,
                    asset_id: node.assetId,
                    symbol,
                    value: node.value,
                    block_number: node.blockHeight,
                    block_timestamp: getTimestamp(node.blockTimevalue),
                })
        }
    } catch (e: any) {
        log.error(`handle asset query error: ${e.message}`)
    }
}

const ammSubql = (block: number, fetchBlock: number) => 
`{
    query {
        pools(
            orderBy: BLOCK_HEIGHT_ASC,
            filter: {
                blockHeight: {
                    greaterThanOrEqualTo: ${block},
                    lessThan: ${block + fetchBlock}
                }
            }
        ) {
            nodes {
                id
                blockHeight
                trader
                baseTokenId
                quoteTokenId
                timestamp
            }
        }

        liquidityPools(
          orderBy: BLOCK_HEIGHT_ASC,
            filter: {
                blockHeight: {
                    greaterThanOrEqualTo: ${block},
                    lessThan: ${block + fetchBlock}
                }
            }
        ) {
            nodes {
                id
                blockHeight
                poolId
                action
                baseVolume
                quoteVolume
                baseVolumeLast
                quoteVolumnLase
                basePriceCumulativeLast
                quotePriceCumulativeLast
                blockTimestampLast
                timestamp
            }
        }
        swapTrades(
          orderBy: BLOCK_HEIGHT_ASC,
            filter: {
                blockHeight: {
                    greaterThanOrEqualTo: ${block},
                    lessThan: ${block + fetchBlock}
                }
            }
        ) {
            nodes {
                id
                blockHeight
                trader
                poolId
                tokenFrom
                tokenTo
                amountFrom
                amountTo
                timestamp
            }
        }
        contributeLiquidities(
          orderBy: BLOCK_HEIGHT_ASC,
            filter: {
                blockHeight: {
                    greaterThanOrEqualTo: ${block},
                    lessThan: ${block + fetchBlock}
                }
            }
        ) {
            nodes {
                id
                blockHeight
                sender
                poolId
                baseAmountAdded
                quoteAmountAdded
                timestamp
            }
        }

        removeLiquidities(
          orderBy: BLOCK_HEIGHT_ASC,
            filter: {
                blockHeight: {
                    greaterThanOrEqualTo: ${block},
                    lessThan: ${block + fetchBlock}
                }
            }
        ) {
            nodes {
                id
                sender
                blockHeight
                poolId
                baseAmountRemoved
                quoteAmountRemoved
                timestamp
            }
        }

        assetValues(
          orderBy: BLOCK_HEIGHT_ASC,
            filter: {
                blockHeight: {
                    greaterThanOrEqualTo: ${block},
                    lessThan: ${block + fetchBlock}
                }
            }
        ) {
            nodes {
                id
                blockHeight
                assetId
                value
                blockTimevalue
            }
        }
    }
}
`

export async function ammScanner(endpoint: string, block: number) {
    let { lastProcessedHeight } = await lastProcessedData(endpoint)
    let fetchBlock = FETCH_BLOCK
    log.info(`lending scanner run at[${block}], current lastProcessedHeight: ${lastProcessedHeight}`)

    while (true) {
        try {
            log.debug(`start to fetch new AMM subquery data, block[${block}]`)
            const res = await request(
                endpoint,
                gql`${ammSubql(block, fetchBlock)}`
            )
            const {
                query: { pools, liquidityPools, swapTrades, contributeLiquidities, removeLiquidities, assetValues },
            } = res
            const poolNodes = pools.nodes
            const lpNodes = liquidityPools.nodes
            const swapNodes = swapTrades.nodes
            const contributeNodes = contributeLiquidities.nodes
            const removeNodes = removeLiquidities.nodes
            const assetNodes = assetValues.nodes

            await Promise.all([
                handlePool(poolNodes),
                handleLiquidityPool(lpNodes),
                handleSwap(swapNodes),
                handleContribute(contributeNodes),
                handleRemove(removeNodes),
                handleAsset(assetNodes),
            ])
            // update scanner last block
            let newBlock = block + fetchBlock
            if (newBlock > lastProcessedHeight) {
                fetchBlock = 1
                newBlock = block + 1
            }
            await RedisService.updateLastBlock('AMM', newBlock)
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
