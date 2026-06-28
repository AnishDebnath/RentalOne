import { useState, useEffect, useRef } from 'react';

/**
 * Reveals items one by one with a delay between each.
 * - Starts with first item visible immediately.
 * - Each subsequent item appears after `delay` ms.
 * - When count increases (e.g., load more), existing items stay, new ones trickle in.
 * - When count drops (e.g., filter), resets to first item.
 */
export function useStaggeredRender(count: number, delay: number = 120): number {
    const [visibleCount, setVisibleCount] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        // Cleanup previous timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // No items → nothing visible
        if (count === 0) {
            setVisibleCount(0);
            return;
        }

        // Ensure at least 1 visible when items exist
        setVisibleCount(prev => {
            if (prev === 0) return 1;
            if (prev > count) return count;
            return prev;
        });

        // If all items already visible, no interval needed
        // (Will be checked inside interval via ref)
        let currentCount = count;

        timerRef.current = setInterval(() => {
            setVisibleCount(prev => {
                if (prev >= currentCount) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    timerRef.current = null;
                    return currentCount;
                }
                return prev + 1;
            });
        }, delay);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [count, delay]);

    return visibleCount;
}
