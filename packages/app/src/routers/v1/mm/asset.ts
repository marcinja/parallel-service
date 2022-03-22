import Router from 'koa-router'
import { getAllAssets, getLatestAssets, getLatestByAssetId } from '../../../controller'
const R = new Router()

/**
 * @api {get} /api/v1/mm/asset GetAllAssets
 * @apiDescription get asset configure list by the query parameters.
 * All of they can be use in combination or individually according to your requirments.
 *
 * @apiGroup Asset
 * @apiVersion 0.1.0
 * @apiQuery {Number} assetId asset id
 * @apiQuery {Number} pageIndex paganation
 * @apiQuery {Number} pageSize  paganation
 * @apiSuccessExample {json} success
 * {
    "code": 0,
    "msg": "ok",
    "data": {
        "pageIndex": 1,
        "pageSize": 3,
        "pageCount": 11,
        "totalSize": 32,
        "list": [
            {
                "id": "1000-1646870400000",
                "block_number": 8954,
                "asset_id": 1000,
                "total_supply": "0",
                "total_borrows": "0",
                "total_reserves": "0",
                "borrow_index": "1000068350887518697",
                "borrow_rate": "20000000000000000",
                "supply_rate": "0",
                "exchange_rate": "20000000000000000",
                "utilization_ratio": "0",
                "last_accrued_timestamp": "1646956722",
                "block_timestamp": "2022-03-10T23:59:54.05"
            },
            {
                "id": "1000-1646956800000",
                "block_number": 13673,
                "asset_id": 1000,
                "total_supply": "1249781250000000",
                "total_borrows": "0",
                "total_reserves": "0",
                "borrow_index": "1000104975064518685",
                "borrow_rate": "20000000000000000",
                "supply_rate": "0",
                "exchange_rate": "20000000000000000",
                "utilization_ratio": "0",
                "last_accrued_timestamp": "1647014262",
                "block_timestamp": "2022-03-11T15:58:06.057"
            },
            {
                "id": "1000-1647043200000",
                "block_number": 23146,
                "asset_id": 1000,
                "total_supply": "1249781250000000",
                "total_borrows": "0",
                "total_reserves": "0",
                "borrow_index": "1000178341617883892",
                "borrow_rate": "20000000000000000",
                "supply_rate": "0",
                "exchange_rate": "20000000000000000",
                "utilization_ratio": "0",
                "last_accrued_timestamp": "1647129498",
                "block_timestamp": "2022-03-12T23:59:54.047"
            }
        ]
    }
}
 * @apiErrorExample {json} error
 * {
 *  code: 2001,
 *  msg: 'invalid parameter',
 *  data: {}
 * }
 */
R.get('/', getAllAssets)

/**
 * @api {get} /api/v1/mm/asset/latest GetLatestAssets
 * @apiDescription get latest asset configure of today.
 *
 * @apiGroup Asset
 * @apiVersion 0.1.0
 */
R.get('/latest', getLatestAssets)

/**
 * @api {get} /api/v1/mm/latest/:assetId GetLatestAssetByAssetId
 * @apiDescription get latest asset configure of today by asset id.
 *
 * @apiGroup Asset
 * @apiVersion 0.1.0
 */
R.get('/latest/:assetId', getLatestByAssetId)

export const assetRouter = R.routes()
