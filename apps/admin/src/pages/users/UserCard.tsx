import { ShieldCheck, UserRoundCheck, Eye, Ban, Loader2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import { optimizeImageUrl } from '@camera-rental-house/ui';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

type UserCardProps = {
  users: any[];
};

const UserCard = ({ users }: UserCardProps) => (
  <DataTable
    columns={[
      {
        key: 'user',
        label: 'User',
        render: (row) => (
          <div className="flex items-center gap-3">
            {row.avatar_url ? (
              <img
                src={optimizeImageUrl(row.avatar_url)}
                alt={row.full_name}
                loading="lazy"
                className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-sm border border-line"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary-light text-xs font-bold text-ink shadow-sm">
                {row.full_name
                  ?.split(' ')
                  .map((part: string) => part[0])
                  .slice(0, 2)
                  .join('')}
              </span>
            )}
            <p className="font-bold text-ink whitespace-nowrap">{row.full_name}</p>
          </div>
        ),
      },
      {
        key: 'member_id',
        label: 'User ID',
        render: (row) => <span className="font-mono text-xs font-bold text-primary bg-slate-50 px-2 py-1 rounded border border-line">{row.member_id || '-'}</span>,
      },
      {
        key: 'phone',
        label: 'Phone Number',
        render: (row) => <p className="text-sm font-medium text-ink">{row.phone}</p>,
      },
      {
        key: 'totalRentals',
        label: 'Total Rentals',
        render: (row) => <span className="font-bold text-ink">{row.totalRentals}</span>,
      },
      {
        key: 'totalSpent',
        label: 'Total Spent',
        render: (row) => <span className="font-bold text-ink">{formatCurrency(row.totalSpent)}</span>,
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => {
          const hasOverdueRentals = (row.rentals || []).some((rental: any) => {
            const isReleased = rental.status === 'released' || rental.status === 'active';
            const isOverdue = new Date().setHours(0, 0, 0, 0) > new Date(rental.event_date || rental.return_date).setHours(0, 0, 0, 0);
            return isReleased && isOverdue;
          });
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[10px] font-bold tracking-wider ${hasOverdueRentals
                ? 'bg-red-50 text-red-600 border border-red-100'
                : row.is_blocked
                  ? 'bg-danger/10 text-danger'
                  : !row.is_verified
                    ? 'bg-warning/10 text-warning'
                    : 'bg-success/10 text-success'
                }`}
            >
              {hasOverdueRentals ? (
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              ) : row.is_blocked ? (
                <Ban className="h-3.5 w-3.5" />
              ) : !row.is_verified ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" />
              )}
              {hasOverdueRentals
                ? 'Overdue'
                : row.is_blocked
                  ? 'Blocked'
                  : !row.is_verified
                    ? 'Pending'
                    : 'Verified'}
            </span>
          );
        },
      },
      {
        key: 'actions',
        label: 'View Profile',
        render: (row) => (
          <Link
            to={`/users/${row.id}`}
            className="flex h-10 w-fit items-center justify-center rounded-md border border-line bg-white px-4 text-sm font-bold text-ink transition hover:bg-sky-500 hover:text-white hover:border-sky-500 group"
          >
            <Eye className="mr-2 h-4 w-4 text-muted transition group-hover:text-white" />
            View
          </Link>
        ),
      },
    ]}
    rows={users}
    renderMobileCard={(row) => {
      const hasOverdueRentals = (row.rentals || []).some((rental: any) => {
        const isReleased = rental.status === 'released' || rental.status === 'active';
        const isOverdue = new Date().setHours(0, 0, 0, 0) > new Date(rental.event_date || rental.return_date).setHours(0, 0, 0, 0);
        return isReleased && isOverdue;
      });

      return (
        <article key={row.id} className="relative rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 shrink-0">
              {row.avatar_url ? (
                <img src={optimizeImageUrl(row.avatar_url)} alt={row.full_name} loading="lazy" className="h-full w-full rounded-2xl object-cover shadow-sm border border-line" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-base font-black text-indigo-600 shadow-inner border border-white/50">
                  {row.full_name?.split(' ').map((part: string) => part[0]).slice(0, 2).join('')}
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white ${hasOverdueRentals
                ? 'bg-red-500 text-white'
                : row.is_blocked
                  ? 'bg-danger text-white'
                  : !row.is_verified
                    ? 'bg-warning text-white'
                    : 'bg-success text-white'
                }`}>
                {hasOverdueRentals ? (
                  <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
                ) : row.is_blocked ? (
                  <Ban className="h-2.5 w-2.5" />
                ) : !row.is_verified ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                ) : (
                  <ShieldCheck className="h-2.5 w-2.5" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-base font-black text-ink truncate tracking-tight">{row.full_name}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  ID: {row.member_id || '-'}
                </span>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest ${hasOverdueRentals
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : row.is_blocked
                    ? 'bg-danger/10 text-danger'
                    : !row.is_verified
                      ? 'bg-warning/10 text-amber-600'
                      : 'bg-success/10 text-emerald-700'
                  }`}>
                  {hasOverdueRentals ? 'Overdue' : row.is_blocked ? 'Blocked' : !row.is_verified ? 'Pending Review' : 'Verified'}
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-tertiary">
                <Phone className="h-3 w-3 text-sky-500 fill-sky-500/20" />
                <span className="tracking-wide">{row.phone}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 border border-line/60">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Rentals</p>
              <p className="mt-1 text-sm font-black text-ink">{row.totalRentals} <span className="text-[10px] font-bold text-tertiary">Orders</span></p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Spent</p>
              <p className="mt-1 text-sm font-black text-emerald-600">{formatCurrency(row.totalSpent)}</p>
            </div>
          </div>

          <Link
            to={`/users/${row.id}`}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 text-[13px] font-black text-white transition-all hover:bg-slate-800 active:scale-[0.98] shadow-md shadow-ink/10"
          >
            <Eye className="h-4 w-4" />
            View Full Profile
          </Link>
        </article>
      );
    }}
  />
);

export default UserCard;
