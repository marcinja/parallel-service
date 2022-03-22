import Router from 'koa-router'
import { getAssetValues } from '../../../controller/amm'

const R = new Router()

R.get('/assets/value', getAssetValues)

export const assetRouter = R.routes()
