import Router from "koa-router";
import { getPositionList, getLatestPositions } from "../controller"

const R = new Router()

R.get('/', getPositionList)

R.get('/latest', getLatestPositions)

export const positionRouter = R.routes()
