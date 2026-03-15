
export function mapWith<K, V>(map: Map<K, V>, key: K, value: V) {
    map.set(key, value)
    return map
}

export function associate<K, V>(keys: Iterable<K>, transform: (key: K) => V): Map<K, V> {
    const map = new Map<K, V>()
    for (var key of keys)
        map.set(key, transform(key))
    return map;
}

export function toColor(num: number) {
    num >>>= 0
    const b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16
    return `rgb(${r},${g},${b})`
}