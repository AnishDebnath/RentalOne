import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type Option = {
  category: string;
  image: string;
};

type CustomSelectProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
};

const CustomSelect = ({ label, options, value, onChange, placeholder, required }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.category === value);

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
    <div className="block space-y-2" ref={containerRef}>
      <span className="text-base font-semibold text-ink">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'input-shell w-full flex items-center justify-between transition-all',
            isOpen && 'border-primary ring-4 ring-primary/10'
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {selectedOption ? (
              <>
                <img src={selectedOption.image} alt="" className="h-6 w-6 rounded-md object-contain bg-slate-50 border border-line p-0.5" />
                <span className="truncate text-base font-bold text-ink">{selectedOption.category}</span>
              </>
            ) : (
              <span className="text-base text-muted">{placeholder || 'Select...'}</span>
            )}
          </div>
          <ChevronDown className={clsx('h-4 w-4 text-muted transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-card border border-white bg-white/90 p-1 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            {options.map((option) => (
              <button
                key={option.category}
                type="button"
                onClick={() => {
                  onChange(option.category);
                  setIsOpen(false);
                }}
                className={clsx(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                  value === option.category ? 'bg-primary/5 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
                )}
              >
                <img src={option.image} alt="" className="h-8 w-8 rounded-lg object-contain bg-white border border-line p-1" />
                <span className="text-base font-bold">{option.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
