/**
 * Simple in-memory cache with TTL.
 * No external dependencies. Thread-safe for single-process Node.
 * Use for data that changes infrequently (product listings, stats).
 */

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

const store = new Map<string, CacheEntry<any>>();

const DEFAULT_TTL_MS = 30_000; // 30 seconds

export const cache = {
    get<T>(key: string): T | undefined {
        const entry = store.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expiresAt) {
            store.delete(key);
            return undefined;
        }
        return entry.data as T;
    },

    set<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
        store.set(key, { data, expiresAt: Date.now() + ttlMs });
    },

    clear(key?: string): void {
        if (key) {
            store.delete(key);
        } else {
            store.clear();
        }
    },

    /** Generate cache key from request path + query params */
    key(path: string, query?: Record<string, string | undefined>): string {
        if (!query) return path;
        const sorted = Object.keys(query)
            .filter((k) => query[k] !== undefined)
            .sort()
            .map((k) => `${k}=${query[k]}`)
            .join('&');
        return sorted ? `${path}?${sorted}` : path;
    },
};
