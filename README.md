# @nozomuikuta/h3-cors

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> h3-native CORS event handler

---

# 🔔 Announcement 🔔

This package has been integrated to `h3` v1.5.0, so you can import all features of this package from `h3` directly. 🎉

This repository and the npm package has been archived.

Thank you for all kinds of contribution to this package!

---

## Usage

Install package:

```sh
# npm
npm install @nozomuikuta/h3-cors

# yarn
yarn add @nozomuikuta/h3-cors

# pnpm
pnpm install @nozomuikuta/h3-cors
```

Import:

```js
// ESM
import { defineCorsEventHandler } from '@nozomuikuta/h3-cors'

// CommonJS
const { defineCorsEventHandler } = require('@nozomuikuta/h3-cors')
```

Usage:

```js
import { createServer } from 'http'
import { createApp } from 'h3'
import { defineCorsEventHandler } from '@nozomuikuta/h3-cors'

const app = createApp()
app.use(defineCorsEventHandler({ /* options */ }))
app.use('/', () => 'Hello world!')

createServer(app).listen(process.env.PORT || 3000)
```

## Options

- `origin` is either of the following values to configure **Access-Control-Allow-Origin** CORS header
  - `"*"` (default)
  - `"null"`
  - array of strings or regular expressions
  - function that receives value of **Origin** header and returns boolean
    - If `false` is returned, an error is thrown
- `methods` is `"*"` or an array of HTTP methods to configures **Access-Control-Allow-Methods** CORS header (default: `"*"`)
- `allowHeaders` is `"*"` or an array of HTTP headers to configure **Access-Control-Allow-Headers** CORS header (default: `"*"`)
- `exposeHeaders` is `"*"` or an array of HTTP headers to configure **Access-Control-Expose-Headers** CORS header (default: `"*"`)
- `credentials` is boolean to configure **Access-Control-Allow-Credentials** CORS header (default: `false`)
- `maxAge` is a string to configure **Access-Control-Max-Age**, or `false` to unset the header (default: `false`)
- `preflight.statusCode` is used to set `event.res.statusCode` for preflight request (default: `204`)

```ts
interface CorsOptions {
  origin?: '*' | 'null' | (string | RegExp)[] | ((origin: string) => boolean)
  methods?: '*' | HTTPMethod[]
  allowHeaders?: '*' | string[]
  exposeHeaders?: '*' | string[]
  credentials?: boolean
  maxAge?: string | false
  preflight?: {
    statusCode?: number
  }
}
```

## Utilities

You can import utility functions as well as event handler.

- `isPreflight(event)`
- `isAllowedOrigin(origin, options)`
- `appendCorsPreflightHeaders(event, options)`
- `appendCorsActualRequestHeaders(event, options)`


## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛

Published under [MIT License](./LICENSE).


<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@nozomuikuta/h3-cors?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nozomuikuta/h3-cors
[npm-downloads-src]: https://img.shields.io/npm/dm/@nozomuikuta/h3-cors?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nozomuikuta/h3-cors
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/nozomuikuta/h3-cors/ci.yml?branch=main&style=flat-square
[github-actions-href]: https://github.com/nozomuikuta/h3-cors/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/nozomuikuta/h3-cors/main?style=flat-squarestyle=flat-square
[codecov-href]: https://codecov.io/gh/nozomuikuta/h3-cors
