import { LendingAction } from '../models'
import { getAppLogger } from '../libs'

const log = getAppLogger('pgsql')

export async function addNewAction(item: LendingAction) {
    return await LendingAction.insert(item)
}