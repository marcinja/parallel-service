import { Context, Next } from 'koa'
import { FindOneOptions, Like } from 'typeorm'
import { Resp, parsePagenation, todayTimestamp, dateFormat, getAppLogger } from '@parallel/lib'
import { LendingPosition } from '../../models'

const log = getAppLogger('controller-mm-position')

type DateItem = {
    date: string,
    assets: string[]
}

export async function getPositionList(ctx: Context, next: Next) {
    const { pageIndex, pageSize, skip } = parsePagenation(ctx)
    const findOptions: FindOneOptions = {
        order: {
            address: 'ASC',
            block_number: 'ASC',
        }
    }

    const [list, totalSize] = await LendingPosition.findAndCount({
        ...findOptions,
        take: pageSize,
        skip,
    })
    const pageCount = Math.floor(totalSize / pageSize) + 1

    let res = {} as any
    let dateList: DateItem[] = [] 
    let assets: string[] = []
    let curDate = dateFormat(list[0].block_timestamp, 'DD/MM/YYYY')
    list.map(m => {
        const date = dateFormat(m.block_timestamp, 'DD/MM/YYYY')
        res[m.symbol] = res[m.symbol] || []
        res[m.symbol].push(m)
        // date list
        log.debug(`curdate ${curDate} date[${date}]`)
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

export async function getLatestPositions(ctx: Context, next: Next) {
    const today = todayTimestamp()
    const { address, symbol } = ctx.request.query
    const findOptions: FindOneOptions = {
        where: {
            id: Like(`%-${today}`),
        },
        order: {
            address: 'ASC',
        },
    }
    if (address) {
        findOptions.where = {
            ...findOptions.where,
            address,
        }
    }

    if (symbol) {
        findOptions.where = {
            ...findOptions.where,
            token: symbol,
        }
    }
    const re = await LendingPosition.find(findOptions)
    ctx.body = Resp.Ok(re)
    return next
}
