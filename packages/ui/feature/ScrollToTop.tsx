import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = memo(() => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
});
