import Router from 'koa-router'
import { getPositionList, getLatestPositions } from '../../../controller'

const R = new Router()

/**
 * @api {get} /api/v1/mm/position GetPositionList
 * @apiDescription get position list by the query parameters.
 * All of they can be use in combination or individually according to your requirments.
 *
 * @apiGroup Position
 * @apiVersion 0.1.0
 * @apiQuery {String} address   user address
 * @apiQuery {String} symbol    asset symbol, e.g. KSM
 * @apiQuery {Number} pageIndex paganation
 * @apiQuery {Number} pageSize  paganation
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
                "id": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK-100-1647302400000",
                "address": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK",
                "token": "KSM",
                "supply_balance": "0",
                "borrow_balance": "0",
                "exchange_rate": "20000000000000000",
                "block_number": 434,
                "block_timestamp": "2022-03-15T20:19:42.000Z"
            },
            {
                "id": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK-102-1647302400000",
                "address": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK",
                "token": "USDT",
                "supply_balance": "0",
                "borrow_balance": "0",
                "exchange_rate": "20000000000000000",
                "block_number": 434,
                "block_timestamp": "2022-03-15T20:19:42.000Z"
            }
        ]
    }
 */
R.get('/', getPositionList)

/**
 * @api {get} /api/v1/mm/position/latest GetLatestPositions
 * @apiDescription get latest position by query parameters of today.
 *
 * @apiGroup Position
 * @apiVersion 0.1.0
 *
 * @apiQuery {String} address   user address
 * @apiQuery {String} symbol    asset symbol, e.g. KSM
 */
R.get('/latest', getLatestPositions)

export const positionRouter = R.routes()
