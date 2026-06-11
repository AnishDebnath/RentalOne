import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ArrowRight, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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
  differenceInCalendarDays,
} from 'date-fns';

interface DateRangePickerProps {
  pickupDate: Date | null;
  dropDate: Date | null;
  onPickupChange: (date: Date | null) => void;
  onDropChange: (date: Date | null) => void;
}

export default function DateRangePicker({
  pickupDate,
  dropDate,
  onPickupChange,
  onDropChange,
}: DateRangePickerProps) {
  const today = startOfDay(new Date());
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showDropPicker, setShowDropPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(e.target as Node)) {
        setShowPickupPicker(false);
      }
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShowDropPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days =
    pickupDate && dropDate
      ? Math.abs(differenceInCalendarDays(dropDate, pickupDate)) + 1
      : 0;

  const renderHeader = (month: Date, setMonth: (d: Date) => void) => (
    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50">
      <button
        type="button"
        onClick={() => setMonth(subMonths(month, 1))}
        className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm active:scale-95"
      >
        <ChevronLeft className="h-4 w-4 text-slate-400" />
      </button>
      <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-700">
        {format(month, 'MMMM yyyy')}
      </span>
      <button
        type="button"
        onClick={() => setMonth(addMonths(month, 1))}
        className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm active:scale-95"
      >
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </button>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 px-2 pt-2">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
        <div key={`${d}-${i}`} className="text-[9px] font-black uppercase text-slate-400 text-center py-1">
          {d}
        </div>
      ))}
    </div>
  );

  const renderCells = (
    month: Date,
    selectedDate: Date | null,
    onSelect: (d: Date) => void,
    minDate?: Date
  ) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDateView = startOfWeek(monthStart);
    const endDateView = endOfWeek(monthEnd);

    const rows: React.ReactNode[] = [];
    let dayCells: React.ReactNode[] = [];
    let day = startDateView;
    const limit = minDate ? startOfDay(minDate) : today;

    while (day <= endDateView) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isDisabled = isBefore(day, limit);
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isInRange =
          pickupDate && dropDate
            ? !isBefore(day, pickupDate) && !isBefore(dropDate, day)
            : false;

        dayCells.push(
          <div key={day.toString()} className="flex items-center justify-center p-0.5">
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(startOfDay(cloneDay))}
              className={`h-9 w-9 md:h-8 md:w-8 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center relative group/cell
                ${!isSameMonth(day, monthStart) ? 'text-slate-200' : isDisabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-primary/5 hover:text-primary'}
                ${isSelected ? 'bg-primary text-white hover:bg-primary hover:text-white shadow-md shadow-primary/20' : ''}
                ${isInRange && !isSelected ? 'bg-primary/8 text-primary' : ''}
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
          {dayCells}
        </div>
      );
      dayCells = [];
    }
    return <div className="pb-2 pt-1">{rows}</div>;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 w-full">
      <div className="flex items-end gap-2 w-full sm:w-auto">
        {/* Pickup Date */}
        <div className="flex-1 sm:flex-none sm:w-[160px] space-y-1.5 relative" ref={pickupRef}>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Pick-up Date
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowPickupPicker(p => !p);
                setShowDropPicker(false);
              }}
              className={`w-full h-10 pl-9 pr-3 rounded-xl border transition-all flex items-center text-left text-xs font-bold shadow-sm
                ${showPickupPicker
                  ? 'border-amber-500 ring-4 ring-amber-500/10 bg-white text-slate-800'
                  : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                }`}
            >
              <CalendarIcon className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${showPickupPicker ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="truncate">
                {pickupDate ? format(pickupDate, 'MMM d, yyyy') : <span className="text-slate-400 font-medium">Select...</span>}
              </span>
            </button>
 
            {showPickupPicker && (
              <div className="absolute z-[110] left-0 top-full mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-1 w-[260px] sm:w-[280px] origin-top-left">
                {renderHeader(currentMonth, setCurrentMonth)}
                {renderDays()}
                {renderCells(currentMonth, pickupDate, (d) => {
                  onPickupChange(d);
                  setShowPickupPicker(false);
                  if (dropDate && isBefore(dropDate, d)) {
                    onDropChange(null);
                  }
                })}
              </div>
            )}
          </div>
        </div>
 
        {/* Arrow (Aligned to center of 40px input -> mb-[6px]) */}
        <div className="shrink-0 flex items-center justify-center mb-[6px]">
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner border border-white">
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
 
        {/* Return Date */}
        <div className="flex-1 sm:flex-none sm:w-[160px] space-y-1.5 relative" ref={dropRef}>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Return Date
          </label>
          <div className="relative">
            <button
              type="button"
              disabled={!pickupDate}
              onClick={() => {
                setShowDropPicker(p => !p);
                setShowPickupPicker(false);
              }}
              className={`w-full h-10 pl-9 pr-3 rounded-xl border transition-all flex items-center text-left text-xs font-bold shadow-sm
                ${!pickupDate
                  ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50/50'
                  : showDropPicker
                    ? 'border-amber-500 ring-4 ring-amber-500/10 bg-white text-slate-800'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                }`}
            >
              <CalendarIcon className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${showDropPicker ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="truncate">
                {dropDate ? format(dropDate, 'MMM d, yyyy') : <span className="text-slate-400 font-medium">Select...</span>}
              </span>
            </button>

            {showDropPicker && (
              <div className="absolute z-[110] right-0 sm:left-0 top-full mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-1 w-[260px] sm:w-[280px] origin-top-left sm:origin-top-right">
                {renderHeader(currentMonth, setCurrentMonth)}
                {renderDays()}
                {renderCells(currentMonth, dropDate, (d) => {
                  onDropChange(d);
                  setShowDropPicker(false);
                }, pickupDate ?? undefined)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Duration + Clear Inline */}
      {days > 0 && (
        <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto mt-3 sm:mt-0 sm:ml-2">
          <div className="flex items-center gap-1.5 px-3 h-10 rounded-xl bg-primary/5 border border-primary/15 text-primary shadow-sm">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider leading-none mt-[1px]">
              Rental Duration: <span className="ml-0.5">{days} {days === 1 ? 'Day' : 'Days'}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => { onPickupChange(null); onDropChange(null); }}
            className="text-[10px] font-bold text-slate-400 hover:text-danger transition-colors ml-3"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
