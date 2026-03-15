import { writable, type Writable } from "svelte/store";

export function localStore<T>(key: string, initial: T): Writable<T> {
    const existing = localStorage.getItem(key)

    const store = writable<T>(existing === null ? initial : JSON.parse(existing))
    
    store.subscribe(value => localStorage.setItem(key, JSON.stringify(value)))
    
    return store
}