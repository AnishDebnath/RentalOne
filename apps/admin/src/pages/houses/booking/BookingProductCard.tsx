import React from 'react';
import { Package, Plus, Check, ShoppingBag, CalendarX, Calendar } from 'lucide-react';
import { BRAND_ICONS, CATEGORY_ICONS } from '@camera-rental-house/shared';
import { useToast } from '@camera-rental-house/ui';

interface BookingProductCardProps {
  product: any;
  isInCart: boolean;
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  hasDatesSelected: boolean;
  onSelectDatesClick?: () => void;
}

export const BookingProductCard = ({
  product,
  isInCart,
  addToCart,
  removeFromCart,
  hasDatesSelected,
  onSelectDatesClick
}: BookingProductCardProps) => {
  const { addToast } = useToast();

  const baseStatus = product.booking_status || (product.available_quantity > 0 ? 'available' : 'out_of_stock');
  // out_of_stock and on_rent bypass date gate — always shown; booked requires dates
  const status = (baseStatus === 'out_of_stock' || baseStatus === 'on_rent') ? baseStatus : (!hasDatesSelected ? 'select_dates' : baseStatus);
  const isUnavailable = status === 'out_of_stock' || status === 'booked' || status === 'on_rent';
  const isDisabled = isUnavailable && !isInCart;

  const handleRentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'select_dates') {
      addToast({
        title: 'Select Rental Dates',
        message: 'Please choose pick-up and return dates first.',
        tone: 'warning'
      });
      if (onSelectDatesClick) {
        onSelectDatesClick();
      }
      const element = document.getElementById('date-picker-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (status === 'available') {
      if (isInCart) {
        removeFromCart(product.id);
      } else {
        addToCart(product);
      }
    }
  };

  const badgeClass =
    status === 'out_of_stock'
      ? 'bg-rose-50 text-rose-600 border border-rose-100'
      : status === 'on_rent'
        ? 'bg-amber-50 text-amber-600 border border-amber-100'
        : status === 'booked'
          ? 'bg-sky-50 text-sky-600 border border-sky-100'
          : status === 'select_dates'
            ? 'bg-slate-100 text-slate-500 border border-slate-200'
            : 'bg-emerald-50 text-emerald-600 border border-emerald-100';

  const badgeText =
    status === 'out_of_stock'
      ? 'Out of Stock'
      : status === 'on_rent'
        ? 'On Rent'
        : status === 'booked'
          ? 'Booked'
          : status === 'select_dates'
            ? 'Select Dates'
            : 'In Stock';

  const buttonClass = status === 'out_of_stock'
    ? 'bg-rose-50/50 text-rose-400 border border-rose-100/50 cursor-not-allowed'
    : status === 'on_rent'
      ? 'bg-amber-50/50 text-amber-500 border border-amber-100 cursor-not-allowed'
      : status === 'booked'
        ? 'bg-sky-50/50 text-sky-500 border border-sky-100 cursor-not-allowed'
        : status === 'select_dates'
          ? 'bg-slate-100/60 text-slate-600 border border-line hover:bg-slate-200/50 hover:border-slate-300/80 cursor-pointer'
          : isInCart
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105';

  const buttonText = status === 'out_of_stock'
    ? 'Out of Stock'
    : status === 'on_rent'
      ? 'On Rent'
      : status === 'booked'
        ? 'Booked'
        : status === 'select_dates'
          ? 'Select Dates'
          : isInCart
            ? 'Added in Cart'
            : 'Add to Rent';

  return (
    <div className="group relative flex flex-col rounded-2xl border border-line bg-white transition-all duration-300 hover:border-primary/20 hover:shadow-xl">
      <div className="flex gap-4 p-4">
        {/* Image Section */}
        <div className="relative h-20 w-20 shrink-0">
          <div className="h-full w-full overflow-hidden rounded-xl border border-line bg-slate-50">
            <img src={product.image} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.name} />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-sm font-black text-ink line-clamp-2 tracking-tight min-h-[2.5rem]">{product.name}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              ID: {product.unique_code}
            </span>
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest ${badgeClass}`}>
              {badgeText}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-50 border border-line p-0.5">
                {CATEGORY_ICONS[product.category] && <img src={CATEGORY_ICONS[product.category]} alt="" className="h-full w-full object-contain" />}
              </div>
              <span className="text-[11px] font-medium text-muted truncate">{product.category}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white border border-line p-0.5">
                {BRAND_ICONS[product.brand] && <img src={BRAND_ICONS[product.brand]} alt="" className="h-full w-full object-contain" />}
              </div>
              <span className="text-[11px] font-bold text-ink truncate">{product.brand}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-[1px] bg-line/50" />

      {/* Footer Section */}
      <div className="mt-auto p-4 pt-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-muted uppercase tracking-widest">Price per day</span>
          <p className="text-sm font-black text-primary">₹{product.price_per_day}</p>
        </div>
        <button
          onClick={handleRentClick}
          disabled={isDisabled}
          className={`group/btn flex h-8 px-3 items-center gap-1.5 rounded-lg transition-all active:scale-[0.98] ${buttonClass} text-[10px] font-black uppercase tracking-widest`}
        >
          {status === 'out_of_stock' ? (
            <ShoppingBag className="h-3.5 w-3.5" />
          ) : (status === 'booked' || status === 'on_rent') ? (
            <CalendarX className="h-3.5 w-3.5" />
          ) : status === 'select_dates' ? (
            <Calendar className="h-3.5 w-3.5" />
          ) : isInCart ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Plus className="h-3.5 w-3.5 transition-transform group-hover/btn:rotate-90" />
          )}
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
};
