import { useCallback, useEffect, useRef, useState } from 'react';
import { sessionCache } from '@rentalone/utils';

interface RetryConfig {
  /** Maximum retry attempts before giving up. Default: Infinity (retry forever) */
  maxRetries?: number;
  /** Fixed delay between retries in ms. Default: 2000 */
  retryDelayMs?: number;
  /** If set, caches successful responses in sessionStorage under this key.
   *  When fetch fails, cached data is shown immediately instead of loading. */
  cacheKey?: string;
  /** TTL for cached data in ms. Default: 5 minutes */
  cacheTtlMs?: number;
}

interface RetryFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches data with automatic retry on failure.
 * If cacheKey provided, shows cached data on failure (no loading state).
 * Re-fetches when dependencies change.
 * Cleans up timers on unmount.
 */
export function useRetryFetch<T = any>(
  fetcher: () => Promise<T>,
  deps: any[] = [],
  config: RetryConfig = {},
): RetryFetchState<T> & { refetch: () => void } {
  const { maxRetries = 3, retryDelayMs = 2000, cacheKey, cacheTtlMs } = config;

  // Hydrate from cache immediately if available
  const [state, setState] = useState<RetryFetchState<T>>(() => {
    if (cacheKey) {
      const cached = sessionCache.get<T>(cacheKey);
      if (cached) {
        return { data: cached, loading: false, error: null };
      }
    }
    return { data: null, loading: true, error: null };
  });

  const retryCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);

  // Keep fetcher ref fresh (avoids stale closure issues)
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const execute = useCallback(async () => {
    // Start loading only if no cached data to show
    setState((prev) => (prev.data ? prev : { ...prev, loading: true }));
    retryCountRef.current = 0;

    const attempt = async (): Promise<void> => {
      if (!mountedRef.current) return;

      try {
        const result = await fetcherRef.current();
        if (!mountedRef.current) return;
        // Cache successful response
        if (cacheKey) {
          sessionCache.set(cacheKey, result, cacheTtlMs);
        }
        setState({ data: result, loading: false, error: null });
        retryCountRef.current = 0;
      } catch (err) {
        if (!mountedRef.current) return;
        retryCountRef.current++;

        // If we have cached data, show it immediately and keep retrying
        if (cacheKey) {
          const cached = sessionCache.get<T>(cacheKey);
          if (cached) {
            setState({ data: cached, loading: false, error: null });
            // Retry in background regardless of maxRetries — cache keeps UI alive
            timerRef.current = setTimeout(attempt, retryDelayMs);
            return;
          }
        }

        // No cached data: respect maxRetries, don't keep user waiting
        if (retryCountRef.current >= maxRetries) {
          setState((prev) =>
            prev.data
              ? prev
              : { data: null, loading: false, error: err as Error },
          );
          return;
        }

        timerRef.current = setTimeout(attempt, retryDelayMs);
      }
    };

    await attempt();
  }, [retryDelayMs, maxRetries, cacheKey, cacheTtlMs]);

  // Run fetch on mount and when deps change
  useEffect(() => {
    mountedRef.current = true;
    void execute();
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // Clear cached data so we show loading again on manual refetch
    if (cacheKey) {
      sessionCache.remove(cacheKey);
    }
    void execute();
  }, [execute, cacheKey]);

  return { ...state, refetch };
}
