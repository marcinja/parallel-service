import Router from "koa-router";
import { Context } from "koa"

import { getAppLogger, Resp, parsePagenation } from "../libs";
import { LendingPosition } from "../models";

const log = getAppLogger('R-position')

const R = new Router()

async function getPositionList(ctx: Context, next: any) {
    const { take, skip } = parsePagenation(ctx)
    const re = await LendingPosition.find({
        order: {
            block_number: 'ASC'
        },
        take,
        skip
    })
    ctx.body = Resp.Ok(re)
    return next
}

async function positionByday(ctx: Context, next: any) {
    ctx.body = {}
    return next
}

R.get('/', getPositionList)

R.get('/daily', positionByday)

export const positionRouter = R.routes()
