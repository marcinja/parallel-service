import { lendingScanner } from './subql'
import { getAppLogger } from '../libs'
import { RedisService } from './redis'
import { Connection } from 'typeorm'

export * from './pgsql'
export * from './query'

const log = getAppLogger('service')

export default class Service {
    static async run(conn: Connection) {
        const lastBlock = await RedisService.getLastBlock()
        lendingScanner(process.env.SUBQUERY_ENDPOINT!, lastBlock, conn)
    }
}