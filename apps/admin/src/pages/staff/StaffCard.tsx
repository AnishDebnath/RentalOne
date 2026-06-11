import { Phone, Clock, User, Shield, Activity } from 'lucide-react';

interface StaffCardProps {
  staff: any;
}

const StaffCard = ({ staff }: StaffCardProps) => {
  const loginTime = staff.last_login_at ? new Date(staff.last_login_at).getTime() : 0;
  const logoutTime = staff.last_logout_at ? new Date(staff.last_logout_at).getTime() : 0;
  const isOnline = loginTime > 0 && loginTime > logoutTime;
  const timeToDisplay = isOnline ? staff.last_login_at : staff.last_logout_at;

  return (
    <div className="relative rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header: Name & Username */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-line/60">
        <div className="relative h-14 w-14 shrink-0">
          {staff.avatar_url ? (
            <img src={staff.avatar_url} className="h-full w-full rounded-xl object-cover border-2 border-line shadow-sm" alt="Profile" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-50 text-slate-400 border-2 border-line shadow-sm">
              <User className="h-7 w-7" />
            </div>
          )}
          <div className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-ink leading-tight truncate">{staff.full_name || '---'}</h3>
          <p className="text-sm font-medium text-muted mt-0.5">@{staff.username || '---'}</p>
        </div>
      </div>

      {/* 2x2 Grid with Readability */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-5">
        {/* Phone */}
        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-1">
            <Phone className="h-3 w-3" /> Phone
          </p>
          <p className="text-sm font-bold text-ink truncate">{staff.phone || '---'}</p>
        </div>

        {/* Role */}
        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-1">
            <Shield className="h-3 w-3" /> Role
          </p>
          <div>
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${staff.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
              {staff.role || 'staff'}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-1">
            <Activity className="h-3 w-3" /> Status
          </p>
          <div className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${isOnline
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            : 'bg-slate-50 text-slate-500 border border-slate-100'
            }`}>
            <span className="relative flex h-1.5 w-1.5">
              {isOnline && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
            </span>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>

        {/* Time */}
        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-1">
            <Clock className="h-3 w-3" /> {isOnline ? 'Logged In At' : 'Logged Out At'}
          </p>
          <div className="flex items-center gap-1 text-sm font-bold text-ink">
            {timeToDisplay ? (() => {
              const date = new Date(timeToDisplay);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');
              return (
                <span className="flex items-center gap-1">
                  <span>{day}-{month}-{year}</span>
                  <span className="text-[10px] text-muted/30">|</span>
                  <span className="text-tertiary">{hours}:{minutes}</span>
                </span>
              );
            })() : <span className="text-[10px] text-muted/40 font-medium italic">No Activity</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
