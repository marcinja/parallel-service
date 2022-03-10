import Mom from 'moment'
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