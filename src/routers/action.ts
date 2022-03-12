import Router from "koa-router";
import { getActionList } from "../controller"
const R = new Router()

R.get('/', getActionList)

export const actionRouter = R.routes() 