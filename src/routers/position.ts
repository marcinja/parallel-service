import Router from 'koa-router'
import { getPositionList, getLatestPositions } from '../controller'

const R = new Router()

/**
 * @api {get} /position GetPositionList
 * @apiDescription get position list by the query parameters.
 * All of they can be use in combination or individually according to your requirments.
 *
 * @apiGroup Position
 * @apiVersion 0.1.0
 * @apiQuery {String} address   user address
 * @apiQuery {String} symbol    asset symbol, e.g. KSM
 * @apiQuery {Number} pageIndex paganation
 * @apiQuery {Number} pageSize  paganation
 */
R.get('/', getPositionList)

/**
 * @api {get} /position/latest GetLatestPositions
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
