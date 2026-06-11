import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, ChevronLeft } from 'lucide-react';
import formatCurrency from '../../utils/formatCurrency';
import LoadingButton from '../../components/ui/LoadingButton';

interface OrderSummaryStepProps {
  items: any[];
  totalDays: number;
  subtotal: number;
  totalCost: number;
  calculateItemPrice: (item: any, days: number) => number;
  loading: boolean;
  onPrev: () => void;
  onConfirm: () => void;
  disabled?: boolean;
  assistantCount?: number;
}

const OrderSummaryStep = ({ items, totalDays, subtotal, totalCost, calculateItemPrice, loading, onPrev, onConfirm, disabled, assistantCount }: OrderSummaryStepProps) => {
  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
        {/* Item List */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/50 p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink">Gear Selected</h2>
              <p className="text-xs text-muted font-medium">{items.length} premium items in your batch.</p>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-[1.2rem] border border-white bg-white/60 transition-all duration-300 hover:shadow-md">
                <img
                  src={item.images?.[0]?.image_url}
                  alt={item.name}
                  className="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover shrink-0 border border-line/50 shadow-sm"
                />
                <div className="flex-1 py-1">
                  <p className="text-sm font-bold text-ink line-clamp-1">{item.name}</p>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1 opacity-60">{item.brand} • {item.category}</p>

                  <div className="mt-4 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-muted tracking-tight">
                      <span>{formatCurrency(item.price_per_day)} / Per Day</span>
                      <span className="opacity-60">× {totalDays} Days</span>
                    </div>
                    <div className="h-px bg-line/20 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Total Price</span>
                      <span className="text-sm font-bold text-ink">
                        {formatCurrency(calculateItemPrice(item, totalDays))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Calculation */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/50 p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 shadow-sm space-y-8 lg:sticky lg:top-28">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary mb-2">
              <CreditCard className="h-5 w-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Payment Summary</h3>
            </div>

            <div className="space-y-4 px-4">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold text-muted tracking-widest">Total Items</span>
                <span className="text-sm font-bold text-ink">x{items.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold text-muted tracking-widest">Rent Duration</span>
                <span className="text-sm font-bold text-ink">{totalDays} Days</span>
              </div>
              {assistantCount !== undefined && assistantCount > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-bold text-muted tracking-widest">Assistant Crew</span>
                    <span className="text-sm font-bold text-ink">{assistantCount} {assistantCount === 1 ? 'Person' : 'People'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-bold text-muted tracking-widest">Crew Cost</span>
                    <span className="text-sm font-bold text-ink/60">
                      Contact House
                    </span>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold text-muted tracking-widest">Base Daily Rate</span>
                <span className="text-sm font-bold text-ink">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-line">
              <div className="bg-white p-4 rounded-2xl   shadow-inner flex justify-between items-center transition-all hover:shadow-md">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Total Amount</p>
                  <p className="text-sm font-bold text-ink/60">Net Payable</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-ink tracking-tighter leading-none">
                    {formatCurrency(totalCost)}
                  </p>
                  <p className="text-[9px] font-bold text-success uppercase tracking-widest mt-1.5">
                    All Included
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <LoadingButton
              loading={loading}
              onClick={onConfirm}
              disabled={disabled}
              className="!h-14 !text-sm !font-bold !rounded-2xl shadow-xl shadow-primary/20"
            >
              Confirm & Reserve Rent
            </LoadingButton>
            <button
              onClick={onPrev}
              className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-muted hover:text-primary uppercase tracking-widest transition-all duration-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default OrderSummaryStep;
