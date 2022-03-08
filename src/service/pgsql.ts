import { LendingAction } from '../models'
import { getAppLogger } from '../libs'

const log = getAppLogger('pgsql')

export async function addNewAction(item: LendingAction) {
    log.info('add new action')
    return await LendingAction.insert(item)
}