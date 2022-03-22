import { gql, request } from 'graphql-request'

export * from './lending'
export * from './amm'


type SubqlMeta = {
    lastProcessedHeight: number
    lastProcessedTimestamp: string
}

export async function lastProcessedData(url: string): Promise<SubqlMeta> {
    const { _metadata } = await request(
        url,
        gql`
            query {
                _metadata {
                    lastProcessedHeight
                    lastProcessedTimestamp
                }
            }
        `
    )
    return _metadata
}