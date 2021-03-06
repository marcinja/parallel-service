import { Context, Next } from 'koa'
import { Like, FindOneOptions } from 'typeorm'
import { Resp, parsePagenation, todayTimestamp, isValidInteger, Code, Msg } from '@parallel/lib'
import { LendingAssetConfigure } from '../../models'

export async function getAllAssets(ctx: Context, next: Next) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const { assetId } = ctx.request.query

    const findOptions: FindOneOptions = {
        order: {
            id: 'ASC',
            block_number: 'ASC',
        },
    }
    if (assetId) {
        if (!isValidInteger(assetId as string)) {
            throw Resp.Fail(Code.InvalidParam, Msg.InvalidParam)
        }
        findOptions.where = {
            asset_id: assetId,
        }
    }
    const [list, totalSize] = await LendingAssetConfigure.findAndCount({
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

export async function getLatestAssets(ctx: Context, next: Next) {
    const today = todayTimestamp()
    const re = await LendingAssetConfigure.find({
        where: {
            id: Like(`%-${today}`),
        },
    })
    ctx.body = Resp.Ok(re)
    return next
}

export async function getLatestByAssetId(ctx: Context, next: Next) {
    const { assetId } = ctx.params
    const today = todayTimestamp()
    const re = await LendingAssetConfigure.findOne({
        id: `${assetId}-${today}`,
    })

    ctx.body = Resp.Ok(re)
    return next
}
