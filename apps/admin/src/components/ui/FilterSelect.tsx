import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type Option = {
  label: string;
  value: string;
  image?: string;
  icon?: React.ReactNode;
};

type FilterSelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const FilterSelect = ({ options, value, onChange, placeholder }: FilterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'input-shell h-9 w-full min-w-[110px] flex items-center justify-between gap-2 px-3 transition-all bg-white/[0.78]',
          isOpen && 'border-primary ring-4 ring-primary/10'
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption ? (
            <>
              {selectedOption.image ? (
                <img src={selectedOption.image} alt="" className="h-6 w-6 rounded-md object-contain bg-slate-50 border border-line/60 p-0.5" />
              ) : selectedOption.icon ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-50 border border-line/60">
                  {selectedOption.icon}
                </div>
              ) : null}
              <span className="truncate text-xs font-bold text-ink">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-xs font-bold text-muted">{placeholder || 'Select...'}</span>
          )}
        </div>
        <ChevronDown className={clsx('h-3.5 w-3.5 text-muted transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-[110] mt-2 w-full max-h-60 overflow-y-auto rounded-card border border-line bg-white p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={clsx(
                'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors',
                value === option.value ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
              )}
            >
              {option.image ? (
                <img src={option.image} alt="" className="h-7 w-7 rounded-md object-contain bg-slate-50 border border-line/60 p-1" />
              ) : option.icon ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 border border-line/60">
                  {option.icon}
                </div>
              ) : (
                <div className="h-7 w-7 flex items-center justify-center rounded-md bg-slate-100 border border-line/60 text-[10px] font-bold text-muted uppercase">
                  All
                </div>
              )}
              <span className="text-xs font-bold">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSelect;
