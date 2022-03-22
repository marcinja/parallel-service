import Router from 'koa-router'
import { getLiquidityVolume } from '../../../controller/amm'

const R = new Router()

R.get('/pool/liquidity', getLiquidityVolume)

export const liquidityRouter = R.routes()
