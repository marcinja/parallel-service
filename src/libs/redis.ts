import IORedis, { RedisOptions } from 'ioredis'

export enum DBT {
    User = 0,
    Cache = 1,
}

export interface RArgT {
    port?: number
    host?: string
    options?: RedisOptions
}

export type RdT = IORedis.Redis

export interface RClientT {
    client: RdT
    db: DBT
}

export class Redis {
    protected client: RdT
    private db: DBT

    constructor(db: DBT, arg?: RArgT) {
        const options: RedisOptions = {
            ...arg?.options,
            db,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000)
                return delay
            },
        }
        this.client = new IORedis(arg?.port, arg?.host, options)
        this.db = db
    }

    getDB(): DBT {
        return this.db
    }

    getClient(): RdT {
        return this.client
    }

    onConnect(cb?: () => void) {
        this.client.once('connect', () => {
            cb && cb()
        })
    }

    onError(cb?: (err: any) => void) {
        this.client.on('error', (err) => {
            cb && cb(err)
        })
    }

    onMsg(cb?: (topic: string, data: any) => void) {
        this.client.on('message', (topic, data) => {
            cb && cb(topic, data)
        })
    }

    onPMsg(cb?: (topic: string, data: any, pat?: string) => void) {
        this.client.on('pmessage', (pat, topic, data) => {
            cb && cb(topic, data, pat)
        })
    }
}

export class RedisPool {
    protected pool: RdT[] = []
    private db: DBT
    private size: number
    constructor(db: DBT, size: number, arg?: RArgT) {
        this.db = db
        this.size = size
        const options = { ...arg?.options, db }
        for (let i = 0; i < size; i++) {
            this.pool.push(new IORedis(arg?.port, arg?.host, options))
        }
    }

    getDB(): DBT {
        return this.db
    }

    getSize(): number {
        return this.size
    }
}

namespace User {
    const U = 'User'
    export const hUser = (address: string): string => {
        return `H_${U}_${address}`
    }
}

namespace Cache {
    const C = 'Cache'

    export const hToken = (): string => {
        return `H_${C}_token`
    }

    export const hDecimals = (): string => {
        return `H_${C}_decimals`
    }

    export const hLastBlock = (): string => {
        return `H_${C}_last_block`
    }
}

export const KEYS = {
    User,
    Cache,
}
