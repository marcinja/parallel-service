import Router from "koa-router";
import { getPositionList, getPositionByday } from "../controller"

const R = new Router()

R.get('/', getPositionList)

R.get('/daily', getPositionByday)

export const positionRouter = R.routes()
