import type { PiniaPluginContext, StateTree, Store } from 'pinia';
import { createStorage } from 'unstorage';
import type { Driver, Storage } from 'unstorage';

export interface UnstorageStoreOptions {
  driver: Driver,
  filter?: Array<string>
  storage?: Storage
}

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    unstorage?: UnstorageStoreOptions
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

const unstorageOptionsBag: Record<string, UnstorageStoreOptions> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const persistStore = (store: any, unstorageOptions: UnstorageStoreOptions) => {
  unstorageOptionsBag[(store as Store).$id] = unstorageOptions;
  return store;
};

export interface UnstoragePluginOptions {
  driver?: Driver
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUnstoragePlugin = ({ driver }: UnstoragePluginOptions = {}) => (ctx: any) => {
  const { options, store } = ctx as PiniaPluginContext;

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
