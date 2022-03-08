import Router from "koa-router";

import { getAppLogger, Resp } from "../libs";

const log = getAppLogger('R-position')

const R = new Router()

async function positionByday(ctx: any, next: any) {
    ctx.body = {}
    return next
}

R.post('/daily', positionByday)
