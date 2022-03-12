import { Context } from "koa"
import { getAppLogger, Resp, parsePagenation } from "../libs";
import { LendingPosition } from "../models";

const log = getAppLogger('Controller-position')

export async function getPositionList(ctx: Context, next: any) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const [list, totalSize] = await LendingPosition.findAndCount({
        order: {
            block_number: 'ASC'
        },
        take: pageSize,
        skip
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

export async function getPositionByday(ctx: Context, next: any) {
    ctx.body = {}
    return next
}
