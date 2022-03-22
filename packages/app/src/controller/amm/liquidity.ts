import { Context, Next } from 'koa'
import { Resp } from '@parallel/lib'

export async function getDailyVolume(ctx: Context, next: Next) {
    ctx.body = Resp.Ok()
    return next
}
