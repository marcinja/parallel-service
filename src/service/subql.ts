import { gql, request } from 'graphql-request'
import { Connection } from 'typeorm';
import { getAppLogger, dayFromUtcTimestamp, sleeps } from '../libs'
import { LendingAction, LendingAssetConfigure, LendingMarketConfigure, LendingPosition } from '../models';
import { addNewAction } from './pgsql';
import { RedisService } from './redis';

const log = getAppLogger("service-subql");

type SubqlMeta = {
    lastProcessedHeight: number
    lastProcessedTimestamp: string
};

export async function lastProcessedData(url: string): Promise<SubqlMeta> {
    const { _metadata } = await request(
        url,
        gql`
      query {
        _metadata {
          lastProcessedHeight
          lastProcessedTimestamp
        }
      }
    `
    );
    return _metadata;
}

type ActionNode = {
    id: string,
    blockHeight: number,
    address: string,
    method: string,
    assetId: number,
    value: string,
    exchangeRate: string,
    borrowIndex: string
    supplyBalance: string,
    borrowBalance: string,
    timestamp: string,
    totalEarnedPrior: number,
    exchangeRatePrior: string,
}

type PositionNode = {
    id: string,
    blockHeight: number,
    address: string,
    assetId: number,
    borrowIndex: string,
    supplyBalance: string,
    borrowBalance: string,
    exchangeRate: string,
    totalEarnedPrior: number,
    exchangeRatePrior: string,
    timestamp: string
}

type MarketConfigNode = {
    id: string,
    blockHeight: number,
    assetId: number,
    collateralFactor: string,
    closeFactor: string,
    reserveFactor: string,
    borrowCap: string,
    liquidationIncentive: string,
    marketStatus: string,
    timestamp: string
}

type AssetConfigNode = {
    id: string,
    assetId: number,
    blockHeight: number,
    totalSupply: string,
    totalBorrows: string,
    totalReserves: string,
    borrowIndex: string,
    borrowRate: string,
    supplyRate: string,
    exchangeRate: string,
    utilizationRatio: string,
    lastAccruedTimestamp: string,
    timestamp: string
}

async function actionHandler(conn: Connection, nodes: ActionNode[]) {
    try {
        nodes.forEach(async node => {
            const token = await RedisService.getToken(node.assetId)
            //
            const re = await addNewAction({
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
                block_timestamp: node.timestamp
            } as LendingAction)

            positionHandler(conn, node)

        })
    } catch (e: any) {
        log.error(`handle action nodes error: %o`, e)
    }
}

async function positionHandler(conn: Connection, node: ActionNode) {
    // add or update new position data according to action
    // update account & asset info to redis cache

    try {
        const token = await RedisService.getToken(node.assetId)
        const day = dayFromUtcTimestamp(node.timestamp)

        await conn.getRepository(LendingPosition).save({
            id: `${node.address}-${node.assetId}-${day}`,
            address: node.address,
            token,
            supply_balance: node.supplyBalance,
            borrow_balance: node.borrowBalance,
            exchange_rate: node.exchangeRate,
            block_number: node.blockHeight,
            block_timestamp: node.timestamp
        } as LendingPosition)

        // update cache
        await RedisService.updateAccount(node.address, node.assetId)

    } catch (e: any) {
        log.error(`handle position error: %o`, e)
    }
}

async function marketHandler(conn: Connection, nodes: MarketConfigNode[]) {
    try {
        nodes.forEach(async node => {
            const token = await RedisService.getToken(node.assetId)
            const decimals = await RedisService.getDecimals(node.assetId)

            const day = dayFromUtcTimestamp(node.timestamp)
            conn.getRepository(LendingMarketConfigure)
                .save({
                    id: `${node.assetId}-${day}`,
                    symbol: token,
                    collateral_factor: node.collateralFactor,
                    close_factor: node.closeFactor,
                    reserve_factor: node.reserveFactor,
                    borrow_cap: node.borrowCap,
                    liquidation_incentive: node.liquidationIncentive,
                    decimals,
                    borrow_enabled: node.marketStatus === 'Active',
                    block_number: node.blockHeight,
                    block_timestamp: node.timestamp
                } as LendingMarketConfigure)
        })

    } catch (e: any) {
        log.error(`handle market configure error: %o`, e)
    }
}

async function assetHandler(conn: Connection, nodes: AssetConfigNode[]) {
    try {
        nodes.forEach(async node => {
            const day = dayFromUtcTimestamp(node.timestamp)
            conn.getRepository(LendingAssetConfigure)
                .save({
                    id: `${node.assetId}-${day}`,
                    block_number: node.blockHeight,
                    asset_id: node.assetId,
                    total_supply: node.totalSupply,
                    total_borrows: node.totalBorrows,
                    total_reserves: node.totalReserves,
                    borrow_index: node.borrowIndex,
                    borrow_rate: node.borrowRate,
                    supply_rate: node.supplyRate,
                    exchange_rate: node.exchangeRate,
                    utilization_ratio: node.utilizationRatio,
                    last_accrued_timestamp: node.lastAccruedTimestamp,
                    block_timestamp: node.timestamp
                } as LendingAssetConfigure)
        })
    } catch (e: any) {
        log.error(`handle asset configure error: %o`, e)
    }
}

export async function lendingScanner(endpoint: string, block: number, conn: Connection) {
    let { lastProcessedHeight } = await lastProcessedData(endpoint);
    log.info(`lending scanner run at[${block}], current lastProcessedHeight: ${lastProcessedHeight}`);
    while (true) {
        try {
            const res = await request(
                endpoint,
                gql`{
                  query {
                      lendingActions(
                          orderBy: BLOCK_HEIGHT_ASC,
                          filter: {
                              blockHeight: {
                                  equalTo: ${block}
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
                                  equalTo: ${block}
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
                                  equalTo: ${block}
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
              }`
            );
            const { query: {
                lendingActions,
                lendingMarketConfigures,
                lendingAssetConfigures,
            } } = res
            const actionNodes = lendingActions.nodes
            const marketNodes = lendingMarketConfigures.nodes
            const assetNodes = lendingAssetConfigures.nodes

            await Promise.all([
                actionHandler(conn, actionNodes),
                marketHandler(conn, marketNodes),
                assetHandler(conn, assetNodes)
            ])


            // update scanner last block
            const newBlock = block + 1;
            await RedisService.updateLastBlock(newBlock)

            while (newBlock > lastProcessedHeight) {
                // sleep 5s
                await sleeps(5);
                lastProcessedHeight = (await lastProcessedData(endpoint)).lastProcessedHeight;
                log.debug(`sleep for a while...fetch new lastProcessedHeight: ${lastProcessedHeight}`)
            }
            block = newBlock;
        } catch (e: any) {
            log.error(`block scanner error: %o`, e);
        }
    }
}
