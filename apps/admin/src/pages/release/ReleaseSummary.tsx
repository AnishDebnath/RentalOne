import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowLeft, PackageCheck, UserCheck, Image as ImageIcon, ChevronRight, AlertCircle, UserPlus } from 'lucide-react';

interface Props {
  allProductsScanned: boolean;
  isUserVerified: boolean;
  hasProofPhoto: boolean;
  representativeName?: string;
  isHouseBooking?: boolean;
  onRelease: () => void;
  onReset: () => void;
}

const ReleaseSummary = ({
  allProductsScanned,
  isUserVerified,
  hasProofPhoto,
  representativeName,
  isHouseBooking,
  onRelease,
  onReset,
}: Props) => {
  const hasRep = isHouseBooking ? !!representativeName?.trim() : true;

  const checklist = [
    { label: 'Products Verified', status: allProductsScanned, icon: PackageCheck, color: 'sky' },
    { label: 'Identity Matched', status: isUserVerified, icon: UserCheck, color: 'purple' },
  ];

  if (isHouseBooking) {
    checklist.push({ label: 'Handover Person', status: hasRep, icon: UserPlus, color: 'blue' });
  }

  checklist.push({ label: 'Photo Evidence', status: hasProofPhoto, icon: ImageIcon, color: 'orange' });

  const allDone = allProductsScanned && isUserVerified && hasProofPhoto;

  return (
    <div className="space-y-5">
      <div className="card-surface p-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-slate-50 blur-2xl" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-tertiary">Process Status</h4>
            {allDone && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100"
              >
                Ready
              </motion.span>
            )}
          </div>

          <div className="space-y-3">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                className={`group flex items-center justify-between rounded-xl border p-3 transition-all duration-300 ${item.status
                  ? 'border-emerald-100 bg-emerald-50/20'
                  : 'border-line bg-white shadow-sm'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${item.status ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-muted group-hover:bg-slate-100'
                    }`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className={`text-xs font-bold tracking-tight transition-colors ${item.status ? 'text-ink' : 'text-muted'
                      }`}>
                      {item.label}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {item.status ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600"
                    >
                      Success
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pending"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400"
                    >
                      Pending
                      <div className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-300 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-200"></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          disabled={!allDone}
          onClick={onRelease}
          className={`relative group flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl h-14 text-sm font-black uppercase tracking-widest transition-all duration-500 ${allDone
            ? 'bg-ink text-white shadow-xl hover:shadow-2xl hover:bg-slate-900 active:scale-[0.98]'
            : 'bg-slate-100 text-muted cursor-not-allowed opacity-60'
            }`}
        >
          {allDone && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />
          )}
          Release Equipment
          <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${allDone ? 'group-hover:translate-x-1' : ''}`} />
        </button>

        {!allDone && (
          <div className="flex items-center justify-center gap-2 px-4 text-center">
            <AlertCircle className="h-3 w-3 text-tertiary" />
            <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider">
              Complete all steps to proceed
            </p>
          </div>
        )}

        <button
          onClick={onReset}
          className="flex w-full items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-muted hover:text-rose-500 transition-all duration-300 active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Cancel & Reset
        </button>
      </div>
    </div>
  );
};

export default ReleaseSummary;
