import { useState } from 'react';
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
  parseISO,
  isWithinInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useCart } from '../../store/CartContext';

interface BookedRange {
  pickup_date: string;
  event_date: string;
}

interface ProductBookedCalendarProps {
  bookedRanges: BookedRange[];
}

const ProductBookedCalendar = ({ bookedRanges = [] }: ProductBookedCalendarProps) => {
  const { pickupDate, dropDate } = useCart();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const checkIsBooked = (day: Date) => {
    const target = startOfDay(day);
    return bookedRanges.some(range => {
      try {
        const start = startOfDay(parseISO(range.pickup_date));
        const end = startOfDay(parseISO(range.event_date));
        return target >= start && target <= end;
      } catch (e) {
        return false;
      }
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 pb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4.5 w-4.5 text-primary" />
          <h3 className="text-xs font-black text-ink uppercase tracking-[0.15em]">Availability</h3>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</span>
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-line hover:border-primary/30 hover:text-primary transition-all active:scale-95 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-line hover:border-primary/30 hover:text-primary transition-all active:scale-95 shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (
      <div className="grid grid-cols-7 mb-2 border-b border-line/10 pb-1.5">
        {days.map((day, idx) => (
          <div key={`${day}-${idx}`} className="text-center text-[9px] font-black text-muted uppercase tracking-widest opacity-40">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isPast = isBefore(day, today);
        const isToday = isSameDay(day, today);
        const isBooked = isCurrentMonth && !isPast && checkIsBooked(day);

        const isPickup = pickupDate && isSameDay(day, pickupDate);
        const isDrop = dropDate && isSameDay(day, dropDate);
        const isSelected = isCurrentMonth && !isPast && (isPickup || isDrop);
        const isInRange = isCurrentMonth && !isPast && pickupDate && dropDate && isWithinInterval(day, { start: pickupDate, end: dropDate });

        const cellClasses = `
          relative flex h-9 items-center justify-center text-xs font-bold transition-all rounded-xl border
          ${!isCurrentMonth ? 'text-muted/20 border-transparent pointer-events-none' : ''}
          ${isPast && isCurrentMonth ? 'text-slate-300 border-transparent bg-slate-50/50 cursor-not-allowed opacity-40' : ''}
          ${isCurrentMonth && !isPast && !isBooked && !isSelected && !isInRange ? 'bg-white/40 text-ink border-line/20 hover:border-primary/30 hover:bg-white shadow-sm' : ''}
          ${isCurrentMonth && !isPast && !isBooked && isSelected ? 'bg-primary text-white border-primary z-10 scale-105 shadow-sm shadow-primary/20' : ''}
          ${isCurrentMonth && !isPast && !isBooked && isInRange && !isSelected ? 'bg-primary/10 text-primary border-primary/20' : ''}
          ${isBooked ? 'bg-amber-500/10 text-amber-600 border-amber-500/25 shadow-sm shadow-amber-500/5' : ''}
          ${isToday && !isBooked && !isSelected ? 'ring-2 ring-primary/20 border-primary/20' : ''}
        `.replace(/\s+/g, ' ').trim();

        days.push(
          <div key={day.toString()} className="p-0.5">
            <div className={cellClasses}>
              <span className="relative z-10">{formattedDate}</span>
              {isBooked && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
              )}
              {isToday && !isBooked && !isSelected && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-0" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-0">{rows}</div>;
  };

  return (
    <div className="p-5 rounded-3xl bg-white/40 border border-white shadow-sm backdrop-blur-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 border-t border-line/10 pt-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-md bg-white border border-line/40 shadow-sm" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">Available</span>
        </div>
        {pickupDate && dropDate && (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-md bg-primary border border-primary shadow-sm" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Your Selection</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-amber-500" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">Booked / Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default ProductBookedCalendar;
