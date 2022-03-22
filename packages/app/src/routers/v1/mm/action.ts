import Router from 'koa-router'
import { getActionList, getActionListBySymbol } from '../../../controller'
const R = new Router()

/**
 * @api {get} /api/v1/mm/action GetActionList
 * @apiDescription get action list by the query parameters.
 * All of they can be use in combination or individually according to your requirments.
 *
 * @apiGroup Action
 * @apiVersion 0.1.0
 * @apiQuery {Number} startBlock actions more than startBlock
 * @apiQuery {Number} endBlock  actions lessn than or equal to endBlock
 * @apiQuery {String} address   user address
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
                "id": "0x42d0025f6eeac09f51040646a6828767e5bba6867c4f0c928bb7e9eaedf950e1",
                "address": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK",
                "token": "KSM",
                "amount": "500000000000000",
                "method": "Deposited",
                "supply_balance": "50000000000000000",
                "borrow_balance": "0",
                "borrow_index": "1000032732650262113",
                "exchange_rate": "20000000000000000",
                "block_number": 4274,
                "block_timestamp": "2022-03-10T08:12:54.046Z"
            },
            {
                "id": "0x159cb0a95de0532bdfd8b0141c4168368c7e142e0da2c84c290136fd77a74658",
                "address": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK",
                "token": "KSM",
                "amount": "500000000000000",
                "method": "Deposited",
                "supply_balance": "50000000000000000",
                "borrow_balance": "0",
                "borrow_index": "1000032732650262113",
                "exchange_rate": "20000000000000000",
                "block_number": 4276,
                "block_timestamp": "2022-03-10T08:13:18.041Z"
            },
            {
                "id": "0x5fa6a75d1028d1eda34e7630e41d744cf8c5169c3fc74da81eb5d87e5d58c4f5",
                "address": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK",
                "token": "sKSM",
                "amount": "100000000000000",
                "method": "Borrowed",
                "supply_balance": "50000000000000000",
                "borrow_balance": "99999932267910",
                "borrow_index": "1000032732650262113",
                "exchange_rate": "20000000000000000",
                "block_number": 4358,
                "block_timestamp": "2022-03-10T08:30:06.055Z"
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
R.get('/', getActionList)

/**
 * @api {get} /api/v1/mm/action/:symbol GetActionListBySymbol
 * @apiDescription get action list by symbol
 * @apiGroup Action
 * @apiVersion 0.1.0
 *
 */
R.get('/:symbol', getActionListBySymbol)

export const actionRouter = R.routes()
