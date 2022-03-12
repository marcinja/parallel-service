import { Context } from "koa"
import { getAppLogger, Resp, parsePagenation } from "../libs"
import { LendingAction } from "../models"

const log = getAppLogger('Controller-action')

export async function getActionList(ctx: Context, next: any) {
    const { take, skip } = parsePagenation(ctx)
    const re = await LendingAction.find({
        order: {
            block_number: 'ASC'
        },
        take,
        skip
    })
    ctx.body = Resp.Ok(re)
    return next
}

export async function getActionByBlock(ctx: Context, next: any) {
    log.debug(`params: %o`, ctx.params)
    const { block } = ctx.params
    const { take, skip } = parsePagenation(ctx)
    const re = await LendingAction.find({
        where: {
            block_number: block
        },
        skip,
        take
    })
    ctx.body = Resp.Ok(re)
    return next
}