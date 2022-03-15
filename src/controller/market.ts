import { Context } from 'koa'
import { Like, FindOneOptions } from 'typeorm'
import { Resp, parsePagenation, todayTimestamp } from '../libs'
import { LendingMarketConfigure } from '../models'

export async function getAllMarkets(ctx: Context, next: any) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const { symbol } = ctx.request.query

    const findOptions: FindOneOptions = {
        order: {
            id: 'ASC',
            block_number: 'ASC',
        },
    }
    if (symbol) {
        findOptions.where = {
            symbol,
        }
    }
    const [list, totalSize] = await LendingMarketConfigure.findAndCount({
        ...findOptions,
        take: pageSize,
        skip,
    })
    const pageCount = Math.floor(totalSize / pageSize) + 1

    ctx.body = Resp.Ok({
        pageIndex,
        pageSize,
        pageCount,
        totalSize,
        list,
    })
    return next
}

export async function getLatestMarkets(ctx: Context, next: any) {
    const today = todayTimestamp()
    const re = await LendingMarketConfigure.find({
        where: {
            id: Like(`%-${today}`),
        },
    })
    ctx.body = Resp.Ok(re)
    return next
}

export async function getLatestMarketBySymbol(ctx: Context, next: any) {
    const { symbol } = ctx.params
    const today = todayTimestamp()
    const re = await LendingMarketConfigure.findOne({
        id: Like(`%-${today}`),
        symbol,
    })

    ctx.body = Resp.Ok(re)
    return next
}
