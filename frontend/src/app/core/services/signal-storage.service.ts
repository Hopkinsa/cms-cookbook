import { signal, effect, WritableSignal } from '@angular/core';

/*
------ EXAMPLES -------

DATE OBJECT
const dateSignal = storageSignal('last-login', new Date(), {
  serializer: (v) => v.toISOString(),
  deserializer: (str) => new Date(str),
});

CROSS TABS - No effect if sessionStorage
const counter = storageSignal('counter', 0, { crossTabSync: true });

STORAGE TYPE
const sessionCounter = storageSignal('counter', 0, {
  storage: sessionStorage,
});
*/

export interface StorageSignalOptions<T> {
  storage?: Storage;
  serializer?: (v: T) => string;
  deserializer?: (raw: string) => T;
  crossTabSync?: boolean;
}

export function storageSignal<T>(
  key: string,
  defaultValue: T,
  options: StorageSignalOptions<T> = {}
): WritableSignal<T> {
  const {
    storage = localStorage,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    crossTabSync = true,
  } = options;
  let initial = defaultValue;
  try {
    const raw = storage.getItem(key);
    if (raw !== null) initial = deserializer(raw);
  } catch {}
  const state = signal<T>(initial);
  effect(() => {
    try {
      storage.setItem(key, serializer(state()));
    } catch (err) {
      console.error(`storageSignal - Failed for ${key}:`, err);
    }
  });
  if (crossTabSync && typeof window !== 'undefined') {
    window.addEventListener('storage', (ev: StorageEvent) => {
      if (ev.key !== key || ev.storageArea !== storage) return;
      if (ev.newValue === null) return;
      try {
        state.set(deserializer(ev.newValue));
      } catch {
        // ignore malformed data
      }
    });
  }
  return state;
}