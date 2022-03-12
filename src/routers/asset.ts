import Router from "koa-router"
import { getAllAssets, getLatestAssets, getLatestByAssetId } from "../controller"
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