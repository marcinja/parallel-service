import Router from 'koa-router'
import { actionRouter } from './action'
import { assetRouter } from './asset'
import { marketRouter } from './market'
import { positionRouter } from './position'

const R = new Router()

const MONEY_MARKET = '/mm'
// v1 router
R.use(`${MONEY_MARKET}/action`, actionRouter)
R.use(`${MONEY_MARKET}/asset`, assetRouter)
R.use(`${MONEY_MARKET}/market`, marketRouter)
R.use(`${MONEY_MARKET}/position`, positionRouter)

export const mmV1Router = R.routes()
