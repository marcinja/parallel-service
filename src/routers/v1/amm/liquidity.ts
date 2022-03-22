import { Context } from 'koa'
import Router from 'koa-router'
import {} from '../../../controller'
import { Resp } from '../../../libs'
const R = new Router()




async function getDailyVolume(ctx: Context, next: any) {
    ctx.body = Resp.Ok()
}

R.get('/daily/volume', getDailyVolume)

export const liquidityRouter = R.routes()
