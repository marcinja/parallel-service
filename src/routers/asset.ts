import Router from "koa-router"
import { getAllAssets, getLatestAssets, getLatestByAssetId } from "../controller"
const R = new Router()

R.get('/', getAllAssets)

R.get('/latest', getLatestAssets)

R.get('/latest/:assetId', getLatestByAssetId)

export const assetRouter = R.routes()