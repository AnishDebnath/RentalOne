import React from 'react';
import { Users, Minus, Plus } from 'lucide-react';

interface ManpowerSelectionProps {
  assistantCount: number;
  setAssistantCount: (count: number) => void;
}

export const ManpowerSelection = ({ assistantCount, setAssistantCount }: ManpowerSelectionProps) => {
  const handleDecrement = () => {
    if (assistantCount > 0) {
      setAssistantCount(assistantCount - 1);
    }
  };

  const handleIncrement = () => {
    if (assistantCount < 10) {
      setAssistantCount(assistantCount + 1);
    }
  };

  return (
    <section className="card-surface p-6 relative">
      <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 border border-indigo-100/50 shadow-sm">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-ink leading-none">Assistant Crew</h2>
            <p className="text-[10px] font-bold text-muted uppercase mt-1.5">Number of crew persons needed</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4 bg-slate-50 border border-line p-2 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={assistantCount === 0}
            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all bg-white border border-line shadow-sm active:scale-95
              ${assistantCount === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 text-ink'}
            `}
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="w-16 text-center">
            <span className="text-base font-black text-ink">{assistantCount}</span>
            <p className="text-[9px] font-bold text-muted uppercase tracking-wider leading-none mt-0.5">
              {assistantCount === 1 ? 'Person' : 'People'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={assistantCount === 10}
            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all bg-white border border-line shadow-sm active:scale-95
              ${assistantCount === 10 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 text-ink'}
            `}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
