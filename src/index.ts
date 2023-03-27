import { defineStore } from 'pinia';
import type { PiniaPluginContext, StateTree, Store } from 'pinia';
import { createStorage } from 'unstorage';
import type { Driver, Storage } from 'unstorage';

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    unstorage?: StoreOptions
  }
}

const configureStore = (store: Store, storage: Storage, filter?: Array<string>) => {
  storage.getItem(store.$id).then((state) => {
    store.$patch(state);
  });

  const _filter = (filter) ?? Object.keys(store.$state);

  store.$subscribe(() => storage.setItem(store.$id,
    JSON.stringify(Object.fromEntries(
      Object.entries(store.$state).filter(([key]) => (_filter.indexOf(key) ?? 0) > -1)
    ))
  ));

  storage.setItem(store.$id,
    JSON.stringify(Object.fromEntries(
      Object.entries(store.$state).filter(([key]) => (_filter.indexOf(key) ?? 0) > -1)
    ))
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface StoreOptions {
  driver: Driver,
  filter?: Array<string>
  storage?: Storage
}

type PiniaStore = ReturnType<typeof defineStore>;

const unstorageOptionsBag: Record<string, StoreOptions> = {};

export const persistStore = (store: PiniaStore, unstorageOptions: StoreOptions): PiniaStore => {
  unstorageOptionsBag[store.$id] = unstorageOptions;
  return store;
};

export interface PluginOptions {
  driver?: Driver
}

export const createUnstoragePlugin = ({ driver }: PluginOptions = {}) => {
  return({ options, store }: PiniaPluginContext) => {
    if(options.unstorage) {
      configureStore(store, createStorage({ driver: options.unstorage.driver }), options.unstorage.filter);
    }
    else if(unstorageOptionsBag[store.$id]) {
      configureStore(store, createStorage({ driver: unstorageOptionsBag[store.$id].driver }), unstorageOptionsBag[store.$id].filter );
    }
    else if(driver) {
      configureStore(store, createStorage({ driver }));
    }
  };
};
