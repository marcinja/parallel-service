import Router from 'koa-router'
import { liquidityRouter } from './liquidity_pool'
import { poolRouter } from './pool'

const R = new Router()

const AMM = '/amm'

R.use(AMM, liquidityRouter)

R.use(AMM, poolRouter)

export const ammV1Router = R.routes()
