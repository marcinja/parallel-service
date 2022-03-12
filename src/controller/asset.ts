import { Context } from "koa"
import { Like, FindOneOptions, MssqlParameter } from "typeorm";
import { getAppLogger, Resp, parsePagenation, todayTimestamp, isValidInteger, Code, Msg } from "../libs";
import { LendingAssetConfigure } from "../models";

const log = getAppLogger('Controller-asset')

export async function getAllAssets(ctx: Context, next: any) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const { assetId } = ctx.request.query

    if (!isValidInteger(assetId as string)) {
        throw Resp.Fail(Code.Pro_Err, "invalid asset id" as Msg)
    }

    const findOptions: FindOneOptions = {
        order: {
            id: "ASC",
            block_number: 'ASC'
        }
    }
    if (assetId) {
        findOptions.where = {
            asset_id: assetId
        }
    }
    const [list, totalSize] = await LendingAssetConfigure.findAndCount({
        ...findOptions,
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

export async function getLatestAssets(ctx: Context, next: any) {
    const today = todayTimestamp()
    const re = await LendingAssetConfigure.find({
        where: {
            id: Like(`%-${today}`)
        }
    })
    ctx.body = Resp.Ok(re)
    return next
}

export async function getLatestByAssetId(ctx: Context, next: any) {
    const { assetId } = ctx.params
    const today = todayTimestamp()
    const re = await LendingAssetConfigure.findOne({
        id: `${assetId}-${today}`
    })

    ctx.body = Resp.Ok(re)
    return next
}