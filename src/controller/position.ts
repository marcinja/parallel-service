import { Context } from 'koa'
import { FindOneOptions, Like } from 'typeorm'
import { Resp, parsePagenation, todayTimestamp } from '../libs'
import { LendingPosition } from '../models'

export async function getPositionList(ctx: Context, next: any) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const { address, symbol } = ctx.request.query
    const findOptions: FindOneOptions = {
        order: {
            address: 'ASC',
            block_number: 'ASC',
        },
    }
    if (address) {
        findOptions.where = {
            address,
        }
    }

    if (symbol) {
        findOptions.where = {
            ...findOptions.where,
            token: symbol,
        }
    }
    const [list, totalSize] = await LendingPosition.findAndCount({
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

export async function getLatestPositions(ctx: Context, next: any) {
    const today = todayTimestamp()
    const { address, symbol } = ctx.request.query
    const findOptions: FindOneOptions = {
        where: {
            id: Like(`%-${today}`),
        },
        order: {
            address: 'ASC',
        },
    }
    if (address) {
        findOptions.where = {
            ...findOptions.where,
            address,
        }
    }

    if (symbol) {
        findOptions.where = {
            ...findOptions.where,
            token: symbol,
        }
    }
    const re = await LendingPosition.find(findOptions)
    ctx.body = Resp.Ok(re)
    return next
}
