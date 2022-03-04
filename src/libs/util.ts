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