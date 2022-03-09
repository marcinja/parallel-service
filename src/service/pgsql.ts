import { LendingAction, LendingAssetConfigure, LendingMarketConfigure, LendingPosition } from '../models'
import { getAppLogger } from '../libs'

const log = getAppLogger('pgsql')

export async function addNewAction(item: LendingAction) {
    return await LendingAction.insert(item)
}

export async function addNewPosition(item: LendingPosition) {
    return await LendingPosition.insert(item)
}

export async function addNewMarketConfig(item: LendingMarketConfigure) {
    return await LendingMarketConfigure.insert(item)
}

export async function addNewAssetConfig(item: LendingAssetConfigure) {
    return await LendingAssetConfigure.insert(item)
}
