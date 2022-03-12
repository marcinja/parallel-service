import Router from "koa-router";
import { getActionByBlock, getActionList } from "../controller"
const R = new Router()

R.get('/', getActionList)

R.get('/:block', getActionByBlock)

export const actionRouter = R.routes() 