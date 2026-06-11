const SkeletonCard = () => (
  <article className="flex flex-col overflow-hidden rounded-[26px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full animate-pulse">
    {/* Edge-to-edge floating Image Container */}
    <div className="p-2.5 pb-0">
      <div className="aspect-[5/4] rounded-[18px] bg-slate-100" />
    </div>
    
    <div className="flex flex-1 flex-col justify-between p-3.5 pt-2.5">
      <div className="space-y-2">
        {/* Category & Brand with Logos placeholder */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-slate-100" />
            <div className="h-2 w-12 rounded bg-slate-100" />
          </div>
          <span className="text-[9px] text-slate-200">•</span>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-slate-100" />
            <div className="h-2 w-12 rounded bg-slate-100" />
          </div>
        </div>

        {/* Product Name placeholder */}
        <div className="space-y-1">
          <div className="h-3.5 w-full rounded bg-slate-100" />
          <div className="h-3.5 w-3/4 rounded bg-slate-100" />
        </div>
      </div>

      <div className="mt-3 flex flex-col justify-end">
        {/* Price & Code Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5">
          <div className="h-5 w-24 rounded bg-slate-100 order-2 sm:order-1" />
          <div className="h-5 w-16 rounded bg-slate-100 order-1 sm:order-2 self-start sm:self-auto" />
        </div>

        {/* Action Button */}
        <div className="h-9 w-full rounded-[12px] bg-slate-100" />
      </div>
    </div>
  </article>
);

export default SkeletonCard;
