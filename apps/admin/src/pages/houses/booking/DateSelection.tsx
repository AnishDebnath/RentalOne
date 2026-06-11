import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfDay,
  parseISO
} from 'date-fns';

interface DateSelectionProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  highlightTrigger?: number;
}

export const DateSelection = ({ startDate, setStartDate, endDate, setEndDate, highlightTrigger = 0 }: DateSelectionProps) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);

  const [highlightDates, setHighlightDates] = useState(false);
  const highlightTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (highlightTrigger && highlightTrigger > 0) {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      setHighlightDates(false);
      
      const t1 = setTimeout(() => {
        setHighlightDates(true);
        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightDates(false);
          highlightTimeoutRef.current = null;
        }, 2000);
      }, 0);

      return () => clearTimeout(t1);
    }
  }, [highlightTrigger]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startPickerRef.current && !startPickerRef.current.contains(event.target as Node)) {
        setShowStartPicker(false);
      }
      if (endPickerRef.current && !endPickerRef.current.contains(event.target as Node)) {
        setShowEndPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = startOfDay(parseISO(startDate));
    const end = startOfDay(parseISO(endDate));
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();

  const renderHeader = (month: Date, setMonth: (d: Date) => void) => (
    <div className="flex items-center justify-between px-3 py-2 border-b border-line/40 bg-slate-50/50">
      <button onClick={() => setMonth(subMonths(month, 1))} className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm active:scale-95">
        <ChevronLeft className="h-4 w-4 text-muted" />
      </button>
      <span className="text-[11px] font-black uppercase tracking-[0.1em] text-ink">{format(month, 'MMMM yyyy')}</span>
      <button onClick={() => setMonth(addMonths(month, 1))} className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm active:scale-95">
        <ChevronRight className="h-4 w-4 text-muted" />
      </button>
    </div>
  );

  const renderDays = () => {
    const daysArr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (
      <div className="grid grid-cols-7 px-2 pt-2">
        {daysArr.map((d, i) => (
          <div key={`${d}-${i}`} className="text-[9px] font-black uppercase text-muted/60 text-center py-1">{d}</div>
        ))}
      </div>
    );
  };

  const renderCells = (month: Date, selectedDate: string, onSelect: (d: string) => void, minDate?: string) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDateView = startOfWeek(monthStart);
    const endDateView = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDateView;
    let formattedDate = "";

    const today = startOfDay(new Date());
    const limit = minDate ? startOfDay(parseISO(minDate)) : today;

    while (day <= endDateView) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'yyyy-MM-dd');
        const cloneDay = day;
        const isDisabled = isBefore(day, limit);
        const isSelected = selectedDate === formattedDate;

        days.push(
          <div key={day.toString()} className="flex items-center justify-center p-0.5">
            <button
              disabled={isDisabled}
              onClick={() => {
                onSelect(format(cloneDay, 'yyyy-MM-dd'));
              }}
              className={`h-9 w-9 md:h-8 md:w-8 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center relative group/cell
                ${!isSameMonth(day, monthStart) ? 'text-slate-200' : isDisabled ? 'text-slate-300 cursor-not-allowed' : 'text-ink hover:bg-primary/5 hover:text-primary'}
                ${isSelected ? 'bg-primary text-white hover:bg-primary hover:text-white shadow-md shadow-primary/20' : ''}
              `}
            >
              <span>{format(day, 'd')}</span>
              {!isDisabled && !isSelected && isSameMonth(day, monthStart) && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/20 opacity-0 group-hover/cell:opacity-100 transition-opacity" />
              )}
            </button>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-0 px-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="pb-2 pt-1">{rows}</div>;
  };

  const highlightStart = highlightDates && !startDate;
  const highlightEnd = highlightDates && !!startDate && !endDate;

  return (
    <section id="date-picker-section" className="card-surface p-6 relative">
      <div className="flex items-center gap-3 pb-4 border-b border-line/50 mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 border border-emerald-100/50 shadow-sm">
          <CalendarIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-ink leading-none">Rental Period</h2>
          <p className="text-[10px] font-bold text-muted uppercase mt-1.5">Choose Booking Dates</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-5">
        {/* Start Date Picker */}
        <div className="w-full md:flex-1 space-y-2 relative" ref={startPickerRef}>
          <label className="text-[11px] font-black uppercase tracking-widest text-muted ml-1">Pick-up Date</label>
          <div className="relative">
            <button 
              onClick={() => {
                setShowStartPicker(!showStartPicker);
                setShowEndPicker(false);
              }}
              className={`w-full h-11 pl-12 pr-4 rounded-xl border transition-all flex items-center text-left text-sm font-bold shadow-sm
                ${highlightStart 
                  ? 'border-amber-500 ring-4 ring-amber-500/20 bg-white text-ink shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                  : showStartPicker 
                    ? 'border-primary ring-4 ring-primary/5 bg-white text-ink' 
                    : 'border-line bg-slate-50/50 text-ink hover:border-line-hover'
                }
              `}
            >
              <CalendarIcon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${highlightStart ? 'text-amber-500' : showStartPicker ? 'text-primary' : 'text-muted'}`} />
              {startDate ? format(parseISO(startDate), 'PPP') : <span className="text-muted/60 font-medium">Select date...</span>}
            </button>
            
            <AnimatePresence>
              {showStartPicker && (
                <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 8, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute z-[110] left-0 top-full mt-0 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-line p-1 w-full md:w-[280px] origin-top-left"
                >
                  {renderHeader(currentMonth, setCurrentMonth)}
                  {renderDays()}
                  {renderCells(currentMonth, startDate, (d) => {
                    setStartDate(d);
                    setShowStartPicker(false);
                    if (endDate && isBefore(parseISO(endDate), parseISO(d))) {
                      setEndDate('');
                    }
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-center md:pt-6">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-muted shadow-inner border border-white">
            <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
          </div>
        </div>

        {/* End Date Picker */}
        <div className="w-full md:flex-1 space-y-2 relative" ref={endPickerRef}>
          <label className="text-[11px] font-black uppercase tracking-widest text-muted ml-1">Return Date</label>
          <div className="relative">
            <button 
              disabled={!startDate}
              onClick={() => {
                setShowEndPicker(!showEndPicker);
                setShowStartPicker(false);
              }}
              className={`w-full h-11 pl-12 pr-4 rounded-xl border transition-all flex items-center text-left text-sm font-bold shadow-sm
                ${!startDate 
                  ? 'opacity-50 cursor-not-allowed border-line bg-slate-50/50' 
                  : highlightEnd 
                    ? 'border-amber-500 ring-4 ring-amber-500/20 bg-white text-ink shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                    : showEndPicker 
                      ? 'border-primary ring-4 ring-primary/5 bg-white text-ink' 
                      : 'border-line bg-slate-50/50 text-ink hover:border-line-hover'
                }
              `}
            >
              <CalendarIcon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${highlightEnd ? 'text-amber-500' : showEndPicker ? 'text-primary' : 'text-muted'}`} />
              {endDate ? format(parseISO(endDate), 'PPP') : <span className="text-muted/60 font-medium">Select date...</span>}
            </button>

            <AnimatePresence>
              {showEndPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute z-[110] right-0 md:left-0 top-full mt-0 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-line p-1 w-full md:w-[280px] origin-top-left"
                >
                  {renderHeader(currentMonth, setCurrentMonth)}
                  {renderDays()}
                  {renderCells(currentMonth, endDate, (d) => {
                    setEndDate(d);
                    setShowEndPicker(false);
                  }, startDate)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {days > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50/50 border border-emerald-100 text-emerald-600 shadow-sm">
            <Clock className="h-4 w-4" />
            <span className="text-[11px] font-black uppercase tracking-[0.15em]">Rental Duration: <span className="ml-1 text-emerald-700">{days} {days === 1 ? 'Day' : 'Days'}</span></span>
          </div>
          <button
            type="button"
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="text-[10px] font-black text-muted hover:text-danger transition-colors cursor-pointer uppercase tracking-[0.15em]"
          >
            Clear
          </button>
        </motion.div>
      )}
    </section>
  );
};
