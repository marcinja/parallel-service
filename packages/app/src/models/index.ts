import { createConnection, Connection } from 'typeorm'
import { LendingAction } from './action'
import { LendingMarketConfigure } from './market_config'
import { LendingAssetConfigure } from './asset_config'
import { LendingPosition } from './position'
import { Pool } from './pool'
import { AssetValue } from './asset_value'
import { LiquidityPool } from './liquidity_pool'

export * from './action'
export * from './position'
export * from './market_config'
export * from './asset_config'

const ENV = process.env

export async function initDB(): Promise<Connection> {
    return await createConnection({
        type: 'postgres',
        // url: process.env.DATABASE_URL as string,
        host: ENV.PG_DB_HOST,
        port: Number(ENV.PG_DB_PORT),
        username: ENV.PG_DB_USER,
        password: ENV.PG_DB_PASSWORD,
        database: ENV.PG_DB_NAME,
        entities: [
            LendingAction,
            LendingPosition,
            LendingMarketConfigure,
            LendingAssetConfigure,
            Pool,
            AssetValue,
            LiquidityPool,
        ],
        synchronize: true,
        logger: 'debug',
    })
}
