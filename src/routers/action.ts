import Router from 'koa-router'
import { getActionList } from '../controller'
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
 *      list: [
 *          {
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
 * @api {get} /action GetActionList
 * @apiDescription get action list by the query parameters.
 * All of they can be use in combination or individually according to your requirments.
 *
 * @apiGroup Action
 * @apiVersion 0.1.0
 * @apiQuery {Number} startBlock actions more than startBlock
 * @apiQuery {Number} endBlock  actions lessn than or equal to endBlock
 * @apiQuery {String} address   user address
 * @apiQuery {String} symbol    asset symbol, e.g. KSM
 * @apiQuery {Number} pageIndex paganation
 * @apiQuery {Number} pageSize  paganation
 * @apiUse Success
 * @apiUse Error
 */
R.get('/', getActionList)

export const actionRouter = R.routes()
