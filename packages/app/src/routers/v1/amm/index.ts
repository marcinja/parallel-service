import Router from 'koa-router'
import { assetRouter } from './asset_value'
import { liquidityRouter } from './liquidity_pool'
import { poolRouter } from './pool'

const R = new Router()

const AMM = '/amm'

R.use(AMM, liquidityRouter)

R.use(AMM, poolRouter)

R.use(AMM, assetRouter)

export const ammV1Router = R.routes()
