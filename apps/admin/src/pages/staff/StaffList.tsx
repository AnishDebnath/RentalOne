import { Phone, User, Clock } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StaffCard from './StaffCard';

interface StaffListProps {
  staff: any[];
}

const StaffList = ({ staff = [] }: StaffListProps) => {
  const columns = [
    {
      key: 'member',
      label: 'Member',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0">
            {row.avatar_url ? (
              <img src={row.avatar_url} className="h-full w-full rounded-md object-cover border border-line" alt="Profile" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-100 text-slate-400 border border-line">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-ink">{row.full_name || '---'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'username',
      label: 'Username',
      render: (row: any) => <span className="text-sm font-medium text-muted">@{row.username || '---'}</span>,
    },
    {
      key: 'phone',
      label: 'Phone Number',
      render: (row: any) => (
        <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
          <Phone className="h-3.5 w-3.5 text-muted" />
          {row.phone || '---'}
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row: any) => (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${row.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
          {row.role || 'staff'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Active Status',
      render: (row: any) => {
        const loginTime = row.last_login_at ? new Date(row.last_login_at).getTime() : 0;
        const logoutTime = row.last_logout_at ? new Date(row.last_logout_at).getTime() : 0;
        const isOnline = loginTime > 0 && loginTime > logoutTime;

        return (
          <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-bold ${isOnline
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
        );
      }
    },
    {
      key: 'last_active',
      label: 'Last Activity',
      render: (row: any) => {
        const loginTime = row.last_login_at ? new Date(row.last_login_at).getTime() : 0;
        const logoutTime = row.last_logout_at ? new Date(row.last_logout_at).getTime() : 0;
        const isOnline = loginTime > 0 && loginTime > logoutTime;
        const timeToDisplay = isOnline ? row.last_login_at : row.last_logout_at;

        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black uppercase text-muted/60 tracking-tighter">
              {isOnline ? 'Currently Logged In At' : 'Last Logged Out At'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted font-bold">
              <Clock className="h-3.5 w-3.5" />
              {timeToDisplay ? (() => {
                const date = new Date(timeToDisplay);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return (
                  <span className="flex items-center gap-1.5">
                    <span>{day}-{month}-{year}</span>
                    <span className="text-[8px] text-muted/50">|</span>
                    <span className="text-tertiary">{hours}:{minutes}</span>
                  </span>
                );
              })() : <span className="italic text-muted/40 font-medium">No activity recorded</span>}
            </div>
          </div>
        );
      }
    },
  ];

  const renderMobileCard = (row: any) => <StaffCard key={row.id} staff={row} />;

  return (
    <DataTable
      columns={columns}
      rows={staff}
      renderMobileCard={renderMobileCard}
    />
  );
};

export default StaffList;
