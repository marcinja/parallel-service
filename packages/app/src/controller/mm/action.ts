import { Context, Next } from 'koa'
import { Between, FindOneOptions, LessThanOrEqual, MoreThan } from 'typeorm'
import { Resp, parsePagenation, isValidInteger } from '@parallel/lib'
import { LendingAction } from '../../models'

export async function getActionList(ctx: Context, next: Next) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const { address, startBlock, endBlock } = ctx.request.query
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

    const hasStart = isValidInteger(startBlock as string)
    const hasEnd = isValidInteger(endBlock as string)
    const byBlock = hasStart || hasEnd
    let blockOperator
    if (hasStart && !hasEnd) {
        blockOperator = MoreThan(Number(startBlock))
    } else if (!hasStart && hasEnd) {
        blockOperator = LessThanOrEqual(endBlock)
    } else if (hasStart && hasEnd) {
        blockOperator = Between(startBlock, endBlock)
    }

    if (byBlock) {
        findOptions.where = {
            ...findOptions.where,
            block_number: blockOperator,
        }
    }

    const [list, totalSize] = await LendingAction.findAndCount({
        ...findOptions,
        take: pageSize,
        skip,
    })
    const pageCount = Math.floor(totalSize / pageSize) + 1
    ctx.body = Resp.Ok({
        pageIndex,
        pageSize,
        totalSize,
        pageCount,
        list,
    })
    return next
}

export async function getActionListBySymbol(ctx: Context, next: Next) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const { symbol } = ctx.params
    const [list, totalSize] = await LendingAction.findAndCount({
        where: {
            token: symbol
        },
        order: {
            block_number: 'ASC'
        },
        take: pageSize,
        skip,
    })
    const pageCount = Math.floor(totalSize / pageSize) + 1
    ctx.body = Resp.Ok({
        pageIndex,
        pageSize,
        totalSize,
        pageCount,
        list,
    })
    return next()
}
