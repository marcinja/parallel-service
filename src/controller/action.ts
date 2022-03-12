import { Context } from "koa"
import { FindOneOptions } from "typeorm"
import { getAppLogger, Resp, parsePagenation } from "../libs"
import { LendingAction } from "../models"

const log = getAppLogger('Controller-action')

export async function getActionList(ctx: Context, next: any) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const { address, symbol } = ctx.request.query
    const findOptions: FindOneOptions = {
        order: {
            address: 'ASC',
            block_number: 'ASC'
        }
    }
    if (address) {
        findOptions.where = {
            address
        }
    }

    if (symbol) {
        findOptions.where = {
            ...findOptions.where,
            token: symbol
        }
    }
    const [list, totalSize] = await LendingAction.findAndCount({
        ...findOptions,
        take: pageSize,
        skip
    })
    const pageCount = Math.floor(totalSize / pageSize) + 1
    ctx.body = Resp.Ok({
        pageIndex,
        pageSize,
        totalSize,
        pageCount,
        list
    })
    return next
}

export async function getActionByBlock(ctx: Context, next: any) {
    log.debug(`params: %o`, ctx.params)
    const { block } = ctx.params
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const [list, totalSize] = await LendingAction.findAndCount({
        where: {
            block_number: block
        },
        skip,
        take: pageSize
    })
    const pageCount = Math.floor(totalSize / pageSize) + 1

    ctx.body = Resp.Ok({
        pageIndex,
        pageSize,
        pageCount,
        totalSize,
        list
    })
    return next
}