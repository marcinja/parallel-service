import { lendingScanner } from './subql'
import { getAppLogger } from '../libs'
import { addNewAction } from './pgsql'
import { LendingAction } from '../models'
import { ApiService } from './query'

export * from './pgsql'
export * from './query'

const log = getAppLogger('service')


async function lendingScannerHandler(block: number, query: any) {
    try {
        const {
            query: {
                lendingActions: { nodes }
            }
        } = query
        if (nodes.length === 0) {
            return
        }
        nodes.forEach(async (r: any) => {
            log.info(`[${block}] query result: %o`, r)
            const rate = await ApiService.getExchangeRate(r.assetId)
            addNewAction({
                address: r.address,
                amount: r.value,
                tx_hash: r.id,
                method: r.method,
                token: r.asset,
                exchange_rate: rate,
                block_number: r.blockHeight,
                timestamp: r.timestamp
            } as LendingAction)

        });
    } catch(e: any) {
        log.error(`handle error: %o`, e)
    }
}


export default class Service {
    static run() {
        lendingScanner('http://localhost:3000', 36876)
    }
}