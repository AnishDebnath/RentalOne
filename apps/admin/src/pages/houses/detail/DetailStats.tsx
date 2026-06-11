import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Wallet } from 'lucide-react';

type DetailStatsProps = {
  house: any;
};

const DetailStats = ({ house }: DetailStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Lifetime Card - Dark */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 rounded-[1.5rem] p-6 shadow-lg border border-white/5"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Business</span>
        </div>
        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Lifetime</p>
          <h3 className="text-2xl font-black text-white tabular-nums tracking-tight">
            {house.lifetimeBusiness || '₹0'}
          </h3>
        </div>
      </motion.div>

      {/* Monthly Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-line"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Monthly</span>
        </div>
        <div>
          <p className="text-[11px] font-black text-muted uppercase tracking-wider mb-1">This Month</p>
          <h3 className="text-2xl font-black text-ink tabular-nums tracking-tight">
            {house.thisMonthBusiness || '₹0'}
          </h3>
        </div>
      </motion.div>

      {/* Pending Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-line"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Pending</span>
        </div>
        <div>
          <p className="text-[11px] font-black text-muted uppercase tracking-wider mb-1">Pending Due</p>
          <h3 className="text-2xl font-black text-ink tabular-nums tracking-tight">
            {house.dueAmount || '₹0'}
          </h3>
        </div>
      </motion.div>
    </div>
  );
};

export default DetailStats;
