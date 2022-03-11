import Router from "koa-router"
import { Context } from "koa"
import { getAppLogger, Resp, parsePagenation } from "../libs";
import { LendingMarketConfigure } from "../models";

const log = getAppLogger('R-market')
const R = new Router()

async function getMarketList(ctx: Context, next: any) {
    const { take, skip } = parsePagenation(ctx)
    const re = await LendingMarketConfigure.find({
        order: {
            block_number: 'ASC'
        },
        take,
        skip
    })
    ctx.body = Resp.Ok(re)
    return next
}

R.get('/', getMarketList)

export const marketRouter = R.routes()