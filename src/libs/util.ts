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

export const dayTimestamp = (timestamp: string): number => {
    return Mom(timestamp).utc().startOf('day').valueOf()
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