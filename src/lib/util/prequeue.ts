export async function* prequeue<T>(size: number, next: () => Promise<T>): AsyncIterator<T> {
    const queue = new Array(size).keys().map(() => next()).toArray()
    
    while (true) {
        yield await queue.shift()!
        queue.push(next())
    }
}