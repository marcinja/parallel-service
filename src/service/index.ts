import She from 'node-schedule'
import { lendingScanner } from './subql'
import { getAppLogger, todayTimestamp } from '../libs'
import { RedisService, userRd } from './redis'
import { ApiService } from './query'
import { LendingPosition } from '../models'
import { getConnection } from 'typeorm'

export * from './pgsql'
export * from './query'

const HOUR_SCHEDULER = '0 */1 * * *'
const log = getAppLogger('service')

async function positionUpdate() {
    log.info(`update position`)
    const stream = userRd.scanStream({
        match: `H_User_*`
    })
    const rep = await getConnection().getRepository(LendingPosition)

    // fetch all accounts in market
    stream.on('data', (keys: string[]) => {
        log.debug(`user account cache keys: ${keys.length}`)
        keys.forEach(async key => {
            // fetch assets of account
            const address = key.split('_')[2]
            const assets = await userRd.hkeys(key)
            log.debug(`assets of ${address}: %o`, assets)
            // api.query storage
            assets.forEach(async assetId => {

                const data = await ApiService.getAccountLendingStorage(address, Number(assetId))
                const day = todayTimestamp()
                const token = await RedisService.getToken(Number(assetId))
                rep.save({
                    id: `${address}-${assetId}-${day}`,
                    address,
                    token,
                    supply_balance: data.supplyBalance,
                    borrow_balance: data.borrowBalance,
                    exchange_rate: data.exchangeRate,
                    block_number: data.blockNumber,
                    block_timestamp: data.blockTimestamp
                } as LendingPosition)
            })

        })
    })

    stream.on('end', () => {
        log.info(`all account position updated!`)
    })

}

export default class Service {
    static async run() {

        await RedisService.initAssetCache()

        const lastBlock = await RedisService.getLastBlock()

        lendingScanner(process.env.SUBQUERY_ENDPOINT!, lastBlock)

        const positionHourlyJob = She.scheduleJob(HOUR_SCHEDULER, () => {
            positionUpdate()
        })

        positionHourlyJob.invoke()

        positionHourlyJob.on('error', (err) => {
            log.error(`position hourly job error: %o`, err)
            throw (`position hourly job down!`)
        })

        positionHourlyJob.on('canceled', (reason) => {
            log.error(`position hourly job canceled: %o`, reason)
            throw (`position hourly job down!`)
        })
    }
}