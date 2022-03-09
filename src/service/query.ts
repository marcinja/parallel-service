import { ApiPromise, WsProvider } from '@polkadot/api'
import { options } from '@parallel-finance/api'
import { typesBundle } from '@parallel-finance/type-definitions'
import { getAppLogger } from '../libs'

const log = getAppLogger('service-query')

export class ApiService {
    static api: ApiPromise

    static async init(endpoint: string) {
        const api = await ApiPromise.create(
            options({
                types: {
                    TAssetBalance: 'Balance'
                },
                typesBundle,
                provider: new WsProvider(endpoint)
            })
        )
        this.api = api
    }
    
    static async getExchangeRate(assetId: number): Promise<string> {
        const re = (await (await this.api.at('0x420a8f7c7d08256280a18b67a70b85d44eb455c16e0f5101cbc39259f8ffe52e')).query.loans.exchangeRate(assetId)).toString()
        const re1 = (await (await this.api.query.loans.exchangeRate(assetId))).toString()
        return re1
    }

    static async getBalance(assetId: number, address: string) {
        const re = (await this.api.query.assets.account(assetId, address)).toJSON()
        log.info('get balance result: %o', re)
    }

}
