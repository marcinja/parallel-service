import 'reflect-metadata'
import Koa from 'koa'
import KoaBody from 'koa-body'
import Router from 'koa-router'
import { getAppLogger, unexpectListener } from './libs'
import { actionRouter } from './routers'
import { accessControl, accessMidware, errHanldle, responseTime } from './middleware'
import { initDB } from './models'
import Service from './service'
import { ApiService } from './service'

const log = getAppLogger('app')
const app = new Koa()
const router = new Router()

router.use('/parallel/action', actionRouter)
// router.use('/', ActionRouter)

app
    .use(accessMidware)
    .use(KoaBody({ json: true }))
    .use(responseTime)
    .use(errHanldle)
    .use(accessControl)
    .use(router.routes())


unexpectListener()
app.listen('4321', async () => {
    log.info('app listen on 4321')
    await init()
    const conn = await initDB()

    Service.run()
})

const ENDPOINT = 'wss://regnet-rpc.parallel.fi'

async function init() {
    const api = await ApiService.init(ENDPOINT)

    const rate = await ApiService.getExchangeRate(100)
    console.log('%o', rate)

    const balance = await ApiService.getBalance(100, 'hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK')
    console.log(`balance: %o`, balance)
}