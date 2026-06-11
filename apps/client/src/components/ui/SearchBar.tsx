import { Search, SlidersHorizontal } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';
import clsx from 'clsx';

const SearchBar = ({ value, onChange, onFilterClick, isFilterOpen = false }) => {
  const placeholderText = useTypewriter();

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 flex items-center relative group">
        <div className="absolute left-4 z-10">
          <Search className="h-4.5 w-4.5 text-muted group-focus-within:text-primary transition-colors" />
        </div>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholderText}
          className={clsx(
            "w-full h-12 pl-12 pr-4 rounded-2xl border transition-all outline-none truncate placeholder:text-muted/60 text-sm font-medium",
            isFilterOpen
              ? "bg-white border-slate-200 shadow-xl focus:border-primary/10 focus:ring-4 focus:ring-primary/10"
              : "border-white/60 bg-white/40 ring-1 ring-black/[0.03] backdrop-blur-md focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 hover:border-primary/20"
          )}
        />
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        className={clsx(
          "flex shrink-0 h-12 w-12 items-center justify-center rounded-xl transition-all border active:scale-95",
          isFilterOpen
            ? "bg-primary text-white border-primary shadow-lg"
            : "bg-primary/10 text-primary hover:bg-primary/20 border-white/40"
        )}
      >
        <SlidersHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
};


export default SearchBar;
