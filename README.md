# unstorage-pinia-plugin

![npm](https://img.shields.io/npm/v/unstorage-pinia-plugin)
![npm](https://img.shields.io/npm/dt/unstorage-pinia-plugin)
![NPM](https://img.shields.io/npm/l/unstorage-pinia-plugin)

Persist and hydrate your pinia state using [Unstorage](https://github.com/unjs/unstorage)!

## Install

```sh
# npm
npm i unstorage unstorage-pinia-plugin

# yarn
yarn add unstorage unstorage-pinia-plugin
```

## Usage

You can use any available Unstorage driver. Drivers can be set either globally or per store. Locally defined driver overrides global definition.

Global driver:
```ts
// pinia.ts
import { createPinia } from 'pinia';
import { createUnstoragePlugin } from 'unstorage-pinia-plugin';

const pinia = createPinia();

pinia.use(createUnstoragePlugin({
  // unstorage plugin options
}));

export default pinia;
```

Per store driver:
```ts
// pinia.ts
import { createPinia } from 'pinia';
import { createUnstoragePlugin } from 'unstorage-pinia-plugin';

const pinia = createPinia();

pinia.use(createUnstoragePlugin());

export default pinia;
```

```ts
// store.ts
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { defineStoreStorage } from 'unstorage-pinia-plugin';

export const useStore = defineStore(
  'store',
  () => {
    // setup and return your state, getters and actions
  },
  {
    unstorage: {
      // unstorage store options
    }
  }
);
```

If you prefer the old option way:
```ts
import { persistStore } from 'unstorage-pinia-plugin';

export const useStore = persistStore(
  defineStore(
    'store',
    {
      // define your state, getters and actions
    }
  ),
  {
    // unstorage store options
  }
);
```

May work with Nuxt, be not tested:
```ts
import { persistStore } from 'unstorage-pinia-plugin';

export const useStore = defineStore(
  'store',
  {
    // define your state, getters and actions
  }
);

persistStore(useStore,
  {
    // unstorage store options
  }
);
```

## Configuration

### Plugin options

- `driver: Driver` : Default unstorage driver.

### Store options

- `driver: Driver` : Driver for the store.
- `filter?: Array<string>` : State keys you actually want to persist. All keys are pushed by default.

## License

[MIT](./LICENSE)
