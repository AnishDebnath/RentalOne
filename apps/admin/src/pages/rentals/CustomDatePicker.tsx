import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  selectedDate: string;
  onChange: (date: string) => void;
};

export default function CustomDatePicker({ selectedDate, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // View date tracks which month/year the calendar is currently showing
  const [viewDate, setViewDate] = useState(() => new Date(selectedDate));

  // Sync view date with selected date when opened
  useEffect(() => {
    if (isOpen) {
      setViewDate(new Date(selectedDate));
    }
  }, [isOpen, selectedDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isToday = (d: number) => {
    const today = new Date();
    return today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelected = (d: number) => {
    const sDate = new Date(selectedDate);
    return sDate.getDate() === d && sDate.getMonth() === month && sDate.getFullYear() === year;
  };

  const selectDate = (d: number) => {
    const newDate = new Date(year, month, d);
    onChange(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
          isOpen ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-white border-line text-ink hover:border-line/80 shadow-sm'
        }`}
      >
        <CalendarIcon className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-3 p-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-line z-[100] w-[280px]"
          >
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1.5 hover:bg-slate-50 rounded-lg text-muted transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-black text-ink">{monthName} {year}</span>
              <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1.5 hover:bg-slate-50 rounded-lg text-muted transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-[9px] font-black uppercase tracking-wider text-tertiary">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((d, i) => (
                <div key={i} className="aspect-square flex items-center justify-center p-0.5">
                  {d && (
                    <button
                      onClick={() => selectDate(d)}
                      className={`w-full h-full rounded-full text-xs font-bold transition-all ${
                        isSelected(d) ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110' :
                        isToday(d) ? 'bg-primary/10 text-primary' :
                        'text-ink hover:bg-slate-50 hover:scale-110'
                      }`}
                    >
                      {d}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
