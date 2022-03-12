import Router from "koa-router";
import { getActionList } from "../controller"
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