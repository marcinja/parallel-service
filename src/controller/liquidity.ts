import { Context, Next } from 'koa'
import { Resp } from '../libs'

export async function getLiquidity(ctx: Context, next: Next) {
    ctx.body = Resp.Ok()
    return next
}
