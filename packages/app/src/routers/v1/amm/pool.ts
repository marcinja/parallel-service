import Router from "koa-router";
import { getPoolList } from "../../../controller/amm/pool";

const R = new Router()


R.use('/pool/list', getPoolList)

export const ammV1Router = R.routes()