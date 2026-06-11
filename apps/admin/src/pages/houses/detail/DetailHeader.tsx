import { useNavigate, Link } from 'react-router-dom';
import { Building2, ShieldCheck, UserRound, Phone, Hash, ArrowLeft, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type DetailHeaderProps = {
  house: any;
  activeTab: 'details' | 'credentials';
  setActiveTab: (tab: 'details' | 'credentials') => void;
};

const DetailHeader = ({ house, activeTab, setActiveTab }: DetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Profile Header */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[1rem] border border-line shadow-sm relative overflow-hidden"
      >
        <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-4 sm:contents">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0">
              <div className="relative flex h-full w-full items-center justify-center rounded-lg sm:rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-inner border border-indigo-100/50">
                <Building2 className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 text-white shadow-sm">
                <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
            </div>

            <div className="flex-1 min-w-0 sm:hidden">
              <h1 className="text-xl font-black tracking-tight text-ink truncate leading-tight">
                {house.name}
              </h1>
              <div className="mt-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100/50">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3 sm:space-y-1.5">
            <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-ink truncate leading-tight">
                  {house.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100/50">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <div className="flex items-center rounded-xl bg-white border border-line/60 p-1 shadow-sm cursor-default">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <UserRound className="h-3.5 w-3.5" />
                </div>
                <span className="px-3 text-[11px] sm:text-[13px] font-bold text-ink/80">{house.owner_name}</span>
              </div>

              <div className="flex items-center rounded-xl bg-white border border-line/60 p-1 shadow-sm cursor-default">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span className="px-3 text-[11px] sm:text-[13px] font-bold text-ink/80 tabular-nums">{house.phone}</span>
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
              <Building2 className="h-4 w-4" />
              House Details
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`relative flex flex-1 items-center justify-center gap-2 text-sm font-black transition-colors ${activeTab === 'credentials' ? 'text-primary' : 'text-muted hover:text-ink'}`}
            >
              <UserRound className="h-4 w-4" />
              Owner Login
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default DetailHeader;
