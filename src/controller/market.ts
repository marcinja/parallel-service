import { Context } from "koa"
import { Like, FindOneOptions } from "typeorm";
import { getAppLogger, Resp, parsePagenation, todayTimestamp } from "../libs";
import { LendingMarketConfigure } from "../models";

const log = getAppLogger('Controller-market')

export async function getAllMarkets(ctx: Context, next: any) {
    const { take, skip } = parsePagenation(ctx)
    const { symbol } = ctx.request.query

    const findOptions: FindOneOptions = {
        order: {
            id: "ASC",
            block_number: 'ASC'
        }
    }
    if (symbol) {
        findOptions.where = {
            symbol
        }
    }
    const re = await LendingMarketConfigure.find({
        ...findOptions,
        take,
        skip
    })

    ctx.body = Resp.Ok(re)
    return next
}

export async function getAllLatestMarkets(ctx: Context, next: any) {
    const today = todayTimestamp()
    const re = await LendingMarketConfigure.find({
        where: {
            id: Like(`%-${today}`)
        }
    })
    ctx.body = Resp.Ok(re)
    return next
}

export async function getLatestMarketBySymbol(ctx: Context, next: any) {
    const { symbol } = ctx.params
    const today = todayTimestamp()
    const re = await LendingMarketConfigure.findOne({
        id: Like(`%-${today}`),
        symbol
    })

    ctx.body = Resp.Ok(re)
    return next
}