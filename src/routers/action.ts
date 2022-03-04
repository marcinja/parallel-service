import Router from "koa-router";

import { getAppLogger } from "../libs";

const log = getAppLogger('R-action')
const R = new Router()

R.get('/', async (ctx, next) => {
    log.info('get actions')
})

export const actionRouter = R.routes() 