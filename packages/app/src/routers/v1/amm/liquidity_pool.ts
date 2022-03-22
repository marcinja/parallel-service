import Router from 'koa-router'
import { getLiquidityVolume } from '../../../controller/amm'

const R = new Router()


/**
 * @api {get} /api/v1/amm/pool/liquidity/:poolId  GetPoolLiquidityById
 * @apiDescription get pool liquidity list by pool id
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
                "id": "5002-1647216000000",
                "poolId": 5002,
                "baseVolume": "50000000000000",
                "quoteVolume": "25000000000000000",
                "block_number": 915893,
                "block_timestamp": "2022-03-15T06:00:12.357Z"
            },
            {
                "id": "5002-1647302400000",
                "poolId": 5002,
                "baseVolume": "46886295133536",
                "quoteVolume": "27756699367308444",
                "block_number": 920577,
                "block_timestamp": "2022-03-16T07:00:06.415Z"
            },
            {
                "id": "5002-1647388800000",
                "poolId": 5002,
                "baseVolume": "34610705558112",
                "quoteVolume": "38637364380875724",
                "block_number": 925169,
                "block_timestamp": "2022-03-17T07:59:30.335Z"
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
R.get('/pool/liquidity/:poolId', getLiquidityVolume)

export const liquidityRouter = R.routes()
