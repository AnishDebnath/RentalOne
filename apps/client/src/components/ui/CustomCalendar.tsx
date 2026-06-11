import { useState, useMemo } from 'react';
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
  isWithinInterval,
  isBefore,
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CustomCalendarProps {
  pickupDate: Date | null;
  dropDate: Date | null;
  onDateClick: (date: Date) => void;
  readOnly?: boolean;
}

const CustomCalendar = ({ pickupDate, dropDate, onDateClick, readOnly = false }: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-2 pb-6">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-ink uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-line hover:border-primary/30 hover:text-primary transition-all duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-line hover:border-primary/30 hover:text-primary transition-all duration-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (
      <div className="grid grid-cols-7 mb-4 border-b border-line/10 pb-2">
        {days.map((day, idx) => (
          <div key={`${day}-${idx}`} className="text-center text-[10px] font-bold text-muted uppercase tracking-widest opacity-40">
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
    const today = startOfDay(new Date());

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;

        const isPickup = pickupDate && isSameDay(day, pickupDate);
        const isDrop = dropDate && isSameDay(day, dropDate);
        const isSelected = isPickup || isDrop;
        const isInRange = pickupDate && dropDate && isWithinInterval(day, { start: pickupDate, end: dropDate });
        const isDisabled = isBefore(day, today);
        const isCurrentMonth = isSameMonth(day, monthStart);

        const isToday = isSameDay(day, today);


        const cellClasses = `
          relative flex h-11 md:h-12 items-center justify-center text-sm font-semibold transition-all
          ${!isCurrentMonth ? 'text-muted/20' : 'text-ink'}
          ${isSelected ? 'bg-primary text-white z-10 rounded-xl scale-105 shadow-sm shadow-primary/20' : ''}
          ${isInRange && !isSelected ? 'bg-primary/10 text-primary rounded-xl' : ''}
          ${isDisabled ? 'cursor-not-allowed opacity-10' : readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-105 active:scale-95'}
          ${!isSelected && !isDisabled && !readOnly ? 'hover:bg-page rounded-xl' : ''}
          ${isToday && !isSelected ? 'ring-2 ring-primary/20 rounded-xl' : ''}
        `.replace(/\s+/g, ' ').trim();

        days.push(
          <div
            key={day.toString()}
            className={cellClasses}
            onClick={() => !isDisabled && !readOnly && onDateClick(cloneDay)}
          >
            <span className="relative z-10">{formattedDate}</span>
            {isToday && !isSelected && (
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
            {isInRange && (
              <div className={`absolute inset-0 bg-primary/5 -z-0 ${isPickup ? 'rounded-l-2xl' : isDrop ? 'rounded-r-2xl' : ''}`} />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-0.5" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-0.5">{rows}</div>;
  };

  return (
    <div className="p-6 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white shadow-xl shadow-black/5 w-full">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1 opacity-60">Pickup Date</p>
          <div className="flex h-14 items-center rounded-2xl bg-white border border-line/40 shadow-sm px-4 gap-4 transition-all duration-300 hover:border-primary/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted uppercase tracking-tight leading-none mb-1">Select Start</span>
              <span className="text-sm font-bold text-ink">
                {pickupDate ? format(pickupDate, 'MMM dd, yyyy') : 'Pick a date'}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1 opacity-60">Return Date</p>
          <div className="flex h-14 items-center rounded-2xl bg-white border border-line/40 shadow-sm px-4 gap-4 transition-all duration-300 hover:border-primary/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted uppercase tracking-tight leading-none mb-1">Select End</span>
              <span className="text-sm font-bold text-ink">
                {dropDate ? format(dropDate, 'MMM dd, yyyy') : 'Pick a date'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
