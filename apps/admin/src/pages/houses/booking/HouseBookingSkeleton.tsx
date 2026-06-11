import React from 'react';

const HouseBookingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Two columns layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* PartnerSelection Skeleton */}
          <div className="card-surface p-5 space-y-3 bg-white/50">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/3 bg-slate-200 rounded" />
                <div className="h-3 w-1/4 bg-slate-200 rounded" />
              </div>
            </div>
          </div>

          {/* DateSelection Skeleton */}
          <div className="card-surface p-5 space-y-4 bg-white/50">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-11 bg-slate-200 rounded-xl" />
              <div className="h-11 bg-slate-200 rounded-xl" />
            </div>
          </div>

          {/* EquipmentSelection Skeleton */}
          <div className="card-surface p-5 space-y-4 bg-white/50">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-11 bg-slate-200 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 items-center border border-line p-3 rounded-xl bg-slate-50/50">
                  <div className="h-12 w-12 bg-slate-200 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: OrderSummary Skeleton */}
        <div className="lg:col-span-4">
          <div className="card-surface p-5 space-y-6 bg-white/50 h-[360px] sticky top-6">
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
            <div className="border-t border-line/60 pt-4 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-12 bg-slate-200 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-5 w-20 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-12 bg-slate-200 rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseBookingSkeleton;
