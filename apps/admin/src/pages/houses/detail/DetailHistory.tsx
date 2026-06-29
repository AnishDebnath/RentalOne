import { useState, useMemo } from 'react';
import { History, Search, ChevronRight, Calendar, CalendarOff, Image as ImageIcon, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDatePicker from '../../rentals/CustomDatePicker';
import axiosInstance from '../../../api/axiosInstance';

type DetailHistoryProps = {
  rentals: any[];
  expandedOrderId: string | null;
  setExpandedOrderId: (id: string | null) => void;
  onRefresh?: () => void;
};

const DetailHistory = ({ rentals, expandedOrderId, setExpandedOrderId, onRefresh }: DetailHistoryProps) => {
  const DEFAULT_ASSISTANT_CREW_RATE = 0;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [crewPrices, setCrewPrices] = useState<Record<string, number>>({});
  const [isEditingCrewPrice, setIsEditingCrewPrice] = useState<Record<string, boolean>>({});
  const [discounts, setDiscounts] = useState<Record<string, number>>({});
  const [isEditingDiscount, setIsEditingDiscount] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  const getCrewRate = (rentalId: string, rental: any) => {
    if (crewPrices[rentalId] !== undefined) {
      return crewPrices[rentalId];
    }
    return rental.crew_price !== undefined && rental.crew_price !== null
      ? Number(rental.crew_price)
      : DEFAULT_ASSISTANT_CREW_RATE;
  };

  const getDiscount = (rentalId: string, rental: any) => {
    if (discounts[rentalId] !== undefined) {
      return discounts[rentalId];
    }
    return rental.discount !== undefined && rental.discount !== null
      ? Number(rental.discount)
      : 0;
  };

  const handleSaveCrewPrice = async (rental: any) => {
    const rate = crewPrices[rental.id];
    if (rate === undefined) return;

    setIsSaving(prev => ({ ...prev, [rental.id]: true }));
    try {
      const days = (Math.round((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) + 1) || 1;
      const productsTotal = (rental.products || []).reduce((sum: number, p: any) => sum + (Number(p.price || 0) * Number(p.qty || 1) * days), 0);
      const newCrewTotal = (rental.assistant_crew_count || 0) * rate;
      const currentDiscount = getDiscount(rental.id, rental);
      const newTotalAmount = productsTotal + newCrewTotal - currentDiscount;

      await axiosInstance.patch(`/rentals/${rental.id}`, {
        total_amount: newTotalAmount,
        crew_price: rate
      });

      setIsEditingCrewPrice(prev => ({ ...prev, [rental.id]: false }));
      setCrewPrices(prev => {
        const copy = { ...prev };
        delete copy[rental.id];
        return copy;
      });
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to save crew price:', err);
    } finally {
      setIsSaving(prev => ({ ...prev, [rental.id]: false }));
    }
  };

  const handleSaveDiscount = async (rental: any) => {
    const discountVal = discounts[rental.id];
    if (discountVal === undefined) return;

    setIsSaving(prev => ({ ...prev, [rental.id]: true }));
    try {
      const days = (Math.round((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) + 1) || 1;
      const productsTotal = (rental.products || []).reduce((sum: number, p: any) => sum + (Number(p.price || 0) * Number(p.qty || 1) * days), 0);
      const crewRate = getCrewRate(rental.id, rental);
      const crewTotal = (rental.assistant_crew_count || 0) * crewRate;
      const newTotalAmount = productsTotal + crewTotal - discountVal;

      await axiosInstance.patch(`/rentals/${rental.id}`, {
        total_amount: newTotalAmount,
        discount: discountVal
      });

      setIsEditingDiscount(prev => ({ ...prev, [rental.id]: false }));
      setDiscounts(prev => {
        const copy = { ...prev };
        delete copy[rental.id];
        return copy;
      });
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to save discount:', err);
    } finally {
      setIsSaving(prev => ({ ...prev, [rental.id]: false }));
    }
  };

  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, []);

  const toLocalDate = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const filteredHistory = useMemo(() => {
    let list = rentals;

    if (filterDate) {
      list = list.filter(r =>
        toLocalDate(r.pickup_date) === filterDate ||
        toLocalDate(r.event_date) === filterDate
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(r =>
        (r.rental_no || '').toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query) ||
        (r.products || []).some((p: any) => p.name.toLowerCase().includes(query))
      );
    }

    return list;
  }, [rentals, searchQuery, filterDate]);

  return (
    <div className="space-y-5">
      <section className="card-surface p-0 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-line/40 flex flex-col md:flex-row md:items-center justify-between bg-white gap-5">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center text-indigo-600 border border-slate-200/60 shadow-sm">
              <History className="h-5 w-5" />
            </div>
            <div className='flex flex-col'>
              <h2 className="text-lg font-black text-ink tracking-tight">Rental History</h2>
              <p className="text-[10px] font-bold text-muted uppercase">Complete record of rental activities</p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative flex-1 md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-muted group-focus-within:text-primary transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Search rentals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-line bg-slate-50/50 pl-10 pr-4 text-[13px] font-bold text-ink outline-none focus:border-primary/50 focus:bg-white focus:ring-[4px] focus:ring-primary/5 transition-all placeholder:text-muted/40"
              />
            </div>

            <CustomDatePicker
              selectedDate={filterDate || todayStr}
              onChange={setFilterDate}
            />

            {filterDate && (
              <button
                onClick={() => setFilterDate('')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                title="Clear Date Filter"
              >
                <CalendarOff className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {rentals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-line/40">
              <History className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-black text-ink uppercase tracking-wider">No Rentals Found</h3>
            <p className="text-[11px] font-bold text-muted uppercase mt-1 max-w-[240px]">
              This production house has not made any rentals yet.
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-line/40">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-black text-ink uppercase tracking-wider">No Match Found</h3>
            <p className="text-[11px] font-bold text-muted uppercase mt-1 max-w-[240px]">
              We couldn't find any rentals matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterDate('');
              }}
              className="mt-4 text-xs font-black uppercase tracking-widest text-primary hover:underline underline-offset-4"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
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
                  {filteredHistory.map((rental) => {
                    const days = (Math.round((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) + 1) || 1;
                    const productsTotal = (rental.products || []).reduce((sum: number, p: any) => sum + (Number(p.price || 0) * Number(p.qty || 1) * days), 0);
                    const crewRate = getCrewRate(rental.id, rental);
                    const crewTotal = (rental.assistant_crew_count || 0) * crewRate;
                    const discountVal = getDiscount(rental.id, rental);
                    const displayTotal = rental.total_amount !== undefined && rental.total_amount !== null
                      ? (crewPrices[rental.id] !== undefined || discounts[rental.id] !== undefined
                        ? productsTotal + crewTotal - discountVal
                        : Number(rental.total_amount))
                      : productsTotal + crewTotal - discountVal;
                    return (
                      <tr key={rental.id} className="group transition-colors border-b border-line/20">
                        <td colSpan={6} className="p-0">
                          <div
                            className={`flex items-center w-full group/row cursor-pointer transition-colors ${expandedOrderId === rental.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}
                            onClick={() => setExpandedOrderId(expandedOrderId === rental.id ? null : rental.id)}
                          >
                            <div className="w-[12%] px-6 py-5">
                              <span className="text-sm font-black tracking-tight text-ink uppercase">{rental.rental_no || rental.id.slice(0, 8)}</span>
                            </div>
                            <div className="w-[28%] px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-muted uppercase tracking-tighter mb-0.5">Pickup</span>
                                  <span className="text-sm font-bold text-ink/80 whitespace-nowrap">{new Date(rental.pickup_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="h-px w-4 bg-line/60 mt-4" />
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-muted uppercase tracking-tighter mb-0.5">Return</span>
                                  <span className="text-sm font-bold text-ink/80 whitespace-nowrap">{new Date(rental.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                              </div>
                            </div>
                            <div className="w-[25%] px-6 py-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-black leading-none truncate">{rental.products?.[0]?.name || 'N/A'}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-muted uppercase tracking-widest">
                                    {rental.products?.length || 0} Items {rental.assistant_crew_count && rental.assistant_crew_count > 0 ? `+ ${rental.assistant_crew_count} Crew` : ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="w-[15%] px-6 py-5 text-right">
                              <span className="text-[15px] font-black text-ink tabular-nums">₹{Number(displayTotal).toLocaleString()}</span>
                            </div>
                            <div className="w-[14%] px-6 py-5">
                              <div className="flex justify-center">
                                {(rental.status.toLowerCase() === 'released' || rental.status.toLowerCase() === 'active') && new Date().setHours(0, 0, 0, 0) > new Date(rental.event_date).setHours(0, 0, 0, 0) ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border bg-red-50 text-red-600 border-red-100">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                    Overdue
                                  </span>
                                ) : (
                                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border
                                  ${rental.status.toLowerCase() === 'returned' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                      rental.status.toLowerCase() === 'confirmed' || rental.status.toLowerCase() === 'active' || rental.status.toLowerCase() === 'released' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                        rental.status.toLowerCase() === 'cancelled' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                          'bg-amber-50 text-amber-600 border-amber-100'}
                                `}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${rental.status.toLowerCase() === 'returned' ? 'bg-emerald-500' : rental.status.toLowerCase() === 'confirmed' || rental.status.toLowerCase() === 'active' || rental.status.toLowerCase() === 'released' ? 'bg-indigo-500 animate-pulse' : rental.status.toLowerCase() === 'cancelled' ? 'bg-slate-400' : 'bg-amber-400'}`} />
                                    {rental.status}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="w-[6%] px-6 py-5 text-center">
                              <ChevronRight className={`h-5 w-5 text-muted transition-transform duration-300 ${expandedOrderId === rental.id ? 'rotate-90 text-primary' : ''}`} />
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
                                      <span className="text-[10px] font-black uppercase tracking-widest text-muted">Detailed Rentals</span>
                                      <span className="text-[10px] font-bold text-primary uppercase">{rental.products?.length || 0} Items</span>
                                    </div>                                  <div className="divide-y divide-line/40">
                                      {rental.products?.map((item: any, idx: number) => {
                                        const days = (Math.round((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) + 1) || 1;
                                        return (
                                          <div key={idx} className="px-4 py-3.5 flex items-center gap-4 hover:bg-slate-50/30 transition-colors">
                                            {item.image ? (
                                              <img src={item.image} alt={item.name} loading="lazy" className="h-10 w-10 rounded-lg object-cover border border-line shadow-sm shrink-0" />
                                            ) : (
                                              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                <ImageIcon className="h-5 w-5 text-slate-300" />
                                              </div>
                                            )}
                                            <div className="flex flex-col min-w-0 flex-1">
                                              <span className="text-sm font-black text-ink leading-tight truncate">{item.name}</span>
                                              <div className="mt-1">
                                                <span className="text-[10px] font-mono font-black text-primary/80 bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tight">{item.unique_code || item.code}</span>
                                              </div>
                                            </div>
                                            <div className="w-36 text-right flex-shrink-0">
                                              <span className="text-[15px] font-black text-ink tabular-nums">
                                                ₹{Number(item.price * (item.qty || 1) * days).toLocaleString()}
                                              </span>
                                              <div className="text-[10px] font-bold text-muted mt-0.5 whitespace-nowrap">
                                                ₹{Number(item.price || 0).toLocaleString()}/day × {days} {days === 1 ? 'day' : 'days'}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  {!!rental.assistant_crew_count && rental.assistant_crew_count > 0 && (
                                    <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-3.5 flex flex-row items-center justify-between gap-2 mt-3">
                                      <div className="flex flex-col gap-1 shrink overflow-hidden pr-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-pulse shrink-0" />
                                          <span className="text-sm font-black text-indigo-950 tracking-wider truncate">Assistant Crew</span>
                                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-100/60 px-2 py-0.5 rounded-lg border border-indigo-200 shrink-0">
                                            {rental.assistant_crew_count} {rental.assistant_crew_count === 1 ? 'Person' : 'People'}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex flex-col gap-1.5 items-end">
                                          <span className="text-[10px] font-black text-indigo-950/60 uppercase tracking-widest">Per Head</span>
                                          {isEditingCrewPrice[rental.id] !== false ? (
                                            <div className="flex items-center gap-1.5">
                                              <div className="relative">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-black text-indigo-950">₹</span>
                                                <input
                                                  type="text"
                                                  inputMode="numeric"
                                                  pattern="[0-9]*"
                                                  disabled={isSaving[rental.id]}
                                                  value={crewPrices[rental.id] !== undefined ? crewPrices[rental.id] : crewRate}
                                                  onChange={(e) => {
                                                    e.stopPropagation();
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setCrewPrices(prev => ({ ...prev, [rental.id]: Number(val) }));
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      e.stopPropagation();
                                                      handleSaveCrewPrice(rental);
                                                    }
                                                  }}
                                                  onClick={(e) => e.stopPropagation()}
                                                  placeholder="0"
                                                  className="text-sm font-black text-indigo-950 w-24 pl-6 pr-2 h-[26px] bg-white border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-indigo-950/30"
                                                />
                                              </div>
                                              <button
                                                disabled={isSaving[rental.id]}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleSaveCrewPrice(rental);
                                                }}
                                                className="h-[26px] px-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
                                              >
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                  {isSaving[rental.id] ? 'Saving...' : 'Add'}
                                                </span>
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-2 h-[26px]">
                                              <span className="text-sm font-black text-indigo-950 tabular-nums">₹{crewRate.toLocaleString()}</span>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setIsEditingCrewPrice(prev => ({ ...prev, [rental.id]: true }));
                                                  setCrewPrices(prev => ({ ...prev, [rental.id]: crewRate }));
                                                }}
                                                className="h-[22px] w-[22px] rounded border border-indigo-200 bg-white flex items-center justify-center text-indigo-500 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                                              >
                                                <Edit2 className="h-3 w-3" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                        <div className="text-right border-l border-indigo-200 pl-3 flex flex-col gap-1.5">
                                          <span className="text-[15px] font-black text-indigo-950 tabular-nums block leading-none">
                                            ₹{Number(crewTotal).toLocaleString()}
                                          </span>
                                          <span className="text-[10px] font-bold text-indigo-600/80 mt-0.5 block whitespace-nowrap leading-none">
                                            ₹{crewRate}/head × {rental.assistant_crew_count}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-3.5 flex flex-row items-center justify-between gap-2 mt-3">
                                    <div className="flex flex-col gap-1 shrink overflow-hidden pr-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse shrink-0" />
                                        <span className="text-sm font-black text-rose-950 tracking-wider truncate">Discount (Off)</span>
                                        {discountVal > 0 && (
                                          <span className="text-[10px] font-black text-rose-600 bg-rose-100/60 px-2 py-0.5 rounded-lg border border-rose-200 shrink-0">
                                            Applied
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                      <div className="flex flex-col gap-1.5 items-end">
                                        <span className="text-[10px] font-black text-rose-950/60 uppercase tracking-widest">Amount</span>
                                        {isEditingDiscount[rental.id] !== false ? (
                                          <div className="flex items-center gap-1.5">
                                            <div className="relative">
                                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-black text-rose-950">₹</span>
                                              <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                disabled={isSaving[rental.id]}
                                                value={discounts[rental.id] !== undefined ? discounts[rental.id] : discountVal}
                                                onChange={(e) => {
                                                  e.stopPropagation();
                                                  const val = e.target.value.replace(/\D/g, '');
                                                  setDiscounts(prev => ({ ...prev, [rental.id]: Number(val) }));
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleSaveDiscount(rental);
                                                  }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                placeholder="0"
                                                className="text-sm font-black text-rose-950 w-24 pl-6 pr-2 h-[26px] bg-white border border-rose-200 rounded-lg shadow-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-rose-950/30"
                                              />
                                            </div>
                                            <button
                                              disabled={isSaving[rental.id]}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleSaveDiscount(rental);
                                              }}
                                              className="h-[26px] px-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
                                            >
                                              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                {isSaving[rental.id] ? 'Saving...' : 'Add'}
                                              </span>
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2 h-[26px]">
                                            <span className="text-sm font-black text-rose-950 tabular-nums">₹{discountVal.toLocaleString()}</span>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setIsEditingDiscount(prev => ({ ...prev, [rental.id]: true }));
                                                setDiscounts(prev => ({ ...prev, [rental.id]: discountVal }));
                                              }}
                                              className="h-[22px] w-[22px] rounded border border-rose-200 bg-white flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                                            >
                                              <Edit2 className="h-3 w-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-right border-l border-rose-200 pl-3 flex flex-col gap-1.5">
                                        <span className="text-[15px] font-black text-rose-950 tabular-nums block leading-none">
                                          -₹{Number(discountVal).toLocaleString()}
                                        </span>
                                        <span className="text-[10px] font-bold text-rose-600/80 mt-0.5 block whitespace-nowrap leading-none">
                                          Deducted
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden pb-4 px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {filteredHistory.map((rental) => {
                  const days = (Math.round((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) + 1) || 1;
                  const productsTotal = (rental.products || []).reduce((sum: number, p: any) => sum + (Number(p.price || 0) * Number(p.qty || 1) * days), 0);
                  const crewRate = getCrewRate(rental.id, rental);
                  const crewTotal = (rental.assistant_crew_count || 0) * crewRate;
                  const discountVal = getDiscount(rental.id, rental);
                  const displayTotal = rental.total_amount !== undefined && rental.total_amount !== null
                    ? (crewPrices[rental.id] !== undefined || discounts[rental.id] !== undefined
                      ? productsTotal + crewTotal - discountVal
                      : Number(rental.total_amount))
                    : productsTotal + crewTotal - discountVal;
                  return (
                    <div
                      key={rental.id}
                      className={`p-5 rounded-2xl bg-white border shadow-sm transition-all active:scale-[0.98] cursor-pointer h-fit ${expandedOrderId === rental.id ? 'border-primary/30 ring-4 ring-primary/5 shadow-md' : 'border-line/40 hover:shadow-md'}`}
                      onClick={() => setExpandedOrderId(expandedOrderId === rental.id ? null : rental.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black tracking-tight text-ink uppercase">{rental.rental_no || rental.id.slice(0, 8)}</span>
                            {(rental.status.toLowerCase() === 'released' || rental.status.toLowerCase() === 'active') && new Date().setHours(0, 0, 0, 0) > new Date(rental.event_date).setHours(0, 0, 0, 0) ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border bg-red-50 text-red-600 border-red-100">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                Overdue
                              </span>
                            ) : (
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm border
                              ${rental.status === 'returned' || rental.status === 'Returned' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                  rental.status === 'confirmed' || rental.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    'bg-slate-50 text-slate-500 border-slate-100'}
                              `}>
                                <div className={`h-1.5 w-1.5 rounded-full ${rental.status === 'returned' || rental.status === 'Returned' ? 'bg-emerald-500' : rental.status === 'confirmed' || rental.status === 'Active' ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'}`} />
                                {rental.status}
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 inline-flex flex-col">
                            <span className="text-[9px] font-black text-muted/60 uppercase tracking-widest mb-0.5">Grand Total</span>
                            <span className="text-[18px] font-black text-ink tabular-nums leading-none">₹{Number(displayTotal).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${expandedOrderId === rental.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 border-line text-muted'}`}>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${expandedOrderId === rental.id ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-4 border-y border-line/20 mb-4 bg-slate-50/30 -mx-5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm border border-line/40">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-muted uppercase tracking-[0.1em]">Pickup</span>
                            <span className="text-[13px] font-bold text-ink leading-tight">{new Date(rental.pickup_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="h-4 w-px bg-line/40" />
                        <div className="flex items-center gap-3 text-right">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-muted uppercase tracking-[0.1em]">Return</span>
                            <span className="text-[13px] font-bold text-ink leading-tight">{new Date(rental.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-rose-500 shadow-sm border border-line/40">
                            <Calendar className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-ink truncate max-w-[220px]">{rental.products?.[0]?.name || 'N/A'}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                              {rental.products?.length || 0} Items {rental.assistant_crew_count && rental.assistant_crew_count > 0 ? `+ ${rental.assistant_crew_count} Crew` : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedOrderId === rental.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 space-y-2.5">
                              <div className="flex items-center justify-between px-1 mb-1">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Detailed Rentals</span>
                                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{rental.products?.length || 0} Items</span>
                              </div>
                              {rental.products?.map((item: any, idx: number) => {
                                const days = (Math.round((new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) / (1000 * 60 * 60 * 24)) + 1) || 1;
                                return (
                                  <div key={idx} className="group/item relative p-4 rounded-2xl border border-line/40 bg-white shadow-sm hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                      {item.image ? (
                                        <img src={item.image} alt={item.name} loading="lazy" className="h-12 w-12 rounded-xl object-cover border border-line shadow-sm shrink-0" />
                                      ) : (
                                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                          <ImageIcon className="h-6 w-6 text-slate-300" />
                                        </div>
                                      )}
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-[13px] font-black text-ink leading-tight break-words">{item.name}</span>
                                        <div className="mt-1">
                                          <span className="text-[10px] font-mono font-black text-primary/80 bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tighter">{item.unique_code || item.code}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-line/20 pt-3 sm:pt-0 shrink-0">
                                      <div className="text-[9px] font-black text-muted uppercase tracking-wider sm:hidden">Total Price</div>
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
                              {!!rental.assistant_crew_count && rental.assistant_crew_count > 0 && (
                                <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-3.5 flex flex-col gap-3 mt-2.5">
                                  <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-center gap-2">
                                      <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-pulse shrink-0" />
                                      <span className="text-sm font-black text-indigo-950 uppercase tracking-wider truncate">Assistant Crew</span>
                                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-100/60 px-2 py-0.5 rounded-lg border border-indigo-200 shrink-0 ml-auto">
                                        {rental.assistant_crew_count} {rental.assistant_crew_count === 1 ? 'Person' : 'People'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between gap-3 w-full border-t border-indigo-100/60 pt-3 shrink-0">
                                    <div className="flex flex-col gap-1.5 items-start">
                                      <span className="text-[9px] font-black text-indigo-950/60 uppercase tracking-widest">Per Head</span>
                                      {isEditingCrewPrice[rental.id] !== false ? (
                                        <div className="flex items-center gap-1.5">
                                          <div className="relative">
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-black text-indigo-950">₹</span>
                                            <input
                                              type="text"
                                              inputMode="numeric"
                                              pattern="[0-9]*"
                                              disabled={isSaving[rental.id]}
                                              value={crewPrices[rental.id] !== undefined ? crewPrices[rental.id] : crewRate}
                                              onChange={(e) => {
                                                e.stopPropagation();
                                                const val = e.target.value.replace(/\D/g, '');
                                                setCrewPrices(prev => ({ ...prev, [rental.id]: Number(val) }));
                                              }}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  handleSaveCrewPrice(rental);
                                                }
                                              }}
                                              onClick={(e) => e.stopPropagation()}
                                              placeholder="0"
                                              className="text-sm font-black text-indigo-950 w-20 pl-5 pr-2 h-[24px] bg-white border border-indigo-200 rounded-md shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-indigo-950/30"
                                            />
                                          </div>
                                          <button
                                            disabled={isSaving[rental.id]}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSaveCrewPrice(rental);
                                            }}
                                            className="h-[24px] px-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-md flex items-center justify-center transition-colors shadow-sm"
                                          >
                                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                                              {isSaving[rental.id] ? 'Saving...' : 'Add'}
                                            </span>
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 h-[24px]">
                                          <span className="text-sm font-black text-indigo-950 tabular-nums">₹{crewRate.toLocaleString()}</span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setIsEditingCrewPrice(prev => ({ ...prev, [rental.id]: true }));
                                              setCrewPrices(prev => ({ ...prev, [rental.id]: crewRate }));
                                            }}
                                            className="h-[20px] w-[20px] rounded border border-indigo-200 bg-white flex items-center justify-center text-indigo-500 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                                          >
                                            <Edit2 className="h-2.5 w-2.5" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right flex flex-col gap-1.5 shrink-0">
                                      <span className="text-[15px] font-black text-indigo-950 tabular-nums block leading-none">
                                        ₹{Number(crewTotal).toLocaleString()}
                                      </span>
                                      <span className="text-[10px] font-bold text-indigo-600/80 mt-0.5 block whitespace-nowrap leading-none">
                                        ₹{crewRate}/head × {rental.assistant_crew_count}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-3.5 flex flex-col gap-3 mt-2.5">
                                <div className="flex flex-col gap-1 w-full">
                                  <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse shrink-0" />
                                    <span className="text-sm font-black text-rose-950 uppercase tracking-wider truncate">Discount (Off)</span>
                                    {discountVal > 0 && (
                                      <span className="text-[10px] font-black text-rose-600 bg-rose-100/60 px-2 py-0.5 rounded-lg border border-rose-200 shrink-0 ml-auto">
                                        Applied
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between gap-3 w-full border-t border-rose-100/60 pt-3 shrink-0">
                                  <div className="flex flex-col gap-1.5 items-start">
                                    <span className="text-[9px] font-black text-rose-950/60 uppercase tracking-widest">Amount</span>
                                    {isEditingDiscount[rental.id] !== false ? (
                                      <div className="flex items-center gap-1.5">
                                        <div className="relative">
                                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-black text-rose-950">₹</span>
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            disabled={isSaving[rental.id]}
                                            value={discounts[rental.id] !== undefined ? discounts[rental.id] : discountVal}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              const val = e.target.value.replace(/\D/g, '');
                                              setDiscounts(prev => ({ ...prev, [rental.id]: Number(val) }));
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleSaveDiscount(rental);
                                              }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="0"
                                            className="text-sm font-black text-rose-950 w-20 pl-5 pr-2 h-[24px] bg-white border border-rose-200 rounded-md shadow-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-rose-950/30"
                                          />
                                        </div>
                                        <button
                                          disabled={isSaving[rental.id]}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSaveDiscount(rental);
                                          }}
                                          className="h-[24px] px-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-md flex items-center justify-center transition-colors shadow-sm"
                                        >
                                          <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                                            {isSaving[rental.id] ? 'Saving...' : 'Add'}
                                          </span>
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 h-[24px]">
                                        <span className="text-sm font-black text-rose-950 tabular-nums">₹{discountVal.toLocaleString()}</span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditingDiscount(prev => ({ ...prev, [rental.id]: true }));
                                            setDiscounts(prev => ({ ...prev, [rental.id]: discountVal }));
                                          }}
                                          className="h-[20px] w-[20px] rounded border border-rose-200 bg-white flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                                        >
                                          <Edit2 className="h-2.5 w-2.5" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right flex flex-col gap-1.5 shrink-0">
                                    <span className="text-[15px] font-black text-rose-950 tabular-nums block leading-none">
                                      -₹{Number(discountVal).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] font-bold text-rose-600/80 mt-0.5 block whitespace-nowrap leading-none">
                                      Deducted
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default DetailHistory;
