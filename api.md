<a name="top"></a>
# parallel v0.1.0

parallel lending service api doc

# Table of contents

- [Action](#Action)
  - [GetActionList](#GetActionList)
- [Asset](#Asset)
  - [GetAllAssets](#GetAllAssets)
  - [GetLatestAssetByAssetId](#GetLatestAssetByAssetId)
  - [GetLatestAssets](#GetLatestAssets)
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
GET /action
```

### Query Parameters

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| startBlock | `Number` | <p>actions more than startBlock</p> |
| endBlock | `Number` | <p>actions lessn than or equal to endBlock</p> |
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
     pageSize: 20,
     pageCount: 4,
     totalSize: 76,
     list: []
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

# <a name='Asset'></a> Asset

## <a name='GetAllAssets'></a> GetAllAssets
[Back to top](#top)

<p>get asset configure list by the query parameters. All of they can be use in combination or individually according to your requirments.</p>

```
GET /asset
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
 code: 0,
 msg: 'ok',
 data: {
     pageIndex: 1,
     pageSize: 20,
     pageCount: 4,
     totalSize: 76,
     list: []
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

## <a name='GetLatestAssetByAssetId'></a> GetLatestAssetByAssetId
[Back to top](#top)

<p>get latest asset configure of today by asset id.</p>

```
GET /asset/latest/:assetId
```

## <a name='GetLatestAssets'></a> GetLatestAssets
[Back to top](#top)

<p>get latest asset configure of today.</p>

```
GET /asset/latest
```

# <a name='Market'></a> Market

## <a name='GetAllMarkets'></a> GetAllMarkets
[Back to top](#top)

<p>get all market configure by query parameter.</p>

```
GET /market
```

### Query Parameters

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
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
     pageSize: 20,
     pageCount: 4,
     totalSize: 76,
     list: []
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
GET /market/latest/:symbol
```

## <a name='GetLatestMarkets'></a> GetLatestMarkets
[Back to top](#top)

<p>get latest market configure of tody.</p>

```
GET /market/latest
```

# <a name='Position'></a> Position

## <a name='GetLatestPositions'></a> GetLatestPositions
[Back to top](#top)

<p>get latest position by query parameters of today.</p>

```
GET /position/latest
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
GET /position
```

### Query Parameters

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| address | `String` | <p>user address</p> |
| symbol | `String` | <p>asset symbol, e.g. KSM</p> |
| pageIndex | `Number` | <p>paganation</p> |
| pageSize | `Number` | <p>paganation</p> |

