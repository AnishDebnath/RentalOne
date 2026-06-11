import { useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import FilterChips from './FilterChips';
import { useLenis } from '@camera-rental-house/ui';

interface MobileFiltersProps {
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  activeCategory: string;
  activeBrand: string;
  onSelectFilter: (type: 'category' | 'brand', value: string) => void;
}

const MobileFilters = ({ showFilters, setShowFilters, activeCategory, activeBrand, onSelectFilter }: MobileFiltersProps) => {
  const lenis = useLenis();

  // Lock scroll (Lenis + native) when mobile filter sheet is open
  useEffect(() => {
    if (showFilters) {
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

  return (
    <Transition.Root show={showFilters} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={setShowFilters}>
        {/* Backdrop Animation */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-x-0 bottom-0 flex max-h-full">
              {/* Sheet Animation */}
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-500"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in duration-300"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="pointer-events-auto w-full max-w-full">
                  <div className="rounded-t-[32px] bg-white p-5 shadow-2xl ring-1 ring-black/5">
                    {/* Refined Drag Handle Indicator */}
                    <div className="flex justify-center pt-2 pb-4">
                      <div className="w-14 h-1 rounded-full bg-primary/20 ring-1 ring-primary/10" />
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xl md:text-2xl font-bold text-ink leading-none">Filter Gears</p>
                        <p className="text-xs text-muted mt-1">Choose the category or brand you need.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowFilters(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-page active:scale-95 transition-transform"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>
                    <FilterChips
                      activeCategory={activeCategory}
                      activeBrand={activeBrand}
                      onSelect={(type, value) => {
                        onSelectFilter(type, value);
                      }}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MobileFilters;
