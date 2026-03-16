import { writable, type Writable } from "svelte/store";

export function localStore<T>(key: string, initial: T) {
    return localStoreCustom<T, T>(key, initial, value => value, value => value)
}

export function localStoreCustom<T, S>(
    key: string, 
    initial: T, 
    serialize: (value: T) => S,
    deserialize: (serialized: S) => T,
): Writable<T> {
    const existing = localStorage.getItem(key)

    const store = writable<T>(existing === null ? initial : deserialize(JSON.parse(existing)))
    
    store.subscribe(value => localStorage.setItem(key, JSON.stringify(serialize(value))))
    
    return store
}