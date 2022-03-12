import Router from "koa-router"
import { getAllMarkets, getLatestMarketBySymbol, getAllLatestMarkets } from "../controller"
const R = new Router()

R.get('/', getAllMarkets)

R.get('/latest', getAllLatestMarkets)

R.get('/latest/:symbol', getLatestMarketBySymbol)

export const marketRouter = R.routes()