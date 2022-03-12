import Router from "koa-router"
import { getAllMarkets, getLatestMarketBySymbol, getLatestMarkets } from "../controller"
const R = new Router()

R.get('/', getAllMarkets)

R.get('/latest', getLatestMarkets)

R.get('/latest/:symbol', getLatestMarketBySymbol)

export const marketRouter = R.routes()