import Router from "koa-router"
import { getAllMarkets, getLatestMarketBySymbol, getLatestMarkets } from "../controller"
const R = new Router()


/**
 * @apiDefine Success
 * @apiSuccessExample {json} success
 * {
 *  code: 0,
 *  msg: 'ok',
 *  data: {
 *      pageIndex: 1,
 *      pageSize: 20,
 *      pageCount: 4,
 *      totalSize: 76,
 *      list: []
 *  }
 * }
 */

/**
 * @apiDefine Error
 * @apiErrorExample {json} error
* {
 *  code: 1001,
 *  msg: 'invalid parameter',
 *  data: {}
 * }
 * 
 */

/**
 * @api {get} /market GetAllMarkets
 * @apiDescription get all market configure by query parameter.
 * @apiGroup Market
 * @apiVersion 0.1.0
 * @apiQuery {String} symbol    asset symbol, e.g. KSM
 * @apiQuery {Number} pageIndex paganation
 * @apiQuery {Number} pageSize  paganation
 * @apiUse Success
 * @apiUse Error
 */
R.get('/', getAllMarkets)

/**
 * @api {get} /market/latest GetLatestMarkets
 * @apiDescription get latest market configure of tody.
 * @apiGroup Market
 * @apiVersion 0.1.0
 */
R.get('/latest', getLatestMarkets)

/**
 * @api {get} /market/latest/:symbol GetLatestMarketBySymbol
 * @apiDescription get latest market configure of today by symbol.
 * @apiGroup Market
 * @apiVersion 0.1.0
 */
R.get('/latest/:symbol', getLatestMarketBySymbol)

export const marketRouter = R.routes()