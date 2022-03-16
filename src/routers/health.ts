import Router from 'koa-router'
import { healthCheck } from '../controller'
const R = new Router()

/**
 * @api {get} /health healthCheck
 * @apiDescription get the service health status.
 *
 * @apiGroup Health
 * @apiVersion 0.1.0
 * @apiSuccessExample {json} success
 * {
 *  code: 0,
 *  msg: 'ok',
 *  data: {
 *      status: 'ok'
 *  }
 */
R.get('/', healthCheck)

export const healtRouter = R.routes()
