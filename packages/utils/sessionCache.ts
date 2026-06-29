/** Lightweight sessionStorage cache for API responses.
 *  Clears when tab closes. Survives page refreshes.
 *  Used as fallback when server unreachable — keeps UI alive. */

const PREFIX = 'api_cache_';

export const sessionCache = {
  get<T>(key: string): T | null {
    try {
      const raw = sessionStorage.getItem(PREFIX + key);
      if (!raw) return null;
      const { data, expiresAt } = JSON.parse(raw);
      if (Date.now() > expiresAt) {
        sessionStorage.removeItem(PREFIX + key);
        return null;
      }
      return data as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000): void {
    try {
      sessionStorage.setItem(
        PREFIX + key,
        JSON.stringify({ data, expiresAt: Date.now() + ttlMs }),
      );
    } catch {
      // sessionStorage full or unavailable — ignore
    }
  },

  remove(key: string): void {
    sessionStorage.removeItem(PREFIX + key);
  },
};
