import Router from 'koa-router'
import { getPoolList } from '../../../controller/amm/pool'

const R = new Router()


/**
 * @api {get} /api/v1/amm/pool/list GetPoolList
 * @apiDescription get liquidity pool list.
 *
 * @apiGroup Liquidity
 * @apiVersion 0.1.0
 * @apiSuccessExample {json} success
 * {
    "code": 0,
    "msg": "ok",
    "data": [
        {
            "id": 5003,
            "trader": "hJFU3r4zioT39AaBiTriJCVvoepeEGViF38DAkKECUjVwsvZK",
            "base_id": 1000,
            "quote_id": 100,
            "base_symbol": "sKSM",
            "quote_symbol": "KSM",
            "block_number": 915478,
            "block_timestamp": "2022-03-15T03:51:24.712Z"
        }
    ]
}
 * @apiErrorExample {json} error
 * {
 *  code: 2001,
 *  msg: 'invalid parameter',
 *  data: {}
 * }
 */
R.get('/pool/list', getPoolList)

export const poolRouter = R.routes()
