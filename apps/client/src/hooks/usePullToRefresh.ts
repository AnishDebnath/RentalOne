import { useEffect, useRef, useState } from 'react';

const usePullToRefresh = (onRefresh) => {
  const [distance, setDistance] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    const handleStart = (event) => {
      if (window.scrollY === 0) {
        startRef.current = event.touches[0].clientY;
      }
    };

    const handleMove = (event) => {
      if (startRef.current === null) return;
      const delta = event.touches[0].clientY - startRef.current;
      if (delta > 0) setDistance(Math.min(delta, 100));
    };

    const handleEnd = async () => {
      if (distance > 70 && onRefresh) await onRefresh();
      startRef.current = null;
      setDistance(0);
    };

    window.addEventListener('touchstart', handleStart, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [distance, onRefresh]);

  return distance;
};

export default usePullToRefresh;
