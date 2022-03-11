import Router from "koa-router";
import { Context } from "koa"
import { getAppLogger, Resp } from "../libs";
import { LendingAction } from "../models";

const log = getAppLogger('R-action')
const R = new Router()

function parsePagenation(ctx: Context) {
    const { pageIndex, pageSize } = ctx.request.query
    const take = pageSize && Number(pageSize) || 20
    const skip = (Number(pageIndex) - 1) * Number(pageSize)
    log.debug(`pagenation: index[${pageIndex}] size[${pageSize}], skip[${skip}] take[${take}]`)
    return {
        take,
        skip
    }
}

async function getActionList(ctx: Context, next: any) {
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

async function getActionByBlock(ctx: Context, next: any) {
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

R.get('/', getActionList)

R.get('/:block', getActionByBlock)

export const actionRouter = R.routes() 