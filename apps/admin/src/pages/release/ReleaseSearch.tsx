import { Search, ScanLine, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  searchId: string;
  setSearchId: (v: string) => void;
  onSearch: () => void;
  error: string | null;
}

const ReleaseSearch = ({ searchId, setSearchId, onSearch, error }: Props) => (
  <motion.div
    key="search"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex min-h-[70vh] flex-col items-center justify-center text-center"
  >
    <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-primary shadow-card border border-line">
      <span className="relative">
        <ScanLine className="h-10 w-10" />
        <motion.div
          className="absolute inset-x-0 top-1/2 h-0.5 bg-primary/40"
          animate={{ top: ['20%', '80%', '20%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </span>
    </div>

    <h2 className="text-xl font-bold tracking-tight text-ink">Search Rental Record</h2>
    <p className="mt-1.5 text-xs font-medium text-muted sm:text-sm">
      Enter Rental ID to begin the verification process.
    </p>

    <div className="mt-10 w-full max-w-lg space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Rental ID (e.g. RN-F2FB3)"
            value={searchId}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              if (val.length <= 8) setSearchId(val);
            }}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-sm font-medium shadow-sm outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 placeholder:text-muted/50"
          />
        </div>
        <button
          onClick={onSearch}
          className="h-12 w-full shrink-0 rounded-xl bg-ink px-6 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-900 active:scale-95 sm:w-auto"
        >
          View Details
        </button>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex max-w-full items-start justify-center gap-2.5 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-left text-xs font-black tracking-wider text-rose-600 shadow-sm"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
          <span className="leading-normal">{error}</span>
        </motion.div>
      )}
    </div>
  </motion.div>
);

export default ReleaseSearch;
