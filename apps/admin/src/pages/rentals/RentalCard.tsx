import { useState, useRef, useEffect } from 'react';
import { Phone, Package, Calendar, ChevronDown, ChevronUp, IndianRupee, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualizer } from '@tanstack/react-virtual';

type Product = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  unique_code?: string;
  released_to_representative_name?: string;
  returned_by_representative_name?: string;
};

type Rental = {
  id: string;
  name: string;
  user_image?: string;
  phone: string;
  pickup: string;
  return_date: string;
  total_price: number;
  status: string;
  products: Product[];
  handover_proof?: string;
  representative_name?: string;
  isHouseBooking?: boolean;
  assistant_crew_count?: number;
};

type RentalCardProps = {
  rentals: Rental[];
  activeTab: 'upcoming' | 'active' | 'returning';
};

const RentalItem = ({ rental, activeTab, index, total, isVisible }: { rental: Rental; activeTab: 'upcoming' | 'active' | 'returning'; index: number; total: number; isVisible: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusLabels: Record<string, string> = {
    confirmed: 'Coming to Collect',
    released: activeTab === 'returning' ? 'Coming to Return' : 'Active in Rent',
    active: activeTab === 'returning' ? 'Coming to Return' : 'Active in Rent',
    returned: 'Returned',
    cancelled: 'Cancelled',
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (isOverdueUnreturned) return 'bg-red-50 text-red-600 border-red-100';
    if (s === 'confirmed' || s === 'upcoming') return 'bg-sky-50 text-sky-600 border-sky-100';
    if (activeTab === 'returning' && (s === 'released' || s === 'active')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s === 'released' || s === 'active') return 'bg-amber-50 text-amber-600 border-amber-100';
    if (s === 'returned' || s === 'completed' || s === 'returning') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s === 'cancelled') return 'bg-slate-100 text-slate-500 border-slate-200';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const productSummary = rental.products.map(p => p.name).join(', ');
  const totalItems = rental.products.length;

  const getDays = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.round(diff / (1000 * 3600 * 24)) + 1;
  };
  const durationDays = getDays(rental.pickup, rental.return_date);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const repNameCollected = (rental as any).released_to_representative_name || rental.products.find(p => p.released_to_representative_name)?.released_to_representative_name;
  const repNameReturned = (rental as any).returned_by_representative_name || rental.products.find(p => p.returned_by_representative_name)?.returned_by_representative_name;

  const isOverdueUnreturned = (rental.status.toLowerCase() === 'released' || rental.status.toLowerCase() === 'active') && new Date().setHours(0, 0, 0, 0) > new Date(rental.return_date).setHours(0, 0, 0, 0);

  return (
    <article
      className={`card-surface overflow-hidden border ${isVisible ? 'card-entrance' : 'card-hidden'} ${isOverdueUnreturned ? 'border-red-200 bg-red-50/10' : isExpanded ? 'border-transparent shadow-cardHover' : 'border-line hover:border-transparent hover:shadow-cardHover'}`}
    >
      <div
        className="cursor-pointer p-4 md:p-5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Overdue Warning Alert Bar */}
        {isOverdueUnreturned && (
          <div className="mb-4 rounded-xl bg-danger/10 border border-danger/20 px-3 py-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-danger animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-danger tracking-wider">
              Overdue Alert: Client has not returned the products past the return date
            </span>
          </div>
        )}

        {/* Top Header: ID & Expansion */}
        <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
              {index}
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-line bg-slate-50 px-3 py-1.5 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-tertiary">Rental ID:</span>
              <span className="font-mono text-sm font-black text-primary">{rental.id}</span>
            </div>
            <span className="text-[10px] font-medium text-muted">{index} of {total}</span>
          </div>
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isExpanded ? 'bg-ink border-ink text-white rotate-180 shadow-md' : 'bg-white border-line text-ink hover:bg-slate-50 hover:border-line/80 shadow-sm'
            }`}>
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Main Body */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Customer Info */}
          <div className="flex items-center gap-4 lg:w-[25%] lg:shrink-0">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-slate-50 shadow-sm ring-1 ring-line/40">
              {rental.user_image ? (
                <img src={rental.user_image} alt={rental.name} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <User className="m-auto mt-3 h-7 w-7 text-muted" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-ink truncate">{rental.name}</h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-muted">
                <Phone className="h-3 w-3" /> {rental.phone}
              </p>
            </div>
          </div>

          {/* Dates - Premium Timeline Widget */}
          <div className="flex w-full items-center justify-center lg:flex-1">
            <div className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-1.5 border border-line/60 shadow-sm lg:w-auto lg:justify-start">

              {/* Pickup */}
              <div className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-colors ${rental.status.toLowerCase() === 'cancelled' ? 'bg-rose-50 shadow-sm ring-1 ring-rose-100/50' :
                rental.status.toLowerCase() === 'returned' || ((rental as any).received_at && new Date((rental as any).received_at) <= new Date(rental.return_date)) ? 'bg-emerald-50 shadow-sm ring-1 ring-emerald-100/50' :
                  (rental as any).received_at && new Date((rental as any).received_at) > new Date(rental.return_date) ? 'bg-emerald-50 shadow-sm ring-1 ring-emerald-100/50' :
                    activeTab === 'upcoming' ? 'bg-sky-50 shadow-sm ring-1 ring-sky-100/50' :
                      activeTab === 'active' ? 'bg-orange-50 shadow-sm ring-1 ring-orange-100/50' :
                        'bg-transparent'
                }`}>
                <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${rental.status.toLowerCase() === 'cancelled' ? 'text-rose-600' :
                  rental.status.toLowerCase() === 'returned' || ((rental as any).received_at && new Date((rental as any).received_at) <= new Date(rental.return_date)) ? 'text-emerald-600' :
                    (rental as any).received_at && new Date((rental as any).received_at) > new Date(rental.return_date) ? 'text-emerald-600' :
                      activeTab === 'upcoming' ? 'text-sky-600' :
                        activeTab === 'active' ? 'text-orange-600' :
                          'text-tertiary'
                  }`}>
                  <Calendar className="h-3 w-3" /> Pickup
                </span>
                <span className={`mt-1 text-xs sm:text-sm font-bold ${rental.status.toLowerCase() === 'cancelled' ? 'text-rose-700' :
                  rental.status.toLowerCase() === 'returned' || ((rental as any).received_at && new Date((rental as any).received_at) <= new Date(rental.return_date)) ? 'text-emerald-700' :
                    (rental as any).received_at && new Date((rental as any).received_at) > new Date(rental.return_date) ? 'text-emerald-700' :
                      activeTab === 'upcoming' ? 'text-sky-700' :
                        activeTab === 'active' ? 'text-orange-700' :
                          'text-ink'
                  }`}>
                  {formatDate(rental.pickup)}
                </span>
              </div>

              {/* Connector (Duration) */}
              <div className="flex flex-col items-center px-2 sm:px-4 shrink-0">
                <div className="flex items-center w-full">
                  <div className="h-[2px] w-3 sm:w-6 bg-line/60 rounded-l-full" />
                  <div className="h-1.5 w-1.5 rounded-full bg-muted shadow-sm ring-2 ring-slate-50" />
                  <div className="h-[2px] w-3 sm:w-6 bg-line/60 rounded-r-full" />
                </div>
                <span className="mt-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted">
                  {durationDays} Days
                </span>
              </div>

              {/* Return */}
              <div className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-colors ${rental.status.toLowerCase() === 'cancelled' ? 'bg-slate-50' :
                (rental as any).received_at && new Date((rental as any).received_at).setHours(0, 0, 0, 0) > new Date(rental.return_date).setHours(0, 0, 0, 0) || (activeTab === 'active' && new Date().setHours(0, 0, 0, 0) > new Date(rental.return_date).setHours(0, 0, 0, 0)) ? 'bg-rose-50 shadow-sm ring-1 ring-rose-100/50' :
                  rental.status.toLowerCase() === 'returned' || ((rental as any).received_at && new Date((rental as any).received_at) <= new Date(rental.return_date)) ? 'bg-emerald-50 shadow-sm ring-1 ring-emerald-100/50' :
                    activeTab === 'returning' ? 'bg-emerald-50 shadow-sm ring-1 ring-emerald-100/50' :
                      activeTab === 'active' ? 'bg-orange-50 shadow-sm ring-1 ring-orange-100/50' :
                        'bg-transparent'
                }`}>
                <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${rental.status.toLowerCase() === 'cancelled' ? 'text-tertiary' :
                  (rental as any).received_at && new Date((rental as any).received_at).setHours(0, 0, 0, 0) > new Date(rental.return_date).setHours(0, 0, 0, 0) || (activeTab === 'active' && new Date().setHours(0, 0, 0, 0) > new Date(rental.return_date).setHours(0, 0, 0, 0)) ? 'text-rose-600' :
                    rental.status.toLowerCase() === 'returned' || ((rental as any).received_at && new Date((rental as any).received_at) <= new Date(rental.return_date)) ? 'text-emerald-600' :
                      activeTab === 'returning' ? 'text-emerald-600' :
                        activeTab === 'active' ? 'text-orange-600' :
                          'text-tertiary'
                  }`}>
                  <Calendar className="h-3 w-3" /> Return
                </span>
                <span className={`mt-1 text-xs sm:text-sm font-bold ${rental.status.toLowerCase() === 'cancelled' ? 'text-ink' :
                  (rental as any).received_at && new Date((rental as any).received_at).setHours(0, 0, 0, 0) > new Date(rental.return_date).setHours(0, 0, 0, 0) || (activeTab === 'active' && new Date().setHours(0, 0, 0, 0) > new Date(rental.return_date).setHours(0, 0, 0, 0)) ? 'text-rose-700 animate-pulse' :
                    rental.status.toLowerCase() === 'returned' || ((rental as any).received_at && new Date((rental as any).received_at) <= new Date(rental.return_date)) ? 'text-emerald-700' :
                      activeTab === 'returning' ? 'text-emerald-700' :
                        activeTab === 'active' ? 'text-orange-700' :
                          'text-ink'
                  }`}>
                  {formatDate(rental.return_date)}
                </span>
              </div>

            </div>
          </div>

          {/* Price & Status Block */}
          <div className="flex items-center justify-center lg:w-[25%] lg:justify-end lg:shrink-0">
            <div className="flex items-center gap-3 rounded-full border border-line bg-slate-50/50 p-1.5 shadow-sm transition-all hover:bg-slate-50 pr-4">
              <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusStyle(rental.status)}`}>
                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                {isOverdueUnreturned ? 'Overdue Return' : (statusLabels[rental.status.toLowerCase()] || rental.status)}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[15px] font-bold text-primary opacity-60 font-mono">₹</span>
                <span className="text-base font-black tracking-tight text-primary leading-none">
                  {rental.total_price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Summary */}
        <div className="mt-5">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50/80 p-2 pr-3 border border-line/60 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-line/40">
                <Package className="h-4 w-4 text-ink" />
              </div>
              <p className="text-xs font-semibold text-ink truncate opacity-90">{productSummary}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-1 shrink-0">
              {rental.assistant_crew_count && rental.assistant_crew_count > 0 ? (
                <span className="shrink-0 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-1 text-[10px] font-black tracking-widest shadow-sm">
                  Crew: {rental.assistant_crew_count}
                </span>
              ) : null}
              <div className="h-1 w-1 rounded-full bg-line mr-1 hidden sm:block" />
              <span className="shrink-0 rounded-lg bg-white border border-line px-2.5 py-1 text-[10px] font-black tracking-widest text-ink shadow-sm">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="bg-slate-50/50"
          >
            <div className="px-4 md:px-6">
              <div className="h-px w-full bg-line" />
            </div>
            <div className="p-4 md:p-6 pt-6 md:pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-tertiary">Detailed Rental Breakdown</h4>
                <div className="mx-4 h-px flex-1 bg-line/60" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {rental.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-[1rem] bg-white p-3 shadow-sm border border-line/40 transition-hover hover:border-primary/30 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-slate-50">
                        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink line-clamp-2 leading-tight break-words">{product.name}</p>
                        <p className="mt-1 inline-block w-max rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-slate-500 uppercase">
                          {product.unique_code || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-primary">₹{product.price.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-muted mt-0.5">₹{product.price.toLocaleString()}/day</p>
                    </div>
                  </div>
                ))}
              </div>

              {rental.assistant_crew_count && rental.assistant_crew_count > 0 ? (
                <div className="flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full bg-white/60 border border-white shadow-sm backdrop-blur-md mt-4 w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-pulse" />
                  <p className="text-xs md:text-sm font-bold text-indigo-600">
                    Assistant Crew: {rental.assistant_crew_count} {rental.assistant_crew_count === 1 ? 'Person' : 'People'}
                  </p>
                </div>
              ) : null}

              {(repNameCollected || repNameReturned) && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-tertiary">Handover Details</h4>
                    <div className="mx-4 h-px flex-1 bg-line/40" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {repNameCollected && (
                      <div className="flex items-center gap-3 rounded-[1rem] border border-line bg-white p-3 shadow-sm transition-hover hover:border-primary/30">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Collected By</p>
                          <p className="text-sm font-bold text-ink truncate">{repNameCollected}</p>
                        </div>
                      </div>
                    )}
                    {repNameReturned && (
                      <div className="flex items-center gap-3 rounded-[1rem] border border-line bg-white p-3 shadow-sm transition-hover hover:border-primary/30">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Returned By</p>
                          <p className="text-sm font-bold text-ink truncate">{repNameReturned}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {rental.handover_proof && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-tertiary">Handover Evidence</h4>
                    <div className="mx-4 h-px flex-1 bg-line/40" />
                  </div>
                  <div className="relative ml-0 mr-auto max-w-full overflow-hidden rounded-3xl border border-line bg-slate-50 shadow-inner group/proof md:max-w-[280px]">
                    <img
                      src={rental.handover_proof}
                      alt="Handover Proof"
                      loading="lazy"
                      className="h-auto w-full object-contain transition-transform duration-700 group-hover/proof:scale-105"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/10 to-transparent" />
                  </div>
                </div>
              )}

              {/* <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-tertiary">Total Amount</span>
                    <span className="text-lg font-black leading-tight text-primary">₹{rental.total_price.toLocaleString()}</span>
                  </div>
                </div>
                <button className={`rounded-xl px-6 py-2.5 text-xs font-black text-white shadow-lg transition-all active:scale-95 ${activeTab === 'upcoming' ? 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20' :
                  activeTab === 'returning' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' :
                    'bg-ink hover:bg-ink/90 shadow-ink/10'
                  }`}>
                  {activeTab === 'upcoming' ? 'Handover Products' :
                    activeTab === 'returning' ? 'Process Return' :
                      'Manage Order'}
                </button>
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

const RentalCard = ({ rentals, activeTab }: RentalCardProps) => {
  if (!rentals.length) {
    const emptyMessages = {
      upcoming: "No pickups scheduled for this date.",
      active: "No active rentals currently released.",
      returning: "No returns expected for this date."
    };

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center card-surface border-dashed border-2 border-slate-200 bg-slate-50/30">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100/80 text-slate-400">
          <Calendar className="h-8 w-8 opacity-40" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-ink">No Rentals Found</h3>
          <p className="text-[13px] font-bold text-muted max-w-[240px] mx-auto leading-relaxed">
            {emptyMessages[activeTab]}
          </p>
        </div>
      </div>
    );
  }

  const [visibleCount, setVisibleCount] = useState(0);
  const hasStaggeredRef = useRef(false);

  useEffect(() => {
    if (hasStaggeredRef.current) {
      setVisibleCount(rentals.length);
      return;
    }

    hasStaggeredRef.current = true;
    setVisibleCount(1);

    if (rentals.length <= 1) return;

    // Adaptive batching: ~25 ticks total, ~2s total time
    // Large lists → batch many cards per tick
    const targetTicks = Math.min(rentals.length, 25);
    const batchSize = Math.ceil(rentals.length / targetTicks);
    const delay = Math.max(60, Math.min(250, Math.floor(2000 / targetTicks)));

    const timer = setInterval(() => {
      setVisibleCount(prev => {
        const next = Math.min(prev + batchSize, rentals.length);
        if (next >= rentals.length) {
          clearInterval(timer);
          return rentals.length;
        }
        return next;
      });
    }, delay);

    return () => clearInterval(timer);
  }, [rentals.length]);

  const parentRef = useRef(null);
  const virtualize = rentals.length > 150;

  const virtualizer = useVirtualizer({
    count: virtualize ? Math.min(visibleCount, rentals.length) : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  if (virtualize) {
    return (
      <div
        ref={parentRef}
        style={{ overflow: 'auto', maxHeight: 'calc(100vh - 280px)' }}
        className="space-y-0"
      >
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const rental = rentals[virtualItem.index];
            const idx = virtualItem.index;
            return (
              <div
                key={rental.id}
                data-index={idx}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <RentalItem rental={rental} activeTab={activeTab} index={idx + 1} total={rentals.length} isVisible={idx < visibleCount} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rentals.map((rental, idx) => (
        <RentalItem key={rental.id} rental={rental} activeTab={activeTab} index={idx + 1} total={rentals.length} isVisible={idx < visibleCount} />
      ))}
    </div>
  );
};

export default RentalCard;
