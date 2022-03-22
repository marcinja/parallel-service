import { Context, Next } from 'koa'
import moment from 'moment'
import { Code, Msg, now, Resp } from '../libs'
import { RedisService } from '../service/redis'

export async function healthCheck(ctx: Context, next: Next) {
    const curTime = now()
    const updateAt = (await RedisService.getLastBlock())[1]
    const timeout = moment(updateAt).add(1, 'minute').isBefore(curTime)
    if (timeout) {
        throw Resp.Fail(Code.SyncTimeout, Msg.SyncTimeout)
    }
    ctx.body = Resp.Ok({
        status: 'ok',
    })
    return next
}
