import Router from "koa-router";
import { liquidityRouter } from "./liquidity";

const R = new Router()

const AMM = '/amm'

R.use(AMM, liquidityRouter)

export const ammV1Router = R.routes()