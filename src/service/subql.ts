import { gql, request } from 'graphql-request'
import { getAppLogger, sleeps } from '../libs'

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

export async function lendingActionScanner(block: number, handler: (block: number, query: any) => Promise<void>) {
    const options: ScannerOption = {
        endpoint: 'http://localhost:3000',
        entity: "lendingActions",
        fields: `id
            address
            asset
            assetId
            value
            method
            blockHeight
            timestamp
        `,
        handler
    }
    blockScanner(block, options)
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
                lastAccruedTimestamps
             } } = res
            const actionNodes = lendingActions.nodes
            const positionNodes = lendingPositions.nodes
            const configNodes = lendingConfigures.nodes
            const lastAccruedTimestamp = lastAccruedTimestamps.nodes[0].lastAccruedTimestamp
            log.debug(`last accrued timestamp: ${lastAccruedTimestamp}`)
            if (lendingActions.nodes.length > 0) {
                log.info(`action result: %o`, actionNodes)
            }
            if (lendingPositions.nodes.length > 0) {
                log.info('position result: %o', positionNodes)
            }
            if (configNodes.length > 0) {
                //
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
        } catch (e: any) {
            log.error(`block scanner error: %o`, e);
        }
    }
}
