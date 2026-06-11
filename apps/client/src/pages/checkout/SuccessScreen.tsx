import { motion } from 'framer-motion';
import { CheckCheck, Calendar, RefreshCw, CreditCard, ChevronRight, Home, ReceiptText } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency';

interface SuccessScreenProps {
  pickupDate: Date | null;
  dropDate: Date | null;
  totalCost: number;
  rentalNo?: string;
}

const SuccessScreen = ({ pickupDate, dropDate, totalCost, rentalNo }: SuccessScreenProps) => {
  return (
    <div className="page-animate app-shell pt-2 pb-10 flex flex-col items-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white/40 backdrop-blur-3xl transition-all duration-500 shadow-2xl shadow-black/5 max-w-lg w-full p-6 md:p-10 text-center"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-success/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Success Icon */}
        <div className="relative mx-auto mb-6 h-16 w-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
            className="flex h-full w-full items-center justify-center rounded-full bg-success/10 text-success border border-success/20 relative z-10"
          >
            <CheckCheck className="h-8 w-8" />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-success/10 z-0"
          />
        </div>

        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-ink tracking-tight">Booking Confirmed!</h1>
          <p className="text-sm font-medium text-muted/80 max-w-xs mx-auto leading-relaxed">
            Your premium gear is now reserved. We've sent a confirmation and receipt to your email.
          </p>
        </div>

        {/* Booking ID Badge */}
        <div className="inline-block px-5 py-2.5 rounded-2xl bg-white border border-line/10 shadow-sm mb-8 transition-all hover:border-primary/20">
          <p className="text-xs font-bold uppercase tracking-[0.2em]">
            <span className="text-muted/60">Rental ID:</span>
            <span className="text-primary ml-2">{rentalNo}</span>
          </p>
        </div>

        {/* Summary Card */}
        <div className="w-full rounded-2xl bg-white/60 border border-white shadow-xl shadow-black/5 overflow-hidden text-left mb-8">
          <div className="p-4 grid grid-cols-2 gap-3">
            {/* Pickup */}
            <div className="bg-white/80 p-4 rounded-2xl border border-line/5 shadow-sm space-y-2 transition-all hover:bg-white/95">
              <div className="flex items-center gap-2 text-primary/70">
                <Calendar className="h-3.5 w-3.5" />
                <p className="text-[10px] font-black uppercase tracking-wider">Pickup Date</p>
              </div>
              <div>
                <p className="text-sm font-bold text-ink leading-none">
                  {pickupDate ? format(pickupDate, 'MMM dd, yyyy') : 'N/A'}
                </p>
                <p className="text-[10px] font-medium text-muted/60 mt-1.5 whitespace-nowrap">10:00 AM onwards</p>
              </div>
            </div>

            {/* Return */}
            <div className="bg-white/80 p-4 rounded-2xl border border-line/5 shadow-sm space-y-2 transition-all hover:bg-white/95">
              <div className="flex items-center gap-2 text-primary/70">
                <RefreshCw className="h-3.5 w-3.5" />
                <p className="text-[10px] font-black uppercase tracking-wider">Return Date</p>
              </div>
              <div>
                <p className="text-sm font-bold text-ink leading-none">
                  {dropDate ? format(dropDate, 'MMM dd, yyyy') : 'N/A'}
                </p>
                <p className="text-[10px] font-medium text-muted/60 mt-1.5 whitespace-nowrap">By 12:00 PM</p>
              </div>
            </div>
          </div>
          {/* Divider */}
          <div className="px-4">
            <div className="w-full border-t-2 border-dashed border-line/80" />
          </div>

          <div className="bg-white/40 p-4 md:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Total Amount</p>
            </div>
            <p className="text-[1.5rem] font-bold text-ink tracking-tighter">
              {formatCurrency(totalCost)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/account?tab=active"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white border border-line/10 text-sm font-bold text-ink transition-all hover:bg-page hover:border-primary/20 group"
          >
            <ReceiptText className="h-5 w-5 text-muted group-hover:text-primary transition-colors" />
            Manage Order
          </Link>
          <Link
            to="/"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-white text-sm font-bold transition-all hover:bg-primary-dark shadow-xl shadow-primary/10 group"
          >
            <Home className="h-5 w-5" />
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessScreen;
