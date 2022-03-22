import { Next } from 'koa'
import { Context } from 'vm'
import { Resp } from '@parallel/lib'
import { AssetValue } from '../../models/asset_value'

export async function getAssetValues(ctx: Context, next: Next) {
    const re = await AssetValue.find({
        order: {
            id: 'ASC',
        },
    })
    ctx.body = Resp.Ok(re)
    return next()
}
