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

export const dayFromUtcTimestamp = (timestamp: string): number => {
    return Mom(timestamp).utc(true).startOf('day').valueOf()
}

export const toUtcTimestamp = (time: number): string => {
    return Mom.unix(time/1000).utc(true).toString()
}

export const localToUtcTimestamp = (timestamp: string): number => {
    const day = Mom(timestamp).utc().startOf('day')
    log.debug(`block timestamp[${timestamp}] to day: ${day}-${day.valueOf()}`)
    return day.valueOf()
}

export const todayTimestamp = (): number => {
    return Mom().utc(true).startOf('day').valueOf()
}

type PageQuery = {
    pageSize: number,
    pageIndex: number,
    skip: number
}

export function parsePagenation(ctx: Context): PageQuery {
    const { pageIndex, pageSize } = ctx.request.query
    const index = Number(pageIndex) || 1
    const size = Number(pageSize) || 20

    const skip = (index - 1) * size
    log.debug(`pagenation: index[${pageIndex}] size[${pageSize}], skip[${skip}] take[${size}]`)
    return {
        pageIndex: index,
        pageSize: size,
        skip
    }
}

export function isValidInteger(input: string | number) {
    return Number.isInteger(Number(input))
}