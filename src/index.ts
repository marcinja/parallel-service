import 'reflect-metadata'
import Koa from 'koa'
import KoaBody from 'koa-body'
import Router from 'koa-router'
import { getAppLogger, unexpectListener } from './libs'
import { actionRouter } from './routers'
import { accessControl, accessMidware, errHanldle, responseTime } from './middleware'
import { initDB, LendingMarketConfigure } from './models'
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
    const conn = await initDB()

    conn.getRepository(LendingMarketConfigure).save({
        id: '1234',
        symbol: 'KSM',
        collateral_factor: '100',
        borrow_cap: '1000',
        close_factor: '10000',
        liquidation_incentive: '100000',
        reserve_factor: '1323',
        decimals: 10,
        borrow_enabled: true,
        block_number: 12345,
        block_timestamp: '2022-03-10T09:36:42.037'
    } as LendingMarketConfigure)
    conn.getRepository(LendingMarketConfigure).save({
        id: '1234',
        symbol: 'KSM',
        collateral_factor: '100',
        borrow_cap: '1000',
        close_factor: '10000',
        liquidation_incentive: '100000',
        reserve_factor: '1323',
        decimals: 10,
        borrow_enabled: true,
        block_number: 12345,
        block_timestamp: '2022-03-10T09:36:42.037'
    })
    Service.run(conn)
})
