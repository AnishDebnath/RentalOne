import { Ban, Loader2, ShieldCheck, UserRound, Hash, History } from 'lucide-react';
import { motion } from 'framer-motion';

type UserDetailHeaderProps = {
  user: any;
  blocked: boolean;
  verified: boolean;
  activeTab: 'details' | 'history';
  setActiveTab: (tab: 'details' | 'history') => void;
};

const UserDetailHeader = ({ user, blocked, verified, activeTab, setActiveTab }: UserDetailHeaderProps) => (
  <div className="flex flex-col gap-5">
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1rem] border border-line shadow-sm relative overflow-hidden"
    >
      <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-4 sm:contents">
          {/* Premium Avatar */}
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                loading="lazy"
                className="h-full w-full rounded-xl object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-inner border border-indigo-100/50">
                <UserRound className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-[3px] border-white text-white shadow-sm ${blocked ? 'bg-rose-500' : !verified ? 'bg-warning' : 'bg-emerald-500'}`}>
              {blocked ? <Ban className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : !verified ? <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" /> : <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
            </div>
          </div>

          {/* Mobile Title Row */}
          <div className="flex-1 min-w-0 sm:hidden">
            <h1 className="text-xl font-black tracking-tight text-ink truncate leading-tight">
              {user.full_name}
            </h1>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border border-line/40 ${blocked ? 'bg-rose-50 text-rose-600' : !verified ? 'bg-warning/10 text-warning' : 'bg-emerald-50 text-emerald-600'}`}>
                {blocked ? <Ban className="h-3 w-3" /> : !verified ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                {blocked ? 'Blocked' : !verified ? 'Review Pending' : 'Verified'}
              </span>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="flex-1 min-w-0 space-y-3 sm:space-y-2">
          <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-ink truncate leading-tight">
                {user.full_name}
              </h1>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border border-line/40 ${blocked ? 'bg-rose-50 text-rose-600' : !verified ? 'bg-warning/10 text-warning' : 'bg-emerald-50 text-emerald-600 border-emerald-100/50'}`}>
                {blocked ? <Ban className="h-3 w-3" /> : !verified ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                {blocked ? 'Blocked' : !verified ? 'Review Pending' : 'Verified'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-0.5">
            {/* Member ID Pill */}
            <div className="flex items-center rounded-xl bg-slate-50 border border-line/60 p-1 shadow-sm cursor-default">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shadow-sm">
                <Hash className="h-3.5 w-3.5" />
              </div>
              <div className="px-3 flex flex-col">
                <span className="text-[9px] font-black text-muted uppercase tracking-widest leading-none mb-0.5">Member ID</span>
                <span className="text-[11px] sm:text-[13px] font-bold text-ink/80 tabular-nums leading-none">{user.member_id || 'PENDING'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher - Integrated at bottom of header card */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6">
        <div className="relative flex h-11 w-full rounded-xl bg-slate-100 p-1 shadow-inner">
          <div
            className="absolute h-9 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm transition-all duration-300 ease-out"
            style={{ transform: `translateX(${activeTab === 'details' ? '0' : '100%'})` }}
          />
          <button
            onClick={() => setActiveTab('details')}
            className={`relative flex flex-1 items-center justify-center gap-2 text-sm font-black transition-colors ${activeTab === 'details' ? 'text-primary' : 'text-muted hover:text-ink'}`}
          >
            <UserRound className="h-4 w-4" />
            User Profile
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`relative flex flex-1 items-center justify-center gap-2 text-sm font-black transition-colors ${activeTab === 'history' ? 'text-primary' : 'text-muted hover:text-ink'}`}
          >
            <History className="h-4 w-4" />
            Rental History
          </button>
        </div>
      </div>
    </motion.section>
  </div>
);

export default UserDetailHeader;
