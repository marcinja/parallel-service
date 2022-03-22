import { Context, Next } from 'koa'
import { Resp, parsePagenation } from '@parallel/lib'
import { AssetValue } from '../../models/asset_value'

export async function getAssetValues(ctx: Context, next: Next) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)

    const [list, totalSize] = await AssetValue.findAndCount({
        order: {
            block_number: 'ASC',
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
