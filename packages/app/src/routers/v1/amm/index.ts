import Router from "koa-router";
import { liquidityRouter } from "./liquidity_pool";

const R = new Router()

const AMM = '/amm'

R.use(AMM, liquidityRouter)

export const ammV1Router = R.routes()