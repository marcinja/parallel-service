import { Context } from 'koa'
import { Resp } from '../libs'

export async function getLiquidity(ctx: Context, next: any) {
    ctx.body = Resp.Ok()
    return next
}
