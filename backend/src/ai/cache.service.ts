type Call<T> = { value : T; exp: number};
const store = new Map<string, Call<any>>();
const ttl = Number(process.env.CACHE_TTL_SECONDS ?? 300) * 1000;

export function getCache<T>( key: string ) : T | null {
    const call = store.get(key);
    if ( !call ) return null;
    if (Date.now() > call.exp) {
        store.delete(key);
        return null;
    }

    return call.value as T;
}

export function setCache<T> ( key: string, value: T) {
    store.set(key, { value, exp: Date.now() + ttl * 1000 } );
}