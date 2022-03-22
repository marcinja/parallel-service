import { Context, Next } from 'koa'
import moment from 'moment'
import { Code, Msg, now, Resp } from '@parallel/lib'
import { RedisService } from '../service/redis'

export async function healthCheck(ctx: Context, next: Next) {
    const curTime = now()
    const re = await Promise.all([
        RedisService.getLastBlock('MM'),
        RedisService.getLastBlock('AMM')
    ])
    const timeout = moment(re[0][1]).add(1, 'minute').isBefore(curTime) || moment(re[1][1]).add(1, 'minute').isBefore(curTime)
    if (timeout) {
        throw Resp.Fail(Code.SyncTimeout, Msg.SyncTimeout)
    }
    ctx.body = Resp.Ok({
        status: 'ok',
    })
    return next
}
