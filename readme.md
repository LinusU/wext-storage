# Web Extensions polyfill: `storage`

Web Extensions polyfill for the `browser.storage.*` API.

The goal with this package is to implmenet a subset of the Web Extensions API that works for Chrome, Firefox, Safari and Edge.

Since this is a subset of the Web Extensions API, not all properties will be available. The best way right now is to look in the `index.d.ts` which holds TypeScript definitions of the properties available. The interface specificed in the TypeScript definitions should work on all platforms.

PRs welcome 🚀

## Installation

```sh
npm install --save @wext/storage
```

## Usage

```js
const storage = require('@wext/storage')

Promise.resolve()
  .then(() => storage.local.set('test', 'foobar'))
  .then(() => storage.local.get('test'))
  .then(result => console.log(result.test))
//=> foobar
```

## Implemented methods

| Feature | Chrome | Firefox | Safari | Edge |
| ------- | :----: | :-----: | :----: | :--: |
| `get` | ✅ | ✅ | ❌ | ❌ |
| `set` | ✅ | ✅ | ❌ | ❌ |
| `remove` | ✅ | ✅ | ❌ | ❌ |
| `clear` | ✅ | ✅ | ❌ | ❌ |

## Implemented events

| Feature | Chrome | Firefox | Safari | Edge |
| ------- | :----: | :-----: | :----: | :--: |
| `onChanged` | ✅ | ✅ | ❌ | ❌ |
