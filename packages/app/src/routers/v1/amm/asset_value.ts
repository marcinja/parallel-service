import Router from 'koa-router'
import { getPoolList } from '../../../controller/amm/pool'

const R = new Router()

R.get('/pool/list', getPoolList)

export const assetRouter = R.routes()
