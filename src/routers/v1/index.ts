import Router from "koa-router";
import { mmV1Router } from "./mm";
import { ammV1Router } from "./amm";

const R = new Router()

R.use('/v1', mmV1Router)

R.use('/v1', ammV1Router)

export const v1Router = R.routes()