import { gql, request } from 'graphql-request'
import { getAppLogger, sleeps } from '../libs'
import { LendingAction, LendingAssetConfigure, LendingMarketConfigure, LendingPosition } from '../models';
import { addNewAction, addNewAssetConfig, addNewMarketConfig, addNewPosition } from './pgsql';
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


type ScannerOption = {
    endpoint: string;
    entity: string;
    fields: string;
    handler: (block: number, res: any) => Promise<void>;
};

async function blockScanner(block: number, option: ScannerOption) {
    let { lastProcessedHeight } = await lastProcessedData(option.endpoint);
    log.debug(`current lastProcessedHeight: ${lastProcessedHeight}`);
    while (true) {
        try {
            const res = await request(
                option.endpoint,
                gql`{
                  query {
                      ${option.entity}(
                          orderBy: BLOCK_HEIGHT_ASC,
                          filter: {
                              blockHeight: {
                                  equalTo: ${block}
                              }
                          }
                      ) {
                          nodes {${option.fields}}
                      }


                  }
              }`
            );
            option.handler(block, res);
            const newBlock = block + 1;
            while (newBlock > lastProcessedHeight) {
                //   option.emiter.getEvtCount() && option.emiter.done();
                // sleep 5s
                await sleeps(5000);
                lastProcessedHeight = (await lastProcessedData(option.endpoint)).lastProcessedHeight;
                log.info(
                    `sleep for a while...\nfetch new lastProcessedHeight: ${lastProcessedHeight}`
                );
            }
            block = newBlock;
        } catch (e: any) {
            log.error(`block scanner error: %o`, e);
        }
    }
}
type ActionNode = {
    id: string,
    blockHeight: number,
    address: string,
    method: string,
    assetId: number,
    value: string,
    exchangeRate: string,
    timestamp: string
}

type PositionNode = {
    id: string,
    blockHeight: number,
    address: string,
    assetId: number,
    borrowIndex: string
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
    lastAccruedTimestamp: string
}

async function actionHandler(nodes: ActionNode[]) {
    try {
        nodes.forEach(async node => {
            const token = await RedisService.getToken(node.assetId)
            const re = await addNewAction({
                block_number: node.blockHeight,
                tx_hash: node.id,
                address: node.address,
                token,
                amount: node.value,
                method: node.method,
                exchange_rate: node.exchangeRate,
                block_timestamp: node.timestamp
            } as LendingAction)
        })
    } catch (e: any) {
        log.error(`handle action nodes error: %o`, e)
    }
}

async function positionHandler(nodes: PositionNode[]) {
    try {
        nodes.forEach(async node => {
            const token = await RedisService.getToken(node.assetId)
            // if (token === null) {
            //     log.error(`invalid asset id: ${node.assetId}`)
            //     continue
            // }
            // log.debug(`[${node.assetId}]-[${node.address}]-${token}`)
            addNewPosition({
                address: node.address,
                token,
                supply_balance: node.supplyBalance,
                borrow_balance: node.borrowBalance,
                exchange_rate: node.exchangeRate,
                block_number: node.blockHeight,
                block_timestamp: node.timestamp
            } as LendingPosition)
        });

    } catch(e: any) {

    }
}

async function marketHandler(nodes: MarketConfigNode[]) {
    try {
        nodes.forEach(async node => {
            const token = await RedisService.getToken(node.assetId)
            const decimals =  await RedisService.getDecimals(token)
            const re = await addNewMarketConfig({
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

    } catch(e: any) {
        log.error(`handle market configure error: %o`, e)
    }
}

async function assetHandler(nodes: AssetConfigNode[]) {
    try {
        nodes.forEach(async node => {
            addNewAssetConfig({
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
                last_accrued_timestamp: node.lastAccruedTimestamp
            } as LendingAssetConfigure)
        })
    } catch(e: any) {
        log.error(`handle asset configure error: %o`, e)
    }
}

export async function lendingScanner(endpoint: string, block: number) {
    log.info('lending scanner run')
    let { lastProcessedHeight } = await lastProcessedData(endpoint);
    log.debug(`current lastProcessedHeight: ${lastProcessedHeight}`);
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
                              timestamp
                          }
                      }

                      lendingPositions(
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
                              address
                              assetId
                              borrowIndex
                              supplyBalance
                              borrowBalance
                              exchangeRate
                              totalEarnedPrior
                              exchangeRatePrior
                              timestamp
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
                          }
                      }
                  }
              }`
            );
            const { query: {
                lendingActions,
                lendingPositions,
                lendingMarketConfigures,
                lendingAssetConfigures,
            } } = res
            const actionNodes = lendingActions.nodes
            const positionNodes = lendingPositions.nodes
            const marketNodes = lendingMarketConfigures.nodes
            const assetNodes = lendingAssetConfigures.nodes

            // TODO：
            // 1. to filter has been recorded item when rescan

            actionHandler(actionNodes)

            positionHandler(positionNodes)

            marketHandler(marketNodes)

            assetHandler(assetNodes)

            // update scanner last block
            const newBlock = block + 1;
            RedisService.updateLastBlock(newBlock)

            while (newBlock > lastProcessedHeight) {
                //   option.emiter.getEvtCount() && option.emiter.done();
                // sleep 5s
                await sleeps(5);
                lastProcessedHeight = (await lastProcessedData(endpoint)).lastProcessedHeight;
                log.info(
                    `sleep for a while...\nfetch new lastProcessedHeight: ${lastProcessedHeight}`
                );
            }
            block = newBlock;
        } catch (e: any) {
            log.error(`block scanner error: %o`, e);
        }
    }
}
