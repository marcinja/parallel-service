parallel service.



### 

## Development

### Dependencies:

* Nodejs: ^14.17.0

* postgresql: ^10.20

* redis: ^5.0

* parallel-lending-subql: [GitHub - parallel-finance/lending-subql](https://github.com/parallel-finance/lending-subql)

### local

Config the postgresql & redis endpoint and specify your `SUBSTRATE_ENDPOINT` & parallel-lending-subql endpoint, which running on `SUBSTRATE_ENDPOINT`endpoint.

```js
yarn install
yarn dev
```

### run with Docker

```
docker-compose up --remove-orphans
```

#### eslint check

```
yarn lint
```

#### api doc

```
yarn api    // api on localhost:4321
yarn doc    // markdown api doc
```
