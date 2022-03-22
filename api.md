<a name="top"></a>
# parallel v0.1.0

parallel lending service api doc

# Table of contents

- [Action](#Action)
  - [GetActionList](#GetActionList)
  - [GetActionListBySymbol](#GetActionListBySymbol)
- [Asset](#Asset)
  - [GetAllAssets](#GetAllAssets)
  - [GetLatestAssetByAssetId](#GetLatestAssetByAssetId)
  - [GetLatestAssets](#GetLatestAssets)
- [Health](#Health)
  - [healthCheck](#healthCheck)
- [Liquidity](#Liquidity)
  - [GetAssetsValue](#GetAssetsValue)
  - [GetPoolLiquidityById](#GetPoolLiquidityById)
  - [GetPoolList](#GetPoolList)
- [Market](#Market)
  - [GetAllMarkets](#GetAllMarkets)
  - [GetLatestMarketBySymbol](#GetLatestMarketBySymbol)
  - [GetLatestMarkets](#GetLatestMarkets)
- [Position](#Position)
  - [GetLatestPositions](#GetLatestPositions)
  - [GetPositionList](#GetPositionList)

___


# <a name='Action'></a> Action

## <a name='GetActionList'></a> GetActionList
[Back to top](#top)

<p>get action list by the query parameters. All of they can be use in combination or individually according to your requirments.</p>

```
GET /api/v1/mm/action
```

### Query Parameters

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| startBlock | `Number` | <p>actions more than startBlock</p> |
| endBlock | `Number` | <p>actions lessn than or equal to endBlock</p> |
| address | `String` | <p>user address</p> |
| pageIndex | `Number` | <p>paganation</p> |
| pageSize | `Number` | <p>paganation</p> |

### Success response example

#### Success response example - `success`

```json
{
    "code": 0,
    "msg": "ok",
    "data": {
        "pageIndex": 1,
        "pageSize": 3,
        "totalSize": 9,
        "pageCount": 4,
        "list": [
            {
                "id": "0x42d0025f6eeac09f51040646a6828767e5bba6867c4f0c928bb7e9eaedf950e1",
                "address": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK",
                "token": "KSM",
                "amount": "500000000000000",
                "method": "Deposited",
                "supply_balance": "50000000000000000",
                "borrow_balance": "0",
                "borrow_index": "1000032732650262113",
                "exchange_rate": "20000000000000000",
                "block_number": 4274,
                "block_timestamp": "2022-03-10T08:12:54.046Z"
            },
            {
                "id": "0x159cb0a95de0532bdfd8b0141c4168368c7e142e0da2c84c290136fd77a74658",
                "address": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK",
                "token": "KSM",
                "amount": "500000000000000",
                "method": "Deposited",
                "supply_balance": "50000000000000000",
                "borrow_balance": "0",
                "borrow_index": "1000032732650262113",
                "exchange_rate": "20000000000000000",
                "block_number": 4276,
                "block_timestamp": "2022-03-10T08:13:18.041Z"
            },
            {
                "id": "0x5fa6a75d1028d1eda34e7630e41d744cf8c5169c3fc74da81eb5d87e5d58c4f5",
                "address": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK",
                "token": "sKSM",
                "amount": "100000000000000",
                "method": "Borrowed",
                "supply_balance": "50000000000000000",
                "borrow_balance": "99999932267910",
                "borrow_index": "1000032732650262113",
                "exchange_rate": "20000000000000000",
                "block_number": 4358,
                "block_timestamp": "2022-03-10T08:30:06.055Z"
            }
        ]
    }
}
```

### Error response example

#### Error response example - `error`

```json
{
 code: 2001,
 msg: 'invalid parameter',
 data: {}
}
```

## <a name='GetActionListBySymbol'></a> GetActionListBySymbol
[Back to top](#top)

<p>get action list by symbol</p>

```
GET /api/v1/mm/action/:symbol
```

# <a name='Asset'></a> Asset

## <a name='GetAllAssets'></a> GetAllAssets
[Back to top](#top)

<p>get asset configure list by the query parameters. All of they can be use in combination or individually according to your requirments.</p>

```
GET /api/v1/mm/asset
```

### Query Parameters

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| assetId | `Number` | <p>asset id</p> |
| pageIndex | `Number` | <p>paganation</p> |
| pageSize | `Number` | <p>paganation</p> |

### Success response example

#### Success response example - `success`

```json
{
    "code": 0,
    "msg": "ok",
    "data": {
        "pageIndex": 1,
        "pageSize": 3,
        "pageCount": 11,
        "totalSize": 32,
        "list": [
            {
                "id": "1000-1646870400000",
                "block_number": 8954,
                "asset_id": 1000,
                "total_supply": "0",
                "total_borrows": "0",
                "total_reserves": "0",
                "borrow_index": "1000068350887518697",
                "borrow_rate": "20000000000000000",
                "supply_rate": "0",
                "exchange_rate": "20000000000000000",
                "utilization_ratio": "0",
                "last_accrued_timestamp": "1646956722",
                "block_timestamp": "2022-03-10T23:59:54.05"
            },
            {
                "id": "1000-1646956800000",
                "block_number": 13673,
                "asset_id": 1000,
                "total_supply": "1249781250000000",
                "total_borrows": "0",
                "total_reserves": "0",
                "borrow_index": "1000104975064518685",
                "borrow_rate": "20000000000000000",
                "supply_rate": "0",
                "exchange_rate": "20000000000000000",
                "utilization_ratio": "0",
                "last_accrued_timestamp": "1647014262",
                "block_timestamp": "2022-03-11T15:58:06.057"
            },
            {
                "id": "1000-1647043200000",
                "block_number": 23146,
                "asset_id": 1000,
                "total_supply": "1249781250000000",
                "total_borrows": "0",
                "total_reserves": "0",
                "borrow_index": "1000178341617883892",
                "borrow_rate": "20000000000000000",
                "supply_rate": "0",
                "exchange_rate": "20000000000000000",
                "utilization_ratio": "0",
                "last_accrued_timestamp": "1647129498",
                "block_timestamp": "2022-03-12T23:59:54.047"
            }
        ]
    }
}
```

### Error response example

#### Error response example - `error`

```json
{
 code: 2001,
 msg: 'invalid parameter',
 data: {}
}
```

## <a name='GetLatestAssetByAssetId'></a> GetLatestAssetByAssetId
[Back to top](#top)

<p>get latest asset configure of today by asset id.</p>

```
GET /api/v1/mm/latest/:assetId
```

## <a name='GetLatestAssets'></a> GetLatestAssets
[Back to top](#top)

<p>get latest asset configure of today.</p>

```
GET /api/v1/mm/asset/latest
```

# <a name='Health'></a> Health

## <a name='healthCheck'></a> healthCheck
[Back to top](#top)

<p>get the service health status.</p>

```
GET /api/health
```

### Success response example

#### Success response example - `success`

```json
{
 code: 0,
 msg: 'ok',
 data: {
     status: 'ok'
 }
```

# <a name='Liquidity'></a> Liquidity

## <a name='GetAssetsValue'></a> GetAssetsValue
[Back to top](#top)

<p>get asset value list.</p>

```
GET /api/v1/amm/assets/value
```

### Query Parameters

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| pageIndex | `Number` | <p>paganation</p> |
| pageSize | `Number` | <p>paganation</p> |

### Success response example

#### Success response example - `success`

```json
{
    "code": 0,
    "msg": "ok",
    "data": {
        "pageIndex": 1,
        "pageSize": 3,
        "totalSize": 9,
        "pageCount": 4,
        "list": [
            {
                "id": "102-1647928800000",
                "asset_id": 102,
                "symbol": "USDT",
                "value": "1000400000000000000",
                "block_number": 948032,
                "block_timestamp": "2022-03-22T06:43:30.000Z"
            },
            {
                "id": "100-1647928800000",
                "asset_id": 100,
                "symbol": "KSM",
                "value": "155448578614517399552",
                "block_number": 948033,
                "block_timestamp": "2022-03-22T06:43:48.000Z"
            },
            {
                "id": "101-1647932400000",
                "asset_id": 101,
                "symbol": "DOT",
                "value": "19783501147136991232",
                "block_number": 948232,
                "block_timestamp": "2022-03-22T07:48:06.000Z"
            }
        ]
    }
}
```

### Error response example

#### Error response example - `error`

```json
{
 code: 2001,
 msg: 'invalid parameter',
 data: {}
}
```

## <a name='GetPoolLiquidityById'></a> GetPoolLiquidityById
[Back to top](#top)

<p>get pool liquidity list by pool id</p>

```
GET /api/v1/amm/pool/liquidity/:poolId
```

### Query Parameters

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| pageIndex | `Number` | <p>paganation</p> |
| pageSize | `Number` | <p>paganation</p> |

### Success response example

#### Success response example - `success`

```json
{
    "code": 0,
    "msg": "ok",
    "data": {
        "pageIndex": 1,
        "pageSize": 3,
        "totalSize": 9,
        "pageCount": 4,
        "list": [
             {
                "id": "5002-1647216000000",
                "poolId": 5002,
                "baseVolume": "50000000000000",
                "quoteVolume": "25000000000000000",
                "block_number": 915893,
                "block_timestamp": "2022-03-15T06:00:12.357Z"
            },
            {
                "id": "5002-1647302400000",
                "poolId": 5002,
                "baseVolume": "46886295133536",
                "quoteVolume": "27756699367308444",
                "block_number": 920577,
                "block_timestamp": "2022-03-16T07:00:06.415Z"
            },
            {
                "id": "5002-1647388800000",
                "poolId": 5002,
                "baseVolume": "34610705558112",
                "quoteVolume": "38637364380875724",
                "block_number": 925169,
                "block_timestamp": "2022-03-17T07:59:30.335Z"
            }
        ]
    }
}
```

### Error response example

#### Error response example - `error`

```json
{
 code: 2001,
 msg: 'invalid parameter',
 data: {}
}
```

## <a name='GetPoolList'></a> GetPoolList
[Back to top](#top)

<p>get liquidity pool list.</p>

```
GET /api/v1/amm/pool/list
```

### Success response example

#### Success response example - `success`

```json
{
    "code": 0,
    "msg": "ok",
    "data": [
        {
            "id": 5003,
            "trader": "hJFU3r4zioT39AaBiTriJCVvoepeEGViF38DAkKECUjVwsvZK",
            "base_id": 1000,
            "quote_id": 100,
            "base_symbol": "sKSM",
            "quote_symbol": "KSM",
            "block_number": 915478,
            "block_timestamp": "2022-03-15T03:51:24.712Z"
        }
    ]
}
```

### Error response example

#### Error response example - `error`

```json
{
 code: 2001,
 msg: 'invalid parameter',
 data: {}
}
```

# <a name='Market'></a> Market

## <a name='GetAllMarkets'></a> GetAllMarkets
[Back to top](#top)

<p>get all market configure list.</p>

```
GET /api/v1/mm/market
```

### Query Parameters

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| pageIndex | `Number` | <p>paganation</p> |
| pageSize | `Number` | <p>paganation</p> |

### Success response example

#### Success response example - `success`

```json
{
 code: 0,
 msg: 'ok',
 data: {
     pageIndex: 1,
     pageSize: 2,
     pageCount: 4,
     totalSize: 11,
     list: {
     "XKSM":[{
                "id": "1000-1646870400000",
                "symbol": "XKSM",
                "collateral_factor": "500000",
                "borrow_cap": "100000000000000000",
                "close_factor": "500000",
                "liquidation_incentive": "1100000000000000000",
                "reserve_factor": "150000",
                "decimals": 12,
                "borrow_enabled": true,
                "block_number": 8954,
                "block_timestamp": "2022-03-10T23:59:54.050Z"
            }],
        "KSM":[{
                "id": "100-1646870400000",
                "symbol": "KSM",
                "collateral_factor": "500000",
                "borrow_cap": "100000000000000000",
                "close_factor": "500000",
                "liquidation_incentive": "1100000000000000000",
                "reserve_factor": "150000",
                "decimals": 12,
                "borrow_enabled": true,
                "block_number": 8954,
                "block_timestamp": "2022-03-10T23:59:54.050Z"
            }]
     },
        dateList: [
            {"date":"10/03/2022","assets":[""XKSM","KSM"]}
        ]
 }
}
```

### Error response example

#### Error response example - `error`

```json
{
 code: 1001,
 msg: 'invalid parameter',
 data: {}
}
```

## <a name='GetLatestMarketBySymbol'></a> GetLatestMarketBySymbol
[Back to top](#top)

<p>get latest market configure of today by symbol.</p>

```
GET /api/v1/mm/market/latest/:symbol
```

## <a name='GetLatestMarkets'></a> GetLatestMarkets
[Back to top](#top)

<p>get latest market configure of tody.</p>

```
GET /api/v1/mm/market/latest
```

# <a name='Position'></a> Position

## <a name='GetLatestPositions'></a> GetLatestPositions
[Back to top](#top)

<p>get latest position by query parameters of today.</p>

```
GET /api/v1/mm/position/latest
```

### Query Parameters

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| address | `String` | <p>user address</p> |
| symbol | `String` | <p>asset symbol, e.g. KSM</p> |

## <a name='GetPositionList'></a> GetPositionList
[Back to top](#top)

<p>get position list by the query parameters. All of they can be use in combination or individually according to your requirments.</p>

```
GET /api/v1/mm/position
```

### Query Parameters

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| address | `String` | <p>user address</p> |
| symbol | `String` | <p>asset symbol, e.g. KSM</p> |
| pageIndex | `Number` | <p>paganation</p> |
| pageSize | `Number` | <p>paganation</p> |

### Success response example

#### Success response example - `success`

```json
{
 code: 0,
 msg: 'ok',
 data: {
     pageIndex: 1,
     pageSize: 3,
     pageCount: 4,
     totalSize: 11,
     list: [
         {
                "id": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK-100-1647302400000",
                "address": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK",
                "token": "KSM",
                "supply_balance": "0",
                "borrow_balance": "0",
                "exchange_rate": "20000000000000000",
                "block_number": 434,
                "block_timestamp": "2022-03-15T20:19:42.000Z"
            },
            {
                "id": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK-102-1647302400000",
                "address": "hJLQoRFTEnxkAz4m15N29btT5vvn6gLCzjm5dZYaVRPtrRZLK",
                "token": "USDT",
                "supply_balance": "0",
                "borrow_balance": "0",
                "exchange_rate": "20000000000000000",
                "block_number": 434,
                "block_timestamp": "2022-03-15T20:19:42.000Z"
            }
        ]
    }
```

