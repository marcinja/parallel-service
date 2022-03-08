import Router from "koa-router";

import { getAppLogger, Resp } from "../libs";

const log = getAppLogger('R-action')
const R = new Router()

R.get('/', async (ctx, next) => {
    log.info('get actions')
    ctx.body = Resp.Ok({
        method: 'Depoisted'
    })
    return next()
})

export const actionRouter = R.routes() 