import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryHeader from './CategoryHeader';
import CategoryProducts from './CategoryProducts';
import MobileFilters from './MobileFilters';
import Footer from '../../components/common/footer/Footer';
import axiosInstance from '../../api/axiosInstance';
import useDebounce from '../../hooks/useDebounce';
import usePullToRefresh from '../../hooks/usePullToRefresh';
import { sessionCache } from '@rentalone/utils';
import { format } from 'date-fns';

import { useCart } from '../../store/CartContext';

const Category = () => {
  const [params, setParams] = useSearchParams();
  const initialSearch = params.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);
  const { pickupDate, dropDate, setPickupDate, setDropDate } = useCart();

  const activeCategory = params.get('category') || 'All';
  const activeBrand = params.get('brand') || 'All';
  const debouncedSearch = useDebounce(search, 300);

  // Sync state with URL params
  useEffect(() => {
    const q = params.get('q');
    if (q !== null && q !== search) {
      setSearch(q);
    }
  }, [params, search]);

  // Sync URL params with state
  useEffect(() => {
    const nextParams = new URLSearchParams(params);
    if (debouncedSearch) {
      nextParams.set('q', debouncedSearch);
    } else {
      nextParams.delete('q');
    }
    if (nextParams.toString() !== params.toString()) {
      setParams(nextParams, { replace: true });
    }
  }, [debouncedSearch, params, setParams]);

  // Focus date picker if redirected with focus_dates param
  useEffect(() => {
    if (params.get('focus_dates') === 'true') {
      setTimeout(() => {
        const element = document.getElementById('date-picker-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const buttons = element.querySelectorAll('button[type="button"]');
          const targetBtn = pickupDate ? buttons[1] : buttons[0];
          if (targetBtn) (targetBtn as HTMLButtonElement).click();
        }
      }, 300);
      const nextParams = new URLSearchParams(params);
      nextParams.delete('focus_dates');
      setParams(nextParams, { replace: true });
    }
  }, [params, setParams, pickupDate]);

  const CACHE_KEY = 'category_products';

  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  // Hydrate from cache immediately on mount
  const initialCached = useRef(sessionCache.get<any[]>(CACHE_KEY));
  const [products, setProducts] = useState<any[]>(initialCached.current || []);
  const [loading, setLoading] = useState(!initialCached.current);

  const doFetch = useCallback(async () => {
    const { data } = await axiosInstance.get('/products', {
      params: {
        category: activeCategory,
        brand: activeBrand,
        search: debouncedSearch,
        limit: itemsToShow,
        ...(pickupDate && dropDate ? {
          pickup_date: format(pickupDate, 'yyyy-MM-dd'),
          drop_date: format(dropDate, 'yyyy-MM-dd'),
        } : {})
      }
    });
    const mappedProducts = (data.items || []).map((p: any) => ({
      ...p,
      images: (p.images || []).map((url: string, i: number) => ({
        id: String(i),
        image_url: url,
        display_order: i
      }))
    }));
    setProducts(mappedProducts);
    sessionCache.set(CACHE_KEY, mappedProducts);
    retryCountRef.current = 0; // reset on success
  }, [activeCategory, activeBrand, debouncedSearch, itemsToShow, pickupDate, dropDate]);

  const refresh = useCallback(async () => {
    // Clear any pending retry
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    retryCountRef.current = 0;

    // Only show loading if no cached data
    const hasCached = !!sessionCache.get<any[]>(CACHE_KEY);
    if (!hasCached) {
      setLoading(true);
    }

    const attempt = async () => {
      try {
        await doFetch();
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch category products:', err);
        retryCountRef.current++;

        // If we have cached data, show it immediately and keep retrying
        const cached = sessionCache.get<any[]>(CACHE_KEY);
        if (cached) {
          setProducts(cached);
          setLoading(false);
          // Retry in background regardless of count — cache keeps UI alive
          retryTimerRef.current = setTimeout(attempt, 2000);
          return;
        }

        // No cached data: give up after 3 attempts (~6s), don't keep user waiting
        if (retryCountRef.current >= 3) {
          setLoading(false);
          return;
        }

        retryTimerRef.current = setTimeout(attempt, 2000);
      }
    };

    await attempt();
  }, [doFetch]);

  const pullDistance = usePullToRefresh(refresh);

  useEffect(() => {
    refresh();
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [activeCategory, activeBrand, debouncedSearch, itemsToShow, pickupDate, dropDate]);

  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  const handleFilterSelect = (type: 'category' | 'brand', value: string) => {
    const nextParams = new URLSearchParams(params);
    if (value === 'All') {
      nextParams.delete(type);
    } else {
      nextParams.set(type, value);
    }
    setParams(nextParams);
  };

  return (
    <div className="min-h-screen">
      <CategoryHeader
        pullDistance={pullDistance}
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeCategory={activeCategory}
        activeBrand={activeBrand}
        onSelectFilter={handleFilterSelect}
        pickupDate={pickupDate}
        dropDate={dropDate}
        setPickupDate={setPickupDate}
        setDropDate={setDropDate}
      />
      <div className="app-shell mt-4 md:mt-6">
        <CategoryProducts
          loading={loading}
          filteredProducts={products}
          itemsToShow={itemsToShow}
          setItemsToShow={setItemsToShow}
        />
      </div>
      {!isDesktop && (
        <MobileFilters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeCategory={activeCategory}
          activeBrand={activeBrand}
          onSelectFilter={handleFilterSelect}
        />
      )}
      <div className="mt-12 md:mt-18">
        <Footer />
      </div>
    </div>
  );
};

export default Category;