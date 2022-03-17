import Router from 'koa-router'
import { healthCheck } from '../controller'
const R = new Router()

R.get('/')

export const liquidityRouter = R.routes()