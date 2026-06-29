import { motion, AnimatePresence } from 'framer-motion';
import { Store, Package, Trash2, ChevronRight, Info, Calendar, ArrowRight, Users, Loader2 } from 'lucide-react';

interface OrderSummaryProps {
  cart: any[];
  removeFromCart: (id: string) => void;
  handleProcessBooking: () => void;
  startDate?: string;
  endDate?: string;
  assistantCount?: number;
  loading?: boolean;
}

export const OrderSummary = ({ cart, removeFromCart, handleProcessBooking, startDate, endDate, assistantCount = 0, loading = false }: OrderSummaryProps) => {
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const calculateItemPrice = (item: any, totalDays: number) => {
    const p1 = Number(item.price_per_day) || 0;
    const p2 = Number(item.price_2_days) || 0;
    const p5 = Number(item.price_5_days) || 0;

    const getRawPrice = (days: number) => {
      let t = 0;
      let r = days;
      if (p5 > 0) {
        t += Math.floor(r / 5) * p5;
        r = r % 5;
      }
      // Apply 2-day price at most once for the remaining days
      if (p2 > 0 && r >= 2) {
        t += p2;
        r -= 2;
      }
      t += r * p1;
      return t;
    };

    let bestPrice = getRawPrice(totalDays);

    // Ensure renting for more days doesn't cost less (price capping)
    for (let i = 1; i <= 4; i++) {
      const cappedPrice = getRawPrice(totalDays + i);
      if (cappedPrice < bestPrice) {
        bestPrice = cappedPrice;
      }
    }

    return bestPrice;
  };

  const days = calculateDays();
  const grandTotal = cart.reduce((sum, item) => sum + calculateItemPrice(item, days), 0);

  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-24 space-y-6">
        <section className="card-surface p-6 shadow-sm border-primary/5">
          <div className="flex items-center gap-3 pb-4 border-b border-line/50 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 border border-indigo-100/50 shadow-sm">
              <Store className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black text-ink leading-none">Booking Summary</h2>
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-30">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-muted/50">
                <Package className="h-8 w-8" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">No gear selected</p>
            </div>
          ) : (
            <div className="space-y-6">
              {startDate && endDate && (
                <div className="rounded-2xl bg-emerald-50/40 border border-emerald-100/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Pick-up</span>
                      <span className="text-[12px] font-bold text-ink">{new Date(startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-emerald-100/50 flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex flex-col gap-1 items-end text-right">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Return</span>
                      <span className="text-[12px] font-bold text-ink">{new Date(endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="max-h-[330px] overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] overscroll-contain pr-2 custom-scrollbar space-y-2.5">
                <AnimatePresence>
                  {cart.map(item => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group flex items-center gap-3.5 rounded-2xl border border-line bg-white p-3 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-slate-50 shadow-sm">
                        <img src={item.image} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} />
                      </div>

                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="text-[13px] font-black leading-tight text-ink line-clamp-2 tracking-tight">{item.name}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                            {item.unique_code}
                          </span>
                          <span className="text-[12px] font-black text-primary tracking-tight">₹{calculateItemPrice(item, days)} <span className="text-[10px] text-muted/60 font-bold ml-0.5 tracking-tighter">/ {days} {days === 1 ? 'Day' : 'Days'}</span></span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-all hover:bg-danger hover:text-white active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="pt-4 border-t border-line/60 space-y-4">
                <div className="space-y-2.5 px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted/60" />
                      <span className="text-[10px] font-black text-muted uppercase tracking-[0.15em]">Rental Duration</span>
                    </div>
                    <span className="text-[11px] font-black text-ink uppercase tracking-widest">{days} {days === 1 ? 'Day' : 'Days'}</span>
                  </div>

                  {assistantCount > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted/60" />
                        <span className="text-[10px] font-black text-muted uppercase tracking-[0.15em]">Assistant Crew</span>
                      </div>
                      <span className="text-[11px] font-black text-ink uppercase tracking-widest">{assistantCount} {assistantCount === 1 ? 'Person' : 'Persons'}</span>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 flex items-center justify-between shadow-inner border border-line/30">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted leading-none">Total Order</span>
                    <span className="text-[15px] font-black text-ink mt-2">{cart.length} Items</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted leading-none">Total Amount</span>
                    <span className="text-xl font-black text-primary mt-2">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  disabled={!startDate || !endDate || loading}
                  onClick={handleProcessBooking}
                  className={`group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl transition-all
                    ${(!startDate || !endDate || loading)
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-line/30'
                      : 'bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-emerald-600 active:scale-[0.98]'}`}
                >
                  {startDate && endDate && !loading && <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />}
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span className="relative text-[12px] font-black uppercase tracking-[0.15em]">Generate Rental Order</span>
                      <ChevronRight className={`relative h-5 w-5 transition-transform duration-300 ${startDate && endDate ? 'group-hover:translate-x-1' : 'opacity-30'}`} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 bg-sky-50/50 border border-sky-100 shadow-sm"
        >
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-500 border border-sky-100 shadow-sm">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-[11px] font-black text-sky-900 uppercase tracking-widest">Collection Policy</h3>
              <p className="text-[11px] leading-relaxed text-sky-800/70 font-bold">
                ID verification and rep photo proof mandatory during release. Ensure all serial numbers match the generated order sheet.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
};
