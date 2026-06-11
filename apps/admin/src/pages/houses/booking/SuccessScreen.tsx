import { motion } from 'framer-motion';
import { CheckCheck, Calendar, RefreshCw, CreditCard, ChevronRight, Home, ReceiptText, Building2 } from 'lucide-react';

interface SuccessScreenProps {
  pickupDate: string;
  dropDate: string;
  totalCost: number;
  rentalNo: string;
  houseName: string;
  itemCount: number;
  onViewRentals: () => void;
  onGoHome: () => void;
}

export const SuccessScreen = ({
  pickupDate,
  dropDate,
  totalCost,
  rentalNo,
  houseName,
  itemCount,
  onViewRentals,
  onGoHome
}: SuccessScreenProps) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 w-full max-w-xl mx-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full relative overflow-hidden rounded-[2.5rem] border border-white bg-white/40 backdrop-blur-3xl p-6 md:p-10 text-center shadow-2xl shadow-black/5"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Success Tick Badge */}
        <div className="relative mx-auto mb-6 h-16 w-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
            className="flex h-full w-full items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 shadow-sm relative z-10"
          >
            <CheckCheck className="h-8 w-8" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-emerald-500/10 z-0"
          />
        </div>

        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-black text-ink tracking-tight">Rental Order Placed!</h1>
          <p className="text-[12px] font-bold text-muted uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
            Reserved successfully for <span className="text-primary font-black">{houseName}</span>
          </p>
        </div>

        {/* Order Number Card */}
        <div className="inline-block px-5 py-2.5 rounded-2xl bg-white border border-line/60 shadow-sm mb-8">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">
            <span className="text-muted/70">Order ID:</span>
            <span className="text-primary ml-2">{rentalNo}</span>
          </p>
        </div>

        {/* Info Grid */}
        <div className="w-full rounded-3xl bg-white/70 border border-white shadow-xl shadow-black/5 overflow-hidden text-left mb-8">
          <div className="p-4 grid grid-cols-2 gap-3.5">
            {/* Pickup */}
            <div className="bg-white/80 p-4 rounded-2xl border border-line/40 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-primary/70">
                <Calendar className="h-3.5 w-3.5" />
                <p className="text-[10px] font-black uppercase tracking-wider">Pickup Date</p>
              </div>
              <div>
                <p className="text-sm font-black text-ink leading-none">
                  {formatDate(pickupDate)}
                </p>
                <p className="text-[10px] font-bold text-muted mt-1.5 whitespace-nowrap uppercase tracking-wider">10:00 AM onwards</p>
              </div>
            </div>

            {/* Return */}
            <div className="bg-white/80 p-4 rounded-2xl border border-line/40 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-primary/70">
                <RefreshCw className="h-3.5 w-3.5" />
                <p className="text-[10px] font-black uppercase tracking-wider">Return Date</p>
              </div>
              <div>
                <p className="text-sm font-black text-ink leading-none">
                  {formatDate(dropDate)}
                </p>
                <p className="text-[10px] font-bold text-muted mt-1.5 whitespace-nowrap uppercase tracking-wider">By 12:00 PM</p>
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="w-full border-t border-dashed border-line/80" />
          </div>

          {/* Pricing Details */}
          <div className="bg-slate-50/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest leading-none">Total Amount</span>
                <span className="text-[11px] font-bold text-ink mt-1.5 leading-none">{itemCount} items reserved</span>
              </div>
            </div>
            <p className="text-xl font-black text-primary tracking-tight">
              {formatCurrency(totalCost)}
            </p>
          </div>
        </div>

        {/* Action Button Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={onViewRentals}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white border border-line text-sm font-black text-ink uppercase tracking-wider transition-all hover:bg-slate-50 hover:border-primary/20 active:scale-[0.98]"
          >
            <ReceiptText className="h-5 w-5 text-muted" />
            View Rentals
          </button>
          <button
            onClick={onGoHome}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white text-sm font-black uppercase tracking-wider transition-all hover:bg-emerald-600 active:scale-[0.98] shadow-lg shadow-slate-900/10"
          >
            <Home className="h-5 w-5" />
            Return Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};
