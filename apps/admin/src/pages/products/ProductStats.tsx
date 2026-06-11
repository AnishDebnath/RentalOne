type ProductStatsProps = {
  totalItems: number;
  rentedItems: number;
  inStockItems: number;
  outOfStockItems: number;
};

const ProductStats = ({ totalItems, rentedItems, inStockItems, outOfStockItems }: ProductStatsProps) => {
  const stats = [
    { label: 'Total Products', value: totalItems, tone: 'bg-slate-50' },
    { label: 'Available in Stock', value: inStockItems, tone: 'bg-emerald-50' },
    { label: 'Active Rentals', value: rentedItems, tone: 'bg-amber-50' },
    { label: 'Out of Stock', value: outOfStockItems, tone: 'bg-rose-50' },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {stats.map((item) => (
        <article
          key={item.label}
          className={`flex flex-col items-center justify-between rounded-[1rem] border border-line p-3 text-center shadow-sm sm:p-4 ${item.tone}`}
        >
          <p className="flex min-h-[24px] items-center text-[9px] font-bold uppercase tracking-wider text-tertiary sm:text-xs">
            {item.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-ink sm:mt-2 sm:text-3xl">{item.value}</p>
        </article>
      ))}
    </section>
  );
};

export default ProductStats;
