import { Context } from 'koa'
import { Between, FindOneOptions, LessThanOrEqual, MoreThan } from 'typeorm'
import { Resp, parsePagenation, isValidInteger } from '../libs'
import { LendingAction } from '../models'

export async function getActionList(ctx: Context, next: any) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const { address, symbol, startBlock, endBlock } = ctx.request.query
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
