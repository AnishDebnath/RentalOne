import React, { useState, useMemo } from 'react';
import { History, Search, ChevronRight, Calendar, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeImageUrl } from '@camera-rental-house/ui';

type UserRentalHistoryProps = {
  rentals: any[];
};

const UserRentalHistory = ({ rentals = [] }: UserRentalHistoryProps) => {
  const [rentalSearchTerm, setRentalSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const sortedRentals = useMemo(() => {
    let result = rentals;

    if (rentalSearchTerm) {
      const term = rentalSearchTerm.toLowerCase();
      result = result.filter((r: any) =>
        (r.rental_no || '').toLowerCase().includes(term) ||
        (r.products || []).some((p: any) => p.name.toLowerCase().includes(term))
      );
    }

    return [...result].sort((a: any, b: any) =>
      new Date(b.pickup_date).getTime() - new Date(a.pickup_date).getTime()
    );
  }, [rentals, rentalSearchTerm]);

  return (
    <section className="bg-white rounded-[1rem] border border-line shadow-sm p-0 overflow-hidden">
      <div className="p-5 md:p-6 border-b border-line/40 flex flex-col sm:flex-row sm:items-center justify-between bg-white gap-5">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center text-primary border border-slate-200/60 shadow-sm">
            <History className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-ink tracking-tight">Rental History</h2>
            <p className="text-[10px] font-bold text-muted uppercase">Complete record of user rentals</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted group-focus-within:text-primary transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="Search rentals..."
            value={rentalSearchTerm}
            onChange={(e) => setRentalSearchTerm(e.target.value)}
            className="h-10 w-full sm:w-72 lg:w-[400px] rounded-xl border border-line bg-slate-50/50 pl-10 pr-4 text-[13px] font-bold text-ink outline-none focus:border-primary/50 focus:bg-white focus:ring-[4px] focus:ring-primary/5 transition-all placeholder:text-muted/40"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px] table-fixed">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="w-[12%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted border-b border-line/40">Rental ID</th>
              <th className="w-[28%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted border-b border-line/40">Rental Period</th>
              <th className="w-[25%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted border-b border-line/40">Items</th>
              <th className="w-[15%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted border-b border-line/40 text-right">Amount</th>
              <th className="w-[14%] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted border-b border-line/40 text-center">Status</th>
              <th className="w-[6%] px-6 py-4 border-b border-line/40"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/40">
            {sortedRentals.length > 0 ? (
              sortedRentals.map((rental: any) => {
                const totalAmt =
                  rental.total_amount ||
                  (rental.products || []).reduce(
                    (sum: number, p: any) => sum + Number(p.price || 0) * Number(p.qty || 1),
                    0
                  );
                return (
                  <tr key={rental.id} className="group transition-colors border-b border-line/20">
                    <td colSpan={6} className="p-0">
                      <div
                        className={`flex items-center w-full group/row cursor-pointer transition-colors ${expandedOrderId === rental.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'
                          }`}
                        onClick={() => setExpandedOrderId(expandedOrderId === rental.id ? null : rental.id)}
                      >
                        <div className="w-[12%] px-6 py-5">
                          <span className="text-sm font-black tracking-tight text-ink">
                            {rental.rental_no || rental.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <div className="w-[28%] px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-muted uppercase tracking-tighter mb-0.5">
                                Pickup
                              </span>
                              <span className="text-sm font-bold text-ink/80 whitespace-nowrap">
                                {new Date(rental.pickup_date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="h-px w-4 bg-line/60 mt-4" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-muted uppercase tracking-tighter mb-0.5">
                                Return
                              </span>
                              <span className="text-sm font-bold text-ink/80 whitespace-nowrap">
                                {new Date(rental.return_date || rental.event_date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-[25%] px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-black leading-none truncate">
                              {rental.products?.[0]?.name || 'Gear Rental'}
                            </span>
                            <span className="text-[11px] font-bold text-muted uppercase tracking-widest">
                              {(rental.products || []).length} Items
                            </span>
                          </div>
                        </div>
                        <div className="w-[15%] px-6 py-5 text-right">
                          <span className="text-[15px] font-black text-ink tabular-nums">
                            ₹{Number(totalAmt).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-[14%] px-6 py-5">
                          <div className="flex justify-center">
                            {(rental.status.toLowerCase() === 'released' || rental.status.toLowerCase() === 'active') && new Date().setHours(0, 0, 0, 0) > new Date(rental.event_date).setHours(0, 0, 0, 0) ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border bg-red-50 text-red-600 border-red-100">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                Overdue
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border
                                ${rental.status.toLowerCase() === 'returned'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : (rental.status.toLowerCase() === 'released' || rental.status.toLowerCase() === 'active')
                                      ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                      : rental.status.toLowerCase() === 'cancelled'
                                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                  }
                              `}
                              >
                                <div
                                  className={`h-1.5 w-1.5 rounded-full ${rental.status.toLowerCase() === 'returned'
                                    ? 'bg-emerald-500'
                                    : (rental.status.toLowerCase() === 'released' || rental.status.toLowerCase() === 'active')
                                      ? 'bg-indigo-500 animate-pulse'
                                      : rental.status.toLowerCase() === 'cancelled'
                                        ? 'bg-slate-400'
                                        : 'bg-amber-400'
                                    }`}
                                />
                                {rental.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-[6%] px-6 py-5 text-center">
                          <ChevronRight
                            className={`h-5 w-5 text-muted transition-transform duration-300 ${expandedOrderId === rental.id ? 'rotate-90 text-primary' : ''
                              }`}
                          />
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {expandedOrderId === rental.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden bg-slate-50/40 border-t border-line/30"
                          >
                            <div className="px-6 py-5">
                              <div className="bg-white rounded-xl border border-line/60 shadow-sm overflow-hidden">
                                <div className="bg-slate-50/50 px-4 py-2 border-b border-line/40 flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                                    Detailed Items
                                  </span>
                                  <span className="text-[10px] font-bold text-primary uppercase">
                                    {(rental.products || []).length} Items
                                  </span>
                                </div>
                                <div className="divide-y divide-line/40">
                                  {(rental.products || []).map((item: any, idx: number) => {
                                    const days =
                                      Math.round(
                                        (new Date(rental.return_date || rental.event_date).getTime() -
                                          new Date(rental.pickup_date).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                      ) + 1 || 1;
                                    return (
                                      <div
                                        key={idx}
                                        className="px-4 py-3.5 flex items-center gap-4 hover:bg-slate-50/30 transition-colors"
                                      >
                                        {item.image ? (
                                          <img
                                            src={optimizeImageUrl(item.image)}
                                            alt={item.name}
                                            loading="lazy"
                                            className="h-10 w-10 rounded-lg object-cover border border-line shadow-sm shrink-0"
                                          />
                                        ) : (
                                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                            <ImageIcon className="h-5 w-5 text-slate-300" />
                                          </div>
                                        )}
                                        <div className="flex flex-col min-w-0 flex-1">
                                          <span className="text-sm font-black text-ink leading-tight truncate">
                                            {item.name}
                                          </span>
                                          <div className="mt-1 flex items-center gap-2">
                                            {item.unique_code && (
                                              <span className="text-[10px] font-mono font-bold text-muted bg-slate-50 px-2 py-0.5 rounded border border-line uppercase">
                                                {item.unique_code}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="w-36 text-right flex-shrink-0">
                                          <span className="text-[15px] font-black text-ink tabular-nums">
                                            ₹{Number(item.price * (item.qty || 1) * days).toLocaleString()}
                                          </span>
                                          <div className="text-[10px] font-bold text-muted mt-0.5 whitespace-nowrap">
                                            ₹{Number(item.price || 0).toLocaleString()}/day × {days}{' '}
                                            {days === 1 ? 'day' : 'days'}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm font-medium text-muted uppercase tracking-widest opacity-40"
                >
                  No matching rental history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden pb-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {sortedRentals.map((rental: any) => {
            const totalAmt =
              rental.total_amount ||
              (rental.products || []).reduce(
                (sum: number, p: any) => sum + Number(p.price || 0) * Number(p.qty || 1),
                0
              );
            return (
              <div
                key={rental.id}
                className={`p-5 rounded-2xl bg-white border shadow-sm transition-all active:scale-[0.98] cursor-pointer h-fit ${expandedOrderId === rental.id
                  ? 'border-primary/30 ring-4 ring-primary/5 shadow-md'
                  : 'border-line/40 hover:shadow-md'
                  }`}
                onClick={() => setExpandedOrderId(expandedOrderId === rental.id ? null : rental.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black tracking-tight text-ink">
                        {rental.rental_no || rental.id.slice(0, 8).toUpperCase()}
                      </span>
                      {(rental.status.toLowerCase() === 'released' || rental.status.toLowerCase() === 'active') && new Date().setHours(0, 0, 0, 0) > new Date(rental.event_date).setHours(0, 0, 0, 0) ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border bg-red-50 text-red-600 border-red-100">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                          Overdue
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border
                          ${rental.status.toLowerCase() === 'returned'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : (rental.status.toLowerCase() === 'released' || rental.status.toLowerCase() === 'active')
                                ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                : rental.status.toLowerCase() === 'cancelled'
                                  ? 'bg-slate-100 text-slate-500 border-slate-200'
                                  : 'bg-amber-50 text-amber-600 border-amber-100'
                            }
                        `}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${rental.status.toLowerCase() === 'returned'
                              ? 'bg-emerald-500'
                              : (rental.status.toLowerCase() === 'released' || rental.status.toLowerCase() === 'active')
                                ? 'bg-indigo-500 animate-pulse'
                                : rental.status.toLowerCase() === 'cancelled'
                                  ? 'bg-slate-400'
                                  : 'bg-amber-400'
                              }`}
                          />
                          {rental.status}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 inline-flex flex-col">
                      <span className="text-[9px] font-black text-muted/60 uppercase tracking-widest mb-0.5">
                        Total Amount
                      </span>
                      <span className="text-[18px] font-black text-ink tabular-nums leading-none">
                        ₹{Number(totalAmt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${expandedOrderId === rental.id
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'bg-slate-50 border-line text-muted'
                      }`}
                  >
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-300 ${expandedOrderId === rental.id ? 'rotate-90' : ''
                        }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-y border-line/20 mb-4 bg-slate-50/30 -mx-5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm border border-line/40">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted uppercase tracking-[0.1em]">Pickup</span>
                      <span className="text-[13px] font-bold text-ink leading-tight">
                        {new Date(rental.pickup_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="h-4 w-px bg-line/40" />
                  <div className="flex items-center gap-3 text-right">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted uppercase tracking-[0.1em]">Return</span>
                      <span className="text-[13px] font-bold text-ink leading-tight">
                        {new Date(rental.return_date || rental.event_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-rose-500 shadow-sm border border-line/40">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-ink truncate max-w-[220px]">
                      {rental.products?.[0]?.name || 'Gear Rental'}
                    </span>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">
                      {(rental.products || []).length} Items Total
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrderId === rental.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="pt-4 space-y-2.5">
                        <div className="flex items-center justify-between px-1 mb-1">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                            Detailed Items
                          </span>
                          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                            {(rental.products || []).length} Items
                          </span>
                        </div>
                        {(rental.products || []).map((item: any, idx: number) => {
                          const days =
                            Math.round(
                              (new Date(rental.return_date || rental.event_date).getTime() -
                                new Date(rental.pickup_date).getTime()) /
                              (1000 * 60 * 60 * 24)
                            ) + 1 || 1;
                          return (
                            <div
                              key={idx}
                              className="group/item relative p-4 rounded-2xl border border-line/40 bg-white shadow-sm hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-4 min-w-0 flex-1">
                                {item.image ? (
                                  <img
                                    src={optimizeImageUrl(item.image)}
                                    alt={item.name}
                                    loading="lazy"
                                    className="h-12 w-12 rounded-xl object-cover border border-line shadow-sm shrink-0"
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                    <ImageIcon className="h-6 w-6 text-slate-300" />
                                  </div>
                                )}
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="text-[13px] font-black text-ink leading-tight break-words">
                                    {item.name}
                                  </span>
                                  <div className="mt-1 flex flex-wrap items-center gap-2">
                                    {item.unique_code && (
                                      <span className="text-[10px] font-mono font-bold text-muted bg-slate-50 px-2 py-0.5 rounded border border-line uppercase">
                                        {item.unique_code}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-line/20 pt-3 sm:pt-0 shrink-0">
                                <div className="text-[9px] font-black text-muted uppercase tracking-wider sm:hidden">
                                  Total Price
                                </div>
                                <div className="text-right">
                                  <span className="text-[14px] font-black text-ink tabular-nums block leading-none">
                                    ₹{Number(item.price * (item.qty || 1) * days).toLocaleString()}
                                  </span>
                                  <span className="text-[9px] font-bold text-muted mt-1 block whitespace-nowrap leading-none">
                                    ₹{Number(item.price || 0).toLocaleString()}/day × {days}d
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserRentalHistory;
