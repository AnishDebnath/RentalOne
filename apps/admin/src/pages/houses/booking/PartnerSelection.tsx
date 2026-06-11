import { Building2, ShieldCheck, Loader2, UserRound, Phone, House } from 'lucide-react';

interface PartnerSelectionProps {
  selectedHouse: any;
}

export const PartnerSelection = ({ selectedHouse }: PartnerSelectionProps) => {
  if (!selectedHouse) return null;

  return (
    <section>
      <div className="card-surface p-6 overflow-hidden relative">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
          <div className="flex flex-row sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative h-16 w-16 shrink-0">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-sm border border-indigo-100/50">
                <Building2 className="h-8 w-8" />
              </div>
              <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-sm ${selectedHouse.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                {selectedHouse.status === 'Active' ? <ShieldCheck className="h-3 w-3 text-white" /> : <Loader2 className="h-3 w-3 text-white animate-spin" />}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black text-ink tracking-tight">{selectedHouse.name}</h3>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-bold text-ink/80">
                <div className="flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5 text-indigo-500/60" />
                  <span>{selectedHouse.owner_name || selectedHouse.ownerName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-sky-500/60" />
                  <span>{selectedHouse.phone}</span>
                </div>
                {selectedHouse.users?.member_id && (
                  <div className="flex items-center gap-1.5">
                    <House className="h-3.5 w-3.5 text-indigo-500/60" />
                    <span className="font-mono text-primary font-black">{selectedHouse.users.member_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
