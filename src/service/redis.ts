import Mom from 'moment'
import { getAppLogger, Redis, DBT, KEYS } from '../libs'
import { ApiService } from './query'

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
        username,
    },
})

const cacheRedis = new Redis(DBT.Cache, {
    host,
    port,
    options: {
        password,
        username,
    },
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

export const userRd = userRedis.getClient()
const cacheRd = cacheRedis.getClient()

export class RedisService {
    static async initAssetCache() {
        const assetIds = await ApiService.getAssets()
        for (let assetId of assetIds) {
            const meta = await ApiService.getAssetMeta(assetId)
            await Promise.all([this.setToken(assetId, meta.symbol), this.setDecimals(assetId, meta.decimals)])
        }
    }

    static async getLastBlock(): Promise<number> {
        const block = await cacheRd.get(KEYS.Cache.lastBlock())
        if (block === null) {
            log.warn(`last block cache should be initialized`)
            return 1
        }
        return Number(block)
    }

    static async updateLastBlock(block: number) {
        return cacheRd.set(KEYS.Cache.lastBlock(), block)
    }

    static async setToken(assetId: number, token: string) {
        await cacheRd.hset(KEYS.Cache.hToken(), assetId.toString(), token)
    }

    static async getToken(assetId: number): Promise<string> {
        const token = await cacheRd.hget(KEYS.Cache.hToken(), assetId.toString())
        if (token === null) {
            log.error(`invalid asset id: ${assetId}`)
            throw `invalid asset id: ${assetId}`
        }
        return token
    }

    static async setDecimals(assetId: number, decimals: number) {
        await cacheRd.hset(KEYS.Cache.hDecimals(), assetId.toString(), decimals)
    }

    static async getDecimals(assetId: number): Promise<number> {
        const decimals = await cacheRd.hget(KEYS.Cache.hDecimals(), assetId.toString())
        if (decimals === null) {
            log.error(`invalid assetId: ${assetId}`)
            throw `invalid assetId: ${assetId}`
        }
        return Number(decimals)
    }

    static async updateAccount(address: string, assetId: number) {
        userRd.hset(KEYS.User.hUser(address), assetId, Mom().utc().toString())
    }
}
