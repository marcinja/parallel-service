import Router from 'koa-router'
import { getAssetValues } from '../../../controller/amm'

const R = new Router()


/**
 * @api {get} /api/v1/amm/assets/value GetAssetsValue
 * @apiDescription get asset value list.
 *
 * @apiGroup Liquidity
 * @apiVersion 0.1.0
 * @apiQuery {Number} pageIndex paganation
 * @apiQuery {Number} pageSize  paganation
 * @apiSuccessExample {json} success
 * {
    "code": 0,
    "msg": "ok",
    "data": {
        "pageIndex": 1,
        "pageSize": 3,
        "totalSize": 9,
        "pageCount": 4,
        "list": [
            {
                "id": "102-1647928800000",
                "asset_id": 102,
                "symbol": "USDT",
                "value": "1000400000000000000",
                "block_number": 948032,
                "block_timestamp": "2022-03-22T06:43:30.000Z"
            },
            {
                "id": "100-1647928800000",
                "asset_id": 100,
                "symbol": "KSM",
                "value": "155448578614517399552",
                "block_number": 948033,
                "block_timestamp": "2022-03-22T06:43:48.000Z"
            },
            {
                "id": "101-1647932400000",
                "asset_id": 101,
                "symbol": "DOT",
                "value": "19783501147136991232",
                "block_number": 948232,
                "block_timestamp": "2022-03-22T07:48:06.000Z"
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
R.get('/assets/value', getAssetValues)

export const assetRouter = R.routes()
