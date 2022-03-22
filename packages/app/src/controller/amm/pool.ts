import { Context, Next } from 'koa'
import { Resp } from '@parallel/lib'
import { Pool } from '../../models/pool'

export async function getPoolList(ctx: Context, next: Next) {
    const re = await Pool.find({
        order: {
            id: 'ASC',
        },
    })
    ctx.body = Resp.Ok(re)
    return next()
}
