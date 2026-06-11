import { Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSelect from '../../components/ui/FilterSelect';

type ProductFiltersProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryOptions: any[];
  brandOptions: any[];
  statusOptions: any[];
};

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  isExpanded,
  setIsExpanded,
  categoryFilter,
  setCategoryFilter,
  brandFilter,
  setBrandFilter,
  statusFilter,
  setStatusFilter,
  categoryOptions,
  brandOptions,
  statusOptions,
}: ProductFiltersProps) => {
  return (
    <section className="card-surface p-4">
      <div className="flex items-center gap-3 sm:max-w-4xl">
        <label className="input-shell min-h-11 flex-1 sm:max-w-xl">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products or codes..."
            className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
          />
        </label>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border p-1 pr-1 transition-all sm:pr-3 ${showFilters
            ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500/20'
            : 'border-line bg-slate-50/50 hover:bg-slate-100'
            }`}
        >
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm border transition-all ${showFilters
            ? 'bg-sky-500 text-white border-sky-500'
            : 'bg-white text-sky-500 border-line/40'
            }`}>
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
          <span className={`hidden text-[10px] font-black uppercase tracking-widest sm:inline ${showFilters ? 'text-sky-600' : 'text-tertiary'
            }`}>
            {showFilters ? 'Hide Filters' : 'Filters'}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: showFilters ? 'auto' : 0,
              opacity: showFilters ? 1 : 0
            }}
            onAnimationComplete={() => setIsExpanded(showFilters)}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={isExpanded ? 'relative z-[70]' : 'overflow-hidden relative z-[70]'}
          >
            <div className="mt-4 flex flex-col md:flex-row md:flex-wrap items-stretch md:items-end gap-3 border-t border-line/50 pt-4 sm:max-w-4xl">
              <div className="flex flex-col gap-1.5 w-full md:w-44">
                <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary px-1">Category</span>
                <FilterSelect
                  options={categoryOptions}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-44">
                <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary px-1">Brand</span>
                <FilterSelect
                  options={brandOptions}
                  value={brandFilter}
                  onChange={setBrandFilter}
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-44">
                <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary px-1">Availability</span>
                <FilterSelect
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('All');
                  setBrandFilter('All');
                  setStatusFilter('all');
                }}
                className="h-9 px-4 text-xs font-bold text-muted hover:text-danger transition md:mb-0"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductFilters;
