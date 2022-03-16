import Router from 'koa-router'
import { getAllAssets, getLatestAssets, getLatestByAssetId } from '../controller'
const R = new Router()

/**
 * @apiDefine Success
 * @apiSuccessExample {json} success
 * {
 *  code: 0,
 *  msg: 'ok',
 *  data: {
 *      pageIndex: 1,
 *      pageSize: 2,
 *      pageCount: 32,
 *      totalSize: 32,
 *      list: [
 *          {
                "id": "1000-1646870400000",
                "block_number": 8954,
                "asset_id": 1000,
                "total_supply": "0",
                "total_borrows": "0",
                "total_reserves": "0",
                "borrow_index": "1000065900190384317",
                "borrow_rate": "20000000000000000",
                "supply_rate": "0",
                "exchange_rate": "20000000000000000",
                "utilization_ratio": "0",
                "last_accrued_timestamp": "1646956722",
                "block_timestamp": "2022-03-10T23:59:54.05"
            },
            {
                "id": "100-1646870400000",
                "block_number": 8954,
                "asset_id": 100,
                "total_supply": "100000000000000000",
                "total_borrows": "100004061162976",
                "total_reserves": "609174224",
                "borrow_index": "1000074022982853130",
                "borrow_rate": "25000100000000000",
                "supply_rate": "1062525500085000",
                "exchange_rate": "20000037552285020",
                "utilization_ratio": "50001",
                "last_accrued_timestamp": "1646956722",
                "block_timestamp": "2022-03-10T23:59:54.05"
            }
 *      ]
 *  }
 * }
 */

/**
 * @apiDefine Error
 * @apiErrorExample {json} error
 * {
 *  code: 2001,
 *  msg: 'invalid parameter',
 *  data: {}
 * }
 *
 */

/**
 * @api {get} /asset GetAllAssets
 * @apiDescription get asset configure list by the query parameters.
 * All of they can be use in combination or individually according to your requirments.
 *
 * @apiGroup Asset
 * @apiVersion 0.1.0
 * @apiQuery {Number} assetId asset id
 * @apiQuery {Number} pageIndex paganation
 * @apiQuery {Number} pageSize  paganation
 * @apiUse Success
 * @apiUse Error
 */
R.get('/', getAllAssets)

/**
 * @api {get} /asset/latest GetLatestAssets
 * @apiDescription get latest asset configure of today.
 *
 * @apiGroup Asset
 * @apiVersion 0.1.0
 */
R.get('/latest', getLatestAssets)

/**
 * @api {get} /asset/latest/:assetId GetLatestAssetByAssetId
 * @apiDescription get latest asset configure of today by asset id.
 *
 * @apiGroup Asset
 * @apiVersion 0.1.0
 */
R.get('/latest/:assetId', getLatestByAssetId)

export const assetRouter = R.routes()
