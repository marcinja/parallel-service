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

export class RedisService {
    static async getUsers() {
        return await userRd.hgetall(KEYS.User.hUser())
    }
}