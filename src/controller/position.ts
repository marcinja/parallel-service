import { Context } from "koa"
import { getAppLogger, Resp, parsePagenation } from "../libs";
import { LendingPosition } from "../models";

const log = getAppLogger('Controller-position')

export async function getPositionList(ctx: Context, next: any) {
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

export async function getPositionByday(ctx: Context, next: any) {
    ctx.body = {}
    return next
}
