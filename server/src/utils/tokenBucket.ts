/**
 * Per-user token bucket rate limiter.
 *
 * Each user (identified by a normalized key — email/phone/memberId)
 * gets a bucket with `maxTokens` tokens. Every login attempt consumes
 * one token. Tokens refill at `refillRate` per `refillIntervalMs`.
 *
 * When remaining tokens fall to ≤ `lowTokenThreshold`, the API
 * returns the remaining count to the client so it can display a
 * warning.
 */

const DEFAULT_MAX_TOKENS = 5;
const DEFAULT_REFILL_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_REFILL_RATE = 5; // full bucket refills every 15 min
const DEFAULT_LOW_THRESHOLD = 3; // start warning when ≤ 3 remaining

interface Bucket {
    tokens: number;
    lastRefill: number;
}

export class TokenBucket {
    private buckets = new Map<string, Bucket>();
    private maxTokens: number;
    private refillIntervalMs: number;
    private refillRate: number;
    private lowThreshold: number;

    constructor(opts?: {
        maxTokens?: number;
        refillIntervalMs?: number;
        refillRate?: number;
        lowThreshold?: number;
    }) {
        this.maxTokens = opts?.maxTokens ?? DEFAULT_MAX_TOKENS;
        this.refillIntervalMs = opts?.refillIntervalMs ?? DEFAULT_REFILL_INTERVAL_MS;
        this.refillRate = opts?.refillRate ?? DEFAULT_REFILL_RATE;
        this.lowThreshold = opts?.lowThreshold ?? DEFAULT_LOW_THRESHOLD;
    }

    /** Normalise a user identifier to a bucket key. */
    private keyFor(identifier: string): string {
        const raw = identifier.trim().toLowerCase();
        // Remove all non-alphanumeric characters for a clean key
        return raw.replace(/[^a-z0-9@._-]/g, '');
    }

    /** Refill tokens based on elapsed time, then return current count. */
    private refill(key: string): Bucket {
        const now = Date.now();
        let bucket = this.buckets.get(key);
        if (!bucket) {
            bucket = { tokens: this.maxTokens, lastRefill: now };
            this.buckets.set(key, bucket);
            return bucket;
        }

        const elapsed = now - bucket.lastRefill;
        if (elapsed >= this.refillIntervalMs) {
            const intervals = Math.floor(elapsed / this.refillIntervalMs);
            const add = intervals * this.refillRate;
            bucket.tokens = Math.min(this.maxTokens, bucket.tokens + add);
            bucket.lastRefill = now;
        }

        return bucket;
    }

    /**
     * Attempt to consume one token for the given user identifier.
     *
     * Returns:
     *   { allowed, remaining, retryAfterMs }
     *
     * - allowed: true if token was consumed
     * - remaining: tokens left after consumption
     * - retryAfterMs: 0 if allowed, ms until next token if denied
     */
    consume(
        identifier: string,
    ): { allowed: boolean; remaining: number; retryAfterMs: number } {
        const key = this.keyFor(identifier);
        const bucket = this.refill(key);

        if (bucket.tokens <= 0) {
            // How long until a new token arrives?
            const nextRefillMs = this.refillIntervalMs - (Date.now() - bucket.lastRefill);
            return {
                allowed: false,
                remaining: 0,
                retryAfterMs: Math.max(1, nextRefillMs),
            };
        }

        bucket.tokens -= 1;
        return {
            allowed: true,
            remaining: bucket.tokens,
            retryAfterMs: 0,
        };
    }

    /** Check if remaining tokens are at or below the low threshold. */
    isLow(identifier: string): boolean {
        const key = this.keyFor(identifier);
        const bucket = this.refill(key);
        return bucket.tokens <= this.lowThreshold;
    }

    /** Reset a user's bucket (e.g. after successful login). */
    reset(identifier: string): void {
        const key = this.keyFor(identifier);
        this.buckets.delete(key);
    }

    /** Get current remaining tokens without consuming. */
    remaining(identifier: string): number {
        const key = this.keyFor(identifier);
        const bucket = this.refill(key);
        return bucket.tokens;
    }

    /** Cleanup stale buckets to prevent memory leaks. */
    cleanup(maxAgeMs: number = 30 * 60 * 1000): void {
        const now = Date.now();
        for (const [key, bucket] of this.buckets) {
            if (now - bucket.lastRefill > maxAgeMs) {
                this.buckets.delete(key);
            }
        }
    }
}

/** Singleton instance used across the app. */
export const loginBucket = new TokenBucket({
    maxTokens: 5,
    refillIntervalMs: 15 * 60 * 1000, // 15 minutes
    refillRate: 5, // all 5 tokens come back after 15 min
    lowThreshold: 3, // show warning when ≤ 3 remaining
});
