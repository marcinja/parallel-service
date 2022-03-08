import { assert } from 'console';
import { gql, request } from 'graphql-request'
import { getAppLogger, sleeps } from '../libs'
import { LendingAction } from '../models';
import { addNewAction } from './pgsql';

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

type positionNode = {
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
    utilizationRatio: string
}

type LastAccruedNode = {
    blockHeight: number
    lastAccruedTimestamp: string
}

function getTokenById(assetId: number): string {
    // TODO: cache
    switch(assetId) {
        case 100:
            return 'KSM'
        case 102:
            return 'USDT'
        default:
            return 'UNKNOWN'
    }
}

async function actionHandler(nodes: ActionNode[]) {
    try {
        nodes.forEach(async node => {
            log.debug(`action node: %o`, node)
            const re = await addNewAction({
                block_number: node.blockHeight,
                tx_hash: node.id,
                address: node.address,
                token: getTokenById(node.assetId),
                amount: node.value,
                method: node.method,
                exchange_rate: node.exchangeRate,
                timestamp: node.timestamp
            } as LendingAction)
            log.debug('add action result: %o', re)
        })
    } catch (e: any) {
        log.error(`handle action nodes error: %o`, e)
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
                      lendingConfigures(
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
                              timestamp
                          }
                      }
                      assetConfigures(
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
                          }
                      }
                      lastAccruedTimestamps(
                        orderBy: BLOCK_HEIGHT_ASC,
                          filter: {
                              blockHeight: {
                                  equalTo: ${block}
                              }
                          }
                      ) {
                          nodes {
                              blockHeight
                              lastAccruedTimestamp
                          }
                      }
                  }
              }`
            );
            const { query: {
                lendingActions,
                lendingPositions,
                lendingConfigures,
                assetConfigures,
                lastAccruedTimestamps
            } } = res
            const actionNodes = lendingActions.nodes
            const positionNodes = lendingPositions.nodes
            const configNodes = lendingConfigures.nodes
            const assetNodes = assetConfigures.nodes
            const lastAccruedTimestamp = lastAccruedTimestamps.nodes[0].lastAccruedTimestamp
            log.debug(`last accrued timestamp: ${lastAccruedTimestamp}`)

            actionHandler(actionNodes)

            if (lendingPositions.nodes.length > 0) {
                log.info('position result: %o', positionNodes)
            }
            if (configNodes.length > 0) {
                //
            }
            if (assetNodes.length > 0) {
                // log.info('asset configure result: %o', assetNodes[0])
            }
            // option.handler(block, res);
            const newBlock = block + 1;
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
            await sleeps(2)
        } catch (e: any) {
            log.error(`block scanner error: %o`, e);
        }
    }
}
