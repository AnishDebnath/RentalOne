import { useState } from 'react';
import {
  Camera,
  Calendar,
  ChevronDown,
  PackageCheck,
  Info,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import formatDate from '../../utils/formatDate';
import formatCurrency from '../../utils/formatCurrency';

interface RentalHistoryTabProps {
  pastRentals: any[];
}

const getRentalDuration = (rental: any) =>
  (Math.round(
    (new Date(rental.event_date).getTime() - new Date(rental.pickup_date).getTime()) /
    (1000 * 60 * 60 * 24),
  ) + 1) || 1;

const getItemTotal = (item: any, duration: number) => {
  const quantity = Number(item.qty || 1);
  const unitPrice = Number(item.price || 0);
  return unitPrice * quantity * duration;
};

const getRentalFallbackTotal = (rental: any, duration: number) =>
  (rental.products || []).reduce(
    (sum: number, item: any) => sum + getItemTotal(item, duration),
    0,
  );

const getCrewTotal = (rental: any) =>
  Number(rental.assistant_crew_count || 0) * Number(rental.crew_price || 0);

const getDiscountTotal = (rental: any) => Number(rental.discount || 0);

const RentalHistoryTab = ({ pastRentals }: RentalHistoryTabProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="animate-fade-up space-y-4 md:space-y-6">
      <div className="flex flex-col gap-2 border-b border-line/40 pb-3 px-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-ink">Rental History</h2>
          <p className="mt-0.5 text-xs md:text-sm font-medium text-muted">
            Your past orders and returned inventory.
          </p>
        </div>
        <div className="w-fit rounded-full border border-primary/20 bg-primary-light/50 px-4 py-1.5 text-[10px] md:text-xs font-bold text-primary-dark backdrop-blur-sm">
          {pastRentals.length} past order{pastRentals.length !== 1 ? 's' : ''}
        </div>
      </div>

      {pastRentals.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center space-y-4 rounded-[2rem] border-2 border-dashed border-white/60 bg-white/40 p-10 text-center backdrop-blur-sm md:p-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-primary">
            <PackageCheck className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base md:text-lg font-bold text-ink">No past rentals</h3>
            <p className="text-xs md:text-sm font-medium text-muted">
              Your rental history will appear here once an order is completed.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
          {pastRentals.map((rental) => {
            const isExpanded = expandedId === rental.id;
            const duration = getRentalDuration(rental);
            const gearSubtotal = getRentalFallbackTotal(rental, duration);
            const crewTotal = getCrewTotal(rental);
            const discountTotal = getDiscountTotal(rental);
            const finalTotal = Number(
              rental.total_amount ?? gearSubtotal + crewTotal - discountTotal,
            );

            return (
              <article
                key={rental.id}
                className={`group card-surface flex flex-col rounded-[2rem] border border-white/60 bg-white/40 p-4 backdrop-blur-xl transition-all duration-300 md:p-5 ${isExpanded ? 'border-line/40 shadow-lg bg-white/60' : 'hover:shadow-md'
                  }`}
              >
                <div
                  className="flex cursor-pointer flex-col select-none"
                  onClick={() => toggleExpand(rental.id)}
                >
                  <div className="mb-3.5 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white bg-white/60 px-3 py-1 shadow-sm backdrop-blur-md">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${['failed', 'cancelled', 'lost', 'closed'].includes(rental.status)
                          ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                          : 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                          }`}
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Rental ID: {rental.rental_no || `#${rental.id.slice(0, 8)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${['failed', 'cancelled', 'lost', 'closed'].includes(rental.status)
                          ? 'text-red-500'
                          : 'text-success'
                          }`}
                      >
                        {['failed', 'lost', 'closed'].includes(rental.status)
                          ? 'Failed'
                          : rental.status === 'cancelled'
                            ? 'Cancelled'
                            : 'Completed'}
                      </span>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-white/50">
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                            }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Pickup
                        </p>
                        <p
                          className={`truncate text-base md:text-lg font-bold leading-tight ${rental.status === 'cancelled'
                            ? 'text-red-500'
                            : rental.status === 'returned' ||
                              (rental.products || []).every(
                                (i: any) => i.status === 'returned',
                              )
                              ? 'text-success'
                              : 'text-ink'
                            }`}
                        >
                          {formatDate(rental.pickup_date)}
                        </p>
                      </div>
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white bg-white/50 text-slate-300 shadow-sm">
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="flex-1 space-y-1 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Return
                        </p>
                        <p
                          className={`truncate text-base md:text-lg font-bold leading-tight ${rental.status === 'cancelled'
                            ? 'text-slate-400'
                            : rental.received_at &&
                              new Date(rental.received_at).setHours(0,0,0,0) > new Date(rental.event_date).setHours(0,0,0,0)
                              ? 'text-red-500'
                              : rental.status === 'returned' ||
                                (rental.products || []).every(
                                  (i: any) => i.status === 'returned',
                                )
                                ? 'text-success'
                                : 'text-ink'
                            }`}
                        >
                          {formatDate(rental.event_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] font-semibold text-slate-500">
                          Duration: {duration} Days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-3">

                    <div className="rounded-xl border border-white bg-white/60 p-3 md:p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Total Units</span>
                        <span className="text-ink">{(rental.products || []).length} Items</span>
                      </div>

                      <div className="border-t border-slate-200/50 pt-2 space-y-1.5 text-xs">
                        <div className="flex justify-between font-semibold text-slate-500">
                          <span>Gear Subtotal</span>
                          <span className="text-ink">{formatCurrency(gearSubtotal)}</span>
                        </div>
                        {crewTotal > 0 && (
                          <div className="flex justify-between font-bold text-indigo-600">
                            <span>Crew Assistance</span>
                            <span>+{formatCurrency(crewTotal)}</span>
                          </div>
                        )}
                        {discountTotal > 0 && (
                          <div className="flex justify-between font-bold text-rose-600">
                            <span>Special Discount</span>
                            <span>-{formatCurrency(discountTotal)}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2.5 flex items-end justify-between border-t border-white/70 pt-2.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                          Total Amount
                        </p>
                        <p className="text-base md:text-lg font-black tracking-tight text-primary">
                          {formatCurrency(finalTotal)}
                        </p>
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
                      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-4 border-t border-slate-200/80 pt-4">
                        <div className="flex items-center justify-between">
                          <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink">
                            <Info className="h-3 w-3 text-primary" />
                            Item Details
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {(rental.products || []).map((item: any, idx: number) => {
                            const quantity = Number(item.qty || 1);
                            const unitPrice = Number(item.price || 0);
                            const itemTotal = getItemTotal(item, duration);

                            return (
                              <div
                                key={idx}
                                className="flex items-start gap-3 rounded-2xl border border-line/20 bg-white/20 p-3 transition-colors hover:bg-white/40"
                              >
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line/40 bg-white/50">
                                  {item.image ? (
                                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-50">
                                      <Camera className="h-4 w-4 text-muted" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                  <p className="line-clamp-1 break-words text-xs md:text-sm font-bold leading-tight text-ink">
                                    {item.name || 'Unknown Product'}
                                  </p>

                                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                                    <span className="inline-flex rounded-md bg-slate-100 px-1.5 py-0.5 font-bold text-slate-500">
                                      {item.unique_code || 'N/A'}
                                    </span>
                                    <span className="text-slate-400 font-medium">
                                      {formatCurrency(unitPrice)}/d × {quantity > 1 ? `${quantity} × ` : ''}{duration}d
                                    </span>
                                  </div>

                                  <div className="pt-1.5 flex items-center justify-between border-t border-slate-200/40 mt-1.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subtotal</span>
                                    <span className="text-xs md:text-sm font-black text-primary">
                                      {formatCurrency(itemTotal)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {rental.assistant_crew_count && rental.assistant_crew_count > 0 ? (
                          <div className="w-auto inline-block self-start rounded-full border border-white bg-white/60 px-3 py-1.5 shadow-sm backdrop-blur-md">
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                              <p className="text-xs md:text-sm font-bold text-indigo-600">
                                Assistant Crew: {rental.assistant_crew_count}{' '}
                                {rental.assistant_crew_count === 1 ? 'Person' : 'People'}
                              </p>
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200/80 pt-2">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 transition-colors">
                            <div className="space-y-1">
                              <div className="mb-2 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                  Released By
                                </p>
                              </div>
                              <p className="text-xs md:text-sm font-bold text-slate-800">
                                {rental.released_by_staff_name || 'Staff Member'}
                              </p>
                              <p className="text-[10px] md:text-xs font-medium text-slate-400">
                                {rental.released_at
                                  ? `${formatDate(rental.released_at)} at ${new Date(
                                    rental.released_at,
                                  ).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}`
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 transition-colors">
                            <div className="space-y-1">
                              <div className="mb-2 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                  Received By
                                </p>
                              </div>
                              <p className="text-xs md:text-sm font-bold text-slate-800">
                                {rental.received_by_staff_name || 'Staff Member'}
                              </p>
                              <p className="text-[10px] md:text-xs font-medium text-slate-400">
                                {rental.received_at
                                  ? `${formatDate(rental.received_at)} at ${new Date(
                                    rental.received_at,
                                  ).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}`
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RentalHistoryTab;
