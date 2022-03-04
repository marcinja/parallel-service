import { ApiPromise, WsProvider } from '@polkadot/api'
import { options } from '@parallel-finance/api'
import { typesBundle } from '@parallel-finance/type-definitions'
import Koa from 'koa'
import KoaBody from 'koa-body'
import Router from 'koa-router'
import { getAppLogger, unexpectListener } from './libs'
import { actionRouter } from './routers'
import { accessControl, accessMidware, errHanldle, responseTime } from './middleware'


const log = getAppLogger('app')
const app = new Koa()
const router = new Router()

router.use('/parallel/action', actionRouter)
// router.use('/', ActionRouter)

app
    .use(accessMidware)
    .use(KoaBody({json: true}))
    .use(responseTime)
    .use(errHanldle)
    .use(accessControl)
    .use(router.routes())

unexpectListener()
app.listen('4321', async () => {
    log.info('app listen on 4321')
    init()
})

const ENDPOINT = 'wss://regnet-rpc.parallel.fi'


/*
loans: {
    palletVersion: [Getter],
    lastAccruedTimestamp: [Getter],
    totalSupply: [Getter],
    totalBorrows: [Getter],
    totalReserves: [Getter],
    accountBorrows: [Getter],
    accountDeposits: [Getter],
    accountEarned: [Getter],
    borrowIndex: [Getter],
    exchangeRate: [Getter],
    borrowRate: [Getter],
    supplyRate: [Getter],
    utilizationRatio: [Getter],
    markets: [Getter],
    underlyingAssetId: [Getter]
}
*/
async function init() {
    const api = await ApiPromise.create(
        options({
            types: {
                TAssetBalance: 'Balance'
            },
            typesBundle,
            provider: new WsProvider(ENDPOINT)
        })
    )

    const chain = await api.rpc.system.chain()
    console.log('chain ', chain)
    const rat = await api.query.loans.exchangeRate(100)
    console.log('%o', rat.toString())
    const {balance}: any = (await api.query.assets.account(100, 'hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK')).toJSON()
    console.log(`balance: %o`, balance.toString())
}