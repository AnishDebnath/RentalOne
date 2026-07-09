import { ShoppingBag, Trash2, ArrowRight, Plus, Calendar, AlertCircle, CalendarX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState';
import { useCart } from '../../store/CartContext';
import formatCurrency from '../../utils/formatCurrency';
import Footer from '../../components/common/footer/Footer';
import { BRAND_ICONS, CATEGORY_ICONS } from '@rentalone/shared';
import { format, parseISO } from 'date-fns';

const Cart = () => {
  const navigate = useNavigate();
  const { items, subtotal, removeFromCart } = useCart();

  const hasUnavailableItems = items.some((item) => item.booking_status !== 'available');

  const uniqueDateRanges = Array.from(
    new Set(
      items.map(item =>
        `${format(parseISO(item.pickup_date), 'yyyy-MM-dd')}_${format(parseISO(item.drop_date), 'yyyy-MM-dd')}`
      )
    )
  );

  const hasDifferentDates = uniqueDateRanges.length > 1;

  return (
    <div className="page-animate space-y-10 md:space-y-12">
      <div className="app-shell pt-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-ink px-4">My Rent Cart</h1>
            </div>
            <p className="rounded-[100px] bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>

          {items.length ? (
            <>
              <div className="flex flex-col gap-3 md:gap-4 px-2 md:px-0">
                {items.map((item) => (
                  <article key={item.id} className="group relative flex items-center gap-3 md:gap-4 rounded-[1.5rem] md:rounded-[2rem] border border-white/60 bg-white/40 p-3.5 backdrop-blur-xl transition-all duration-300 hover:bg-white/60 hover:shadow-sm">
                    <Link
                      to={`/product/${item.id}`}
                      className="flex flex-1 items-center gap-3 md:gap-4 cursor-pointer min-w-0"
                    >
                      <div className="h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-[1rem] md:rounded-[1.2rem] border border-white shadow-sm bg-white/50 transition-transform group-hover:scale-[1.02]">
                        <img src={item.images?.[0]?.image_url} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          <span className="flex items-center gap-1">
                            {item.category && (
                              <img
                                src={CATEGORY_ICONS[item.category] || CATEGORY_ICONS[item.category.endsWith('s') ? item.category : `${item.category}s`]}
                                alt=""
                                className="h-3 w-3 object-contain"
                              />
                            )}
                            {item.category}
                          </span>
                          <span className="opacity-40">•</span>
                          <span className="flex items-center gap-1">
                            {item.brand && (
                              <img
                                src={BRAND_ICONS[item.brand] || BRAND_ICONS[Object.keys(BRAND_ICONS).find(k => k.toLowerCase() === item.brand?.toLowerCase()) || '']}
                                alt=""
                                className="h-3 w-3 object-contain"
                              />
                            )}
                            {item.brand}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <h3 className="text-xs md:text-sm font-extrabold text-ink leading-tight line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                          {item.booking_status === 'out_of_stock' && (
                            <span className="shrink-0 text-[8px] font-black text-danger bg-danger/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-danger/20">
                              Out of Stock
                            </span>
                          )}
                          {item.booking_status === 'booked' && (
                            <span className="shrink-0 text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-200">
                              Booked on Dates
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none pt-0.5">
                          <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="text-ink font-extrabold">{format(parseISO(item.pickup_date), 'MMM d')} - {format(parseISO(item.drop_date), 'MMM d, yyyy')}</span>
                        </div>

                        <div className="flex items-baseline gap-1 pt-0.5">
                          <span className="text-sm md:text-base font-extrabold tracking-tight text-primary">
                            {formatCurrency(item.price_per_day)}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 tracking-wider">/ Per Day</span>
                        </div>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="relative z-10 flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger transition-all hover:bg-danger hover:text-white mr-1 active:scale-95 shadow-sm"
                      title="Remove from cart"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 px-2 md:px-0">
                {/* Date Mismatches/Warnings */}
                {hasDifferentDates && (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 shadow-sm">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-amber-900">Rental Period Mismatch</p>
                      <p className="text-xs font-medium text-amber-700 leading-relaxed">
                        Items in your cart have different rental dates. If renting on different dates, please rent them separately.
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Summary Card */}
                <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white/40 p-6 md:p-8 backdrop-blur-xl transition-all duration-300">
                  {/* Decorative background element */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />

                  <div className="relative space-y-8">
                    {/* Top Row: Unit & Price */}
                    <div className="flex items-center justify-between border-b border-line pb-5">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Items Ordered</p>
                        <p className="text-sm md:text-base font-bold text-ink">{items.length} Items</p>
                      </div>

                      <div className="text-right space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary/60">Total Amount</p>
                        <p className="text-xl md:text-2xl font-bold tracking-tight text-primary leading-none">
                          {formatCurrency(subtotal)}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to="/category"
                        className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/50 py-4 text-sm font-bold text-ink border border-line transition-all hover:bg-white/80 hover:scale-[1.01] active:scale-[0.98]"
                      >
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                        Add More Gear
                      </Link>
                      <button
                        type="button"
                        onClick={() => navigate('/checkout')}
                        disabled={hasUnavailableItems || hasDifferentDates}
                        className={`primary-button group flex-[1.5] py-4 shadow-xl ring-1 ring-white/20 transition-all ${hasUnavailableItems || hasDifferentDates
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none ring-0'
                          : 'shadow-primary/20'
                          }`}
                      >
                        {hasUnavailableItems ? 'Remove Unavailable Items' : 'Proceed to Rent'}
                        {!(hasUnavailableItems || hasDifferentDates) && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="Your rent cart is empty"
              message="Start with cameras, lenses, and production accessories tailored for your next shoot."
              actionLabel="Explore Category"
              actionTo="/category"
              icon={<ShoppingBag className="h-8 w-8" />}
            />
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
