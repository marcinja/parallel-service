import { Context, Next } from 'koa'
import { Resp, parsePagenation } from '@parallel/lib'
import { LiquidityPool } from '../../models/liquidity_pool'

export async function getLiquidityVolume(ctx: Context, next: Next) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const { poolId } = ctx.params
    const [list, totalSize] = await LiquidityPool.findAndCount({
        order: {
            block_number: 'ASC',
        },
        where: {
            poolId
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
    return next
}
