import Router from "koa-router"
import { Context } from "koa"
import { getAppLogger, Resp, parsePagenation } from "../libs";
import { LendingAssetConfigure } from "../models";

const log = getAppLogger('R-market')
const R = new Router()

async function getAssetConfigureList(ctx: Context, next: any) {
    const { take, skip } = parsePagenation(ctx)
    const re = await LendingAssetConfigure.find({
        order: {
            block_number: 'ASC'
        },
        take,
        skip
    })
    ctx.body = Resp.Ok(re)
    return next
}

R.get('/', getAssetConfigureList)

export const assetRouter = R.routes()