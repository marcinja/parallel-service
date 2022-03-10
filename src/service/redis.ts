import { getAppLogger, Redis, DBT, KEYS } from '../libs'

const log = getAppLogger('redis')

const host = process.env.REDIS_HOST
const port = Number(process.env.REDIS_PORT)
const username = process.env.REDIS_USER
const password = process.env.REDIS_PASSWORD

const userRedis = new Redis(DBT.User, {
    host,
    port,
    options: {
        password,
        username
    }
})

const cacheRedis = new Redis(DBT.Cache, {
    host,
    port,
    options: {
        password,
        username
    }
})

userRedis.onError((err: string) => {
    log.error(`redis db user connectino error: ${err}`)
    process.exit(2)
})

userRedis.onConnect(() => {
    log.info(`redis db user connection open`)
})

cacheRedis.onConnect(() => {
    log.info(`redis db cache connection open`)
})

cacheRedis.onError((err: string) => {
    log.error(`chain redis cache connectino error: ${err}`)
    process.exit(2)
})

const userRd = userRedis.getClient()
const cacheRd = cacheRedis.getClient()

export class RedisService {
    static async getLastBlock(): Promise<number> {
        const block = await cacheRd.get(KEYS.Cache.lastBlock())
        if (block === null) {
            log.error(`last block cache should be initialized`)
            throw(`last block cache should be initialized`)
        }
        return Number(block)
    }

    static async updateLastBlock(block: number) {
        return cacheRd.set(KEYS.Cache.lastBlock(), block)
    }

    static async getToken(assetId: number): Promise<string> {
        const token = await cacheRd.hget(KEYS.Cache.hToken(), assetId.toString())
        if (token === null) {
            log.error(`invalid asset id: ${assetId}`)
            throw(`invalid asset id: ${assetId}`)
        }
        return token
    }

    static async getDecimals(token: string): Promise<number> {
        const decimals = await cacheRd.hget(KEYS.Cache.hDecimals(), token)
        if (decimals === null) {
            log.error(`invalid token symbol: ${token}`)
            throw(`invalid token symbol: ${token}`)
        }
        return Number(decimals)
    }
}