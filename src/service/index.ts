import { lendingScanner } from './subql'
import { getAppLogger } from '../libs'
import { RedisService } from './redis'

export * from './pgsql'
export * from './query'

const log = getAppLogger('service')

export default class Service {
    static async run() {
        const lastBlock = await RedisService.getLastBlock()
        lendingScanner(process.env.SUBQUERY_ENDPOINT!, lastBlock)
    }
}