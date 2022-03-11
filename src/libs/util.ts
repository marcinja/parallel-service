import Mom from 'moment'
import { Context } from 'koa'
import { getAppLogger } from './log'

const log = getAppLogger('util')

export const sleeps = async (sec: number) => {
    return new Promise((resolve, _reject) => {
        const timer = setTimeout(() => {
            resolve(' enough sleep~')
            clearTimeout(timer)
        }, sec * 1000)
    })
}

export const delays = (sec: number, cb?: () => void) => {
    const timer = setTimeout(() => {
        cb && cb()
        clearTimeout(timer)
    }, sec * 1000);
}

export const utcBlockTimestamp = (timestamp: string): number => {
    return Mom(timestamp).utc(true).startOf('day').valueOf()
}

export const blocktimeToStamp = (time: number): string => {
    return Mom.unix(time/1000).utc(true).toString()
}

export const localToUtcTimestamp = (timestamp: string): number => {
    const day = Mom(timestamp).utc().startOf('day')
    log.debug(`block timestamp[${timestamp}] to day: ${day}-${day.valueOf()}`)
    return day.valueOf()
}

export function parsePagenation(ctx: Context) {
    const { pageIndex, pageSize } = ctx.request.query
    const take = pageSize && Number(pageSize) || 20
    const skip = (Number(pageIndex) - 1) * Number(pageSize)
    log.debug(`pagenation: index[${pageIndex}] size[${pageSize}], skip[${skip}] take[${take}]`)
    return {
        take,
        skip
    }
}