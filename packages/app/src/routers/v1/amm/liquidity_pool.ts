import Router from 'koa-router'
import { getDailyVolume } from '../../../controller/amm'

const R = new Router()

R.get('/pool/liquidity/daily', getDailyVolume)

export const liquidityRouter = R.routes()
