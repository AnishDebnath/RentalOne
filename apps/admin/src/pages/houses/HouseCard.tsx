import { useState, useRef, useEffect } from 'react';
import { Building2, PlusCircle, ChevronRight, Wallet, TrendingUp, ShieldCheck, Loader2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import VirtualizedDataTable from '../../components/ui/VirtualizedDataTable';
import HouseSkeleton from './HouseSkeleton';

const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

type HouseCardProps = {
  houses: any[];
  isLoading?: boolean;
};

const HouseCard = ({ houses, isLoading }: HouseCardProps) => {
  if (isLoading) {
    return <HouseSkeleton />;
  }

  if (!isLoading && houses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-slate-50/50 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white shadow-card border border-line/60 mb-6">
          <Building2 className="h-10 w-10 text-muted/20" />
        </div>
        <h3 className="text-xl font-black text-ink">No Houses Found</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm font-medium text-muted leading-relaxed">
          There are no production houses registered in the system yet. Start by adding your first partner.
        </p>
      </div>
    );
  }
  const columns = [
    {
      key: 'house',
      label: 'Production House',
      className: 'min-w-[280px]',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-inner border border-indigo-100/50">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight whitespace-nowrap">{row.name}</p>
            <p className="text-[11px] font-semibold text-muted/60 tracking-wide uppercase mt-0.5">{row.owner_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'house_id',
      label: 'House ID',
      className: 'min-w-[120px]',
      render: (row) => <span className="font-mono text-xs font-bold text-primary bg-slate-50 px-2 py-1 rounded border border-line whitespace-nowrap">{row.house_id || '-'}</span>,
    },
    {
      key: 'contact',
      label: 'Contact No.',
      render: (row: any) => (
        <p className="text-sm font-medium text-ink">{row.phone}</p>
      ),
    },
    {
      key: 'thisMonthBusiness',
      label: 'This Month',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-success" />
          <span className="font-bold text-ink">{row.thisMonthBusiness}</span>
        </div>
      ),
    },
    {
      key: 'dueAmount',
      label: 'Due Amount',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Wallet className="h-3.5 w-3.5 text-danger" />
          <span className={`font-bold ${(row.dueAmount === '₹0' || !row.dueAmount) ? 'text-ink' : 'text-danger'}`}>
            {row.dueAmount}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Rental Status',
      render: (row: any) => {
        const rentalStatus = row.rentalStatus || (row.hasActiveRental ? 'active' : 'no-rental');
        let badgeClass = 'bg-slate-50 text-slate-500 border border-slate-200';
        let dotClass = 'bg-slate-400';
        let label = 'No Rental';

        if (rentalStatus === 'overdue') {
          badgeClass = 'bg-red-50 text-red-600 border border-red-200';
          dotClass = 'bg-red-500 animate-pulse';
          label = 'Overdue';
        } else if (rentalStatus === 'active') {
          badgeClass = 'bg-emerald-50 text-emerald-600 border border-emerald-200';
          dotClass = 'bg-emerald-500 animate-pulse';
          label = 'Active';
        }

        return (
          <span className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-[10px] font-bold tracking-wider ${badgeClass}`}>
            <div className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
            {label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/houses/${slugify(row.name)}/booking`}
            className="flex h-10 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/5 px-4 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Book
          </Link>
          <Link
            to={`/houses/${slugify(row.name)}`}
            className="flex h-10 items-center justify-center rounded-md border border-line bg-white px-4 text-xs font-bold text-ink transition hover:bg-sky-500 hover:text-white hover:border-sky-500 group"
          >
            View
            <ChevronRight className="ml-1.5 h-4 w-4 text-muted transition group-hover:text-white" />
          </Link>
        </div>
      ),
    },
  ];

  const [visibleCount, setVisibleCount] = useState(0);
  const hasStaggeredRef = useRef(false);

  useEffect(() => {
    if (hasStaggeredRef.current) {
      setVisibleCount(houses.length);
      return;
    }
    hasStaggeredRef.current = true;
    setVisibleCount(1);
    if (houses.length <= 1) return;
    const targetTicks = Math.min(houses.length, 25);
    const batchSize = Math.ceil(houses.length / targetTicks);
    const delay = Math.max(60, Math.min(250, Math.floor(2000 / targetTicks)));
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        const next = Math.min(prev + batchSize, houses.length);
        if (next >= houses.length) {
          clearInterval(timer);
          return houses.length;
        }
        return next;
      });
    }, delay);
    return () => clearInterval(timer);
  }, [houses.length]);

  const TableComponent = houses.length > 150 ? VirtualizedDataTable : DataTable;

  return (
    <div className="card-surface overflow-hidden">
      <TableComponent
        columns={columns}
        rows={houses}
        visibleCount={visibleCount}
        renderMobileCard={(row) => (
          <article key={row.id} className="relative rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 shrink-0">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-inner border border-white/50">
                  <Building2 className="h-7 w-7" />
                </div>
                <div className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white ${row.status === 'Active' ? 'bg-success text-white' : 'bg-warning text-white'
                  }`}>
                  {row.status === 'Active' ? <ShieldCheck className="h-2.5 w-2.5" /> : <Loader2 className="h-2.5 w-2.5 animate-spin" />}
                </div>
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-base font-black text-ink truncate tracking-tight">{row.name}</h3>
                <p className="text-[11px] font-semibold text-muted/60 tracking-wide uppercase mt-0.5">{row.owner_name}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-indigo-600 border border-indigo-100/50">
                    ID: {row.house_id}
                  </span>
                  {(() => {
                    const rentalStatus = row.rentalStatus || (row.hasActiveRental ? 'active' : 'no-rental');
                    let badgeClass = 'bg-slate-50 text-slate-500 border-slate-100';
                    let dotClass = 'bg-slate-400';
                    let label = 'No Rental';

                    if (rentalStatus === 'overdue') {
                      badgeClass = 'bg-red-50 text-red-600 border-red-100';
                      dotClass = 'bg-red-500 animate-pulse';
                      label = 'Overdue';
                    } else if (rentalStatus === 'active') {
                      badgeClass = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                      dotClass = 'bg-emerald-500 animate-pulse';
                      label = 'Active';
                    }

                    return (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${badgeClass}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                        {label}
                      </span>
                    );
                  })()}
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-tertiary">
                  <Phone className="h-3 w-3 text-sky-500 fill-sky-500/20" />
                  <span className="tracking-wide">{row.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 border border-line/60">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">This Month</p>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                  <p className="text-sm font-black text-ink">{row.thisMonthBusiness || '₹0'}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-right items-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Due Amount</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <Wallet className="h-3.5 w-3.5 text-danger" />
                  <p className={`text-sm font-black ${(row.dueAmount === '₹0' || !row.dueAmount) ? 'text-ink' : 'text-danger'}`}>{row.dueAmount || '₹0'}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <Link
                to={`/houses/${slugify(row.name)}/booking`}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-[13px] font-black uppercase tracking-wide text-emerald-600 transition-all active:scale-[0.98]"
              >
                <PlusCircle className="h-4 w-4" />
                Book
              </Link>
              <Link
                to={`/houses/${slugify(row.name)}`}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white text-[13px] font-black uppercase tracking-wide text-ink transition-all active:scale-[0.98]"
              >
                Details
                <ChevronRight className="h-4 w-4 opacity-60" />
              </Link>
            </div>
          </article>
        )}
      />
    </div>
  );
};

export default HouseCard;
