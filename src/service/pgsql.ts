import { LendingAction, LendingAssetConfigure, LendingMarketConfigure, LendingPosition } from '../models'
import { getAppLogger } from '../libs'

const log = getAppLogger('pgsql')

export async function addNewAction(item: LendingAction) {
    try {
        return await LendingAction.insert(item)
    } catch (e: any) {
        const { message } = e
        if ((message as string).includes('duplicate key')) {
            log.warn(`${item.id} has been record, ignore!`)
            return
        }
        log.error('add error: %o', message)
    }
}

export async function isActionExisted(hash: string) {
    const action = await LendingAction.findOne({
        where: {
            id: hash,
        }
    })
    return action !== undefined
}

export async function addNewPosition(item: LendingPosition) {
    try {
        return await LendingPosition.insert(item)
    } catch (e: any) {
        const { message } = e
        if ((message as string).includes('duplicate key')) {
            log.warn(`${item.id} has been record, ignore!`)
            return
        }
        log.error('add error: %o', message)
    }
}

export async function addNewMarketConfig(item: LendingMarketConfigure) {
    try {
        return await LendingMarketConfigure.insert(item)
    } catch (e: any) {
        const { message } = e
        if ((message as string).includes('duplicate key')) {
            log.warn(`${item.id} has been record, ignore!`)
            return
        }
        log.error('add error: %o', message)
    }
}

export async function addNewAssetConfig(item: LendingAssetConfigure) {
    return await LendingAssetConfigure.insert(item)
}
