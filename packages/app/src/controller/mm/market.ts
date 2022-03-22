import { Context, Next } from 'koa'
import { Like, FindOneOptions } from 'typeorm'
import { Resp, parsePagenation, todayTimestamp, getAppLogger, dateFormat } from '@parallel/lib'
import { LendingMarketConfigure } from '../../models'

const log = getAppLogger('controller-mm-market')

type DateItem = {
    date: string,
    assets: string[]
}

export async function getAllMarkets(ctx: Context, next: Next) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const findOptions: FindOneOptions = {
        order: {
            id: 'ASC',
            block_number: 'ASC',
        },
    }

    const [list, totalSize] = await LendingMarketConfigure.findAndCount({
        ...findOptions,
        take: pageSize,
        skip,
    })
    const pageCount = Math.floor(totalSize / pageSize) + 1

    // handle list by symbol group
    let res = {} as any
    let dateList: DateItem[] = [] 
    let assets: string[] = []
    let curDate = dateFormat(list[0].block_timestamp, 'DD/MM/YYYY')
    list.map(m => {
        const date = dateFormat(m.block_timestamp, 'DD/MM/YYYY')
        log.debug(`date: ${m.block_timestamp} ${date}`)
        res[m.symbol] = res[m.symbol] || []
        res[m.symbol].push(m)
        // date list
        if (curDate === date) {
            assets.push(m.symbol)
        } else {
            dateList.push({
                date: curDate,
                assets
            })
            curDate = date
            assets = []
            assets.push(m.symbol)
        }
    })
    dateList.push({
        date: curDate,
        assets
    })

    ctx.body = Resp.Ok({
        pageIndex,
        pageSize,
        pageCount,
        totalSize,
        list: res,
        dateList
    })
    return next
}

export async function getMarketsBySymbol(ctx: Context, next: Next) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const { symbol } = ctx.params
    const [list, totalSize] = await LendingMarketConfigure.findAndCount({
        order: {
            block_number: 'ASC'
        },
        where: {
            symbol
        },
        take: pageSize,
        skip,
    })
    const pageCount = Math.floor(totalSize / pageSize) + 1

    ctx.body = Resp.Ok({
        pageIndex,
        pageSize,
        pageCount,
        totalSize,
        list,
    })
    return next()
}

export async function getLatestMarkets(ctx: Context, next: Next) {
    const today = todayTimestamp()
    const re = await LendingMarketConfigure.find({
        where: {
            id: Like(`%-${today}`),
        },
    })
    ctx.body = Resp.Ok(re)
    return next
}

export async function getLatestMarketBySymbol(ctx: Context, next: Next) {
    const { symbol } = ctx.params
    const today = todayTimestamp()
    const re = await LendingMarketConfigure.findOne({
        id: Like(`%-${today}`),
        symbol,
    })

    ctx.body = Resp.Ok(re)
    return next
}
