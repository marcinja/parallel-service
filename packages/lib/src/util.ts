import Mom from 'moment'
import { Context } from 'koa'
import { getAppLogger } from './log'

const log = getAppLogger('util')

export const sleeps = async (sec: number) => {
    return new Promise((resolve) => {
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
    }, sec * 1000)
}

export const dayFromUtcTimestamp = (timestamp: string): number => {
    return Mom(timestamp).utc(false).startOf('day').valueOf()
}

export const toUtcTimestamp = (time: number): string => {
    return Mom.unix(time / 1000)
        .utc(false)
        .toString()
}

export const localToUtcTimestamp = (timestamp: string): number => {
    const day = Mom(timestamp).utc().startOf('day')
    log.debug(`block timestamp[${timestamp}] to day: ${day}-${day.valueOf()}`)
    return day.valueOf()
}

export const todayTimestamp = (): number => {
    return Mom().utc(false).startOf('day').valueOf()
}

export const startOfHour = (timeValue: string): number => {
    const t = Mom.unix(Number(timeValue)).utc(false).startOf('hours')
    log.debug(`start of timevalue in hour: ${t}`)
    return t.valueOf()
}

export const getTimestamp = (timeValue: string): string => {
    return Mom.unix(Number(timeValue)).utc(false).toString()
}

export const now = (): number => {
    return Mom().utc(false).valueOf()
}

export const dateFormat = (timestamp: string, format: string): string => {
    return Mom(timestamp).utc(false).format(format).toString()
}

type PageQuery = {
    pageSize: number
    pageIndex: number
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
        skip,
    }
}

export function isValidInteger(input: string | number) {
    return Number.isInteger(Number(input))
}
