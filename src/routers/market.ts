import Router from 'koa-router'
import { getAllMarkets, getLatestMarketBySymbol, getLatestMarkets } from '../controller'
const R = new Router()

/**
 * @apiDefine Success
 * @apiSuccessExample {json} success
 * {
 *  code: 0,
 *  msg: 'ok',
 *  data: {
 *      pageIndex: 1,
 *      pageSize: 3,
 *      pageCount: 4,
 *      totalSize: 11,
 *      list: [
 *          {
                "id": "1000-1646870400000",
                "symbol": "XKSM",
                "collateral_factor": "500000",
                "borrow_cap": "100000000000000000",
                "close_factor": "500000",
                "liquidation_incentive": "1100000000000000000",
                "reserve_factor": "150000",
                "decimals": 12,
                "borrow_enabled": true,
                "block_number": 8954,
                "block_timestamp": "2022-03-10T23:59:54.050Z"
            },
            {
                "id": "1000-1646956800000",
                "symbol": "XKSM",
                "collateral_factor": "500000",
                "borrow_cap": "100000000000000000",
                "close_factor": "500000",
                "liquidation_incentive": "1100000000000000000",
                "reserve_factor": "150000",
                "decimals": 12,
                "borrow_enabled": true,
                "block_number": 16047,
                "block_timestamp": "2022-03-11T23:59:54.055Z"
            },
            {
                "id": "100-1646870400000",
                "symbol": "KSM",
                "collateral_factor": "500000",
                "borrow_cap": "100000000000000000",
                "close_factor": "500000",
                "liquidation_incentive": "1100000000000000000",
                "reserve_factor": "150000",
                "decimals": 12,
                "borrow_enabled": true,
                "block_number": 8954,
                "block_timestamp": "2022-03-10T23:59:54.050Z"
            }
 *      ]
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
