import { useState, useEffect, useRef, Fragment } from 'react';
import SearchBar from '../../components/ui/SearchBar';
import { X } from 'lucide-react';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import FilterChips from './FilterChips';
import { useLenis } from '@camera-rental-house/ui';
import DateRangePicker from './DateRangePicker';

interface CategoryHeaderProps {
  pullDistance: number;
  search: string;
  setSearch: (val: string) => void;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  activeCategory: string;
  activeBrand: string;
  onSelectFilter: (type: 'category' | 'brand', value: string) => void;
  pickupDate: Date | null;
  dropDate: Date | null;
  setPickupDate: (date: Date | null) => void;
  setDropDate: (date: Date | null) => void;
}

const CategoryHeader = ({
  search,
  setSearch,
  showFilters,
  setShowFilters,
  activeCategory,
  activeBrand,
  onSelectFilter,
  pickupDate,
  dropDate,
  setPickupDate,
  setDropDate,
}: CategoryHeaderProps) => {
  const [isFixed, setIsFixed] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Measure bar height for the placeholder
  useEffect(() => {
    if (barRef.current) {
      setBarHeight(barRef.current.offsetHeight);
    }
  }, []);

  // IntersectionObserver for sticky bar
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFixed(!entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: '0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const lenis = useLenis();

  // Scroll lock for desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    // Only apply scroll lock on desktop if filters are shown
    if (isDesktop && showFilters) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [showFilters, lenis]);

  // Click outside listener
  useEffect(() => {
    if (!showFilters) return;
    const handleClickOutside = (e: MouseEvent) => {
      // If we're on mobile, let Dialog handle it. On desktop, we handle it here.
      if (window.innerWidth < 1024) return;
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [showFilters, setShowFilters]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 0 }} />
      {isFixed && <div style={{ height: barHeight }} aria-hidden="true" />}

      {/* Desktop Backdrop Animation - Moved outside to blur whole background */}
      <div
        className={clsx(
          "hidden lg:block fixed inset-0 bg-slate-900/30 backdrop-blur-sm pointer-events-none z-[190] transition-opacity duration-500",
          showFilters ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />

      <div
        ref={barRef}
        className={clsx(
          'w-full z-[200] transition-all duration-500',
          isFixed
            ? showFilters 
              ? 'fixed top-0 left-0 right-0 py-3' 
              : 'fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-[40px] border-b border-white/60 shadow-[0_10px_40px_rgba(31,_38,_135,_0.05)] py-3'
            : 'relative bg-transparent pb-2'
        )}
      >
        <div
          className={clsx(
            'absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none transition-opacity duration-500',
            isFixed && !showFilters ? 'opacity-100' : 'opacity-0'
          )}
        />

        <div ref={filterPanelRef} className="relative app-shell">

          <SearchBar
            value={search}
            onChange={setSearch}
            isFilterOpen={showFilters}
            onFilterClick={() => {
              setShowFilters(!showFilters);
            }}
          />

          {/* Date Range Picker */}
          <div id="date-picker-section" className="mt-2.5">
            <DateRangePicker
              pickupDate={pickupDate}
              dropDate={dropDate}
              onPickupChange={setPickupDate}
              onDropChange={setDropDate}
            />
          </div>

          {/* Desktop Filters Dropdown Overlay */}
          <div className={clsx(
            "hidden lg:block absolute top-full left-4 md:left-6 lg:left-8 right-4 md:right-6 lg:right-8 z-[201] transition-all duration-500 ease-out",
            showFilters ? "translate-y-4 opacity-100 pointer-events-auto" : "translate-y-0 opacity-0 pointer-events-none"
          )}>
            <div className="p-5 md:p-6 rounded-[32px] bg-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] border border-slate-100 relative overflow-hidden">
              <div className="relative">
                <div className="mb-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-ink">Filter Gears</h3>
                    <p className="text-sm text-muted">Choose the category or brand you need.</p>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-page hover:bg-slate-200 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FilterChips
                  activeCategory={activeCategory}
                  activeBrand={activeBrand}
                  onSelect={onSelectFilter}
                  isDark={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryHeader;