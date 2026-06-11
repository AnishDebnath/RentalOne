import { Loader2, Pencil, Trash2, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import { BRAND_ICONS, CATEGORY_ICONS } from '@camera-rental-house/shared';

type ProductCardProps = {
  rows: any[];
  isLoading: boolean;
  loadingQrId: string | null;
  handleShowQr: (row: any) => void;
  handleDelete: (row: any) => void;
  formatCurrency: (value: number) => string;
};

const ProductCard = ({
  rows,
  isLoading,
  loadingQrId,
  handleShowQr,
  handleDelete,
  formatCurrency,
}: ProductCardProps) => {
  if (isLoading && rows.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-card bg-white/50 border border-line">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DataTable
      columns={[
        {
          key: 'name',
          label: 'Product',
          render: (row) => (
            <div className="flex items-center gap-2 py-1 max-w-[240px]">
              <img src={row.image} alt={row.name} className="h-12 w-12 shrink-0 rounded-xl object-cover border border-line" />
              <p className="font-bold text-ink leading-snug line-clamp-2 min-h-[2.5rem]">{row.name}</p>
            </div>
          ),
        },
        {
          key: 'unique_code',
          label: 'Product Code',
          render: (row) => (
            <div className="flex flex-col gap-1">
              <span className="font-mono text-sm font-bold text-primary"><span className="text-tertiary">ID:</span> {row.unique_code}</span>
              <button
                type="button"
                onClick={() => handleShowQr(row)}
                disabled={loadingQrId === row.id}
                className="flex h-7 w-fit items-center justify-center rounded-md border border-line bg-slate-50 px-2 text-xs font-bold text-ink transition hover:bg-sky-500 hover:border-sky-500 hover:text-white disabled:opacity-50"
                title="Show QR Label"
              >
                {loadingQrId === row.id ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <QrCode className="mr-1 h-3 w-3" />}
                <span className="ml-1 text-xs">Print QR Label</span>
              </button>
            </div>
          ),
        },
        {
          key: 'category_brand',
          label: 'Category',
          render: (row) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 border border-line p-1">
                  {CATEGORY_ICONS[row.category] && <img src={CATEGORY_ICONS[row.category]} alt="" className="h-full w-full object-contain" />}
                </div>
                <span className="text-sm font-medium text-ink">{row.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-line p-1">
                  {BRAND_ICONS[row.brand] && <img src={BRAND_ICONS[row.brand]} alt="" className="h-full w-full object-contain" />}
                </div>
                <span className="text-sm font-bold text-ink">{row.brand}</span>
              </div>
            </div>
          )
        },
        {
          key: 'status',
          label: 'Status',
          render: (row) => {
            const status = row.booking_status || (row.available_quantity > 0 ? 'available' : 'out_of_stock');
            const badgeClass =
              status === 'out_of_stock'
                ? 'bg-rose-50 text-rose-600'
                : status === 'on_rent'
                  ? 'bg-amber-50 text-amber-600'
                  : status === 'booked'
                    ? 'bg-sky-50 text-sky-600'
                    : 'bg-emerald-50 text-emerald-600';
            const dotClass =
              status === 'out_of_stock'
                ? 'bg-rose-500'
                : status === 'on_rent'
                  ? 'bg-amber-500'
                  : status === 'booked'
                    ? 'bg-sky-500'
                    : 'bg-emerald-500';
            const text =
              status === 'out_of_stock'
                ? 'Out of Stock'
                : status === 'on_rent'
                  ? 'On Rent'
                  : status === 'booked'
                    ? 'Booked'
                    : 'In Stock';

            return (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${badgeClass}`}>
                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotClass}`} />
                {text}
              </span>
            );
          },
        },
        {
          key: 'price_per_day',
          label: 'Price / Day',
          render: (row) => <span className="font-bold text-ink">{formatCurrency(row.price_per_day)}</span>,
        },
        {
          key: 'actions',
          label: 'Actions',
          render: (row) => (
            <div className="flex items-center gap-2">
              <Link
                to={`/products/${row.id}/edit`}
                className="flex h-8 items-center justify-center rounded-md border border-line bg-white px-3 text-sm font-bold text-ink transition hover:bg-sky-500 hover:text-white hover:border-sky-500 group"
              >
                <Pencil className="mr-2 h-3.5 w-3.5 text-muted transition group-hover:text-white" /> Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(row)}
                className="flex h-8 items-center justify-center rounded-md border border-danger/20 bg-danger/5 px-3 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
              </button>
            </div>
          ),
        },
      ]}
      rows={rows}
      renderMobileCard={(row) => (
        <article key={row.id} className="card-surface p-4 flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 border border-line rounded-card overflow-hidden bg-slate-50">
              <img src={row.image} alt={row.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1 flex flex-col py-0.5">
              <div className="flex flex-col gap-1.5">
                {(() => {
                  const status = row.booking_status || (row.available_quantity > 0 ? 'available' : 'out_of_stock');
                  const badgeClass =
                    status === 'out_of_stock'
                      ? 'bg-rose-50 text-rose-600'
                      : status === 'on_rent'
                        ? 'bg-amber-50 text-amber-600'
                        : status === 'booked'
                          ? 'bg-sky-50 text-sky-600'
                          : 'bg-emerald-50 text-emerald-600';
                  const text =
                    status === 'out_of_stock'
                      ? 'Out of Stock'
                      : status === 'on_rent'
                        ? 'On Rent'
                        : status === 'booked'
                          ? 'Booked'
                          : 'Stock';
                  return (
                    <span className={`w-fit inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${badgeClass}`}>
                      {text}
                    </span>
                  );
                })()}
                <h3 className="text-base font-bold text-ink leading-tight line-clamp-2 min-h-[2.5rem]">{row.name}</h3>
              </div>

              <div className="mt-1.5 flex items-center">
                <span className="inline-flex items-center rounded border border-line bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                  <span className="mr-1 text-[9px] font-black uppercase text-tertiary/70">ID:</span>
                  {row.unique_code}
                </span>
              </div>

              <div className="mt-auto pt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-50 border border-line p-0.5">
                      {CATEGORY_ICONS[row.category] && <img src={CATEGORY_ICONS[row.category]} alt="" className="h-full w-full object-contain" />}
                    </div>
                    <span className="text-[11px] font-medium text-muted truncate">{row.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white border border-line p-0.5">
                      {BRAND_ICONS[row.brand] && <img src={BRAND_ICONS[row.brand]} alt="" className="h-full w-full object-contain" />}
                    </div>
                    <span className="text-[11px] font-bold text-ink truncate">{row.brand}</span>
                  </div>
                </div>

                <p className="text-base font-black text-ink">
                  {formatCurrency(row.price_per_day)} <span className="text-[10px] font-medium text-muted lowercase">/ day</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => handleShowQr(row)}
              disabled={loadingQrId === row.id}
              className="flex h-10 w-full items-center justify-center rounded-md border border-line bg-slate-50 text-sm font-bold text-ink transition hover:bg-sky-500 hover:border-sky-500 hover:text-white disabled:opacity-50"
            >
              {loadingQrId === row.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <QrCode className="mr-2 h-4 w-4" />} Print QR Label
            </button>
            <div className="flex items-center gap-2">
              <Link
                to={`/products/${row.id}/edit`}
                className="flex h-10 flex-1 items-center justify-center rounded-md border border-line bg-white text-sm font-bold text-ink transition hover:bg-sky-500 hover:text-white hover:border-sky-500 group"
              >
                <Pencil className="mr-2 h-4 w-4 text-muted transition group-hover:text-white" /> Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(row)}
                className="flex h-10 flex-1 items-center justify-center rounded-md border border-danger/20 bg-danger/5 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </article>
      )}
    />
  );
};

export default ProductCard;
