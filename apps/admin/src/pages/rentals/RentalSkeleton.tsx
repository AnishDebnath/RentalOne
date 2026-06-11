import React from 'react';

const RentalSkeleton = ({ cardsOnly = false }: { cardsOnly?: boolean }) => {
  return (
    <div className="animate-pulse space-y-6">
      {/* 1. Tabs Skeleton */}
      {!cardsOnly && (
        <div className="flex rounded-[1.25rem] bg-slate-100/80 p-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-1 py-3 flex justify-center items-center">
              <div className="h-4 w-20 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* 2. Toolbar Skeleton */}
      {!cardsOnly && (
        <div className="flex flex-col sm:flex-row gap-4 rounded-[1.5rem] border border-line bg-white/50 p-4">
          <div className="h-11 flex-1 bg-slate-200 rounded-xl" />
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="h-11 w-44 bg-slate-200 rounded-xl flex-1 sm:flex-initial" />
            <div className="h-11 w-11 bg-slate-200 rounded-xl shrink-0" />
          </div>
        </div>
      )}

      {/* 3. Shimmering Rental Cards Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card-surface p-4 md:p-5 border border-line bg-white/50 space-y-4">
            {/* Top Header: ID & Expansion */}
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-slate-200 shrink-0" />
                <div className="h-7 w-32 bg-slate-200 rounded-xl shrink-0" />
                <div className="h-3 w-16 bg-slate-200 rounded-full shrink-0 animate-pulse" />
              </div>
              <div className="h-7 w-7 rounded-full bg-slate-200 shrink-0" />
            </div>

            {/* Main Body */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              
              {/* Customer Info */}
              <div className="flex items-center gap-4 lg:w-[25%] lg:shrink-0">
                <div className="h-14 w-14 rounded-xl bg-slate-200 shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>

              {/* Dates Timeline Widget */}
              <div className="flex w-full items-center justify-center lg:flex-1">
                <div className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-1.5 border border-line/60 lg:w-auto lg:justify-start gap-4">
                  {/* Pickup date block */}
                  <div className="flex flex-col items-center justify-center rounded-xl px-4 py-2 bg-slate-200/40 w-24">
                    <div className="h-3 w-12 bg-slate-200 rounded" />
                    <div className="h-4 w-16 bg-slate-200 rounded mt-1.5" />
                  </div>
                  {/* Duration Connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="h-1 w-10 bg-slate-200 rounded" />
                    <div className="h-2 w-8 bg-slate-200 rounded mt-1.5" />
                  </div>
                  {/* Return date block */}
                  <div className="flex flex-col items-center justify-center rounded-xl px-4 py-2 bg-slate-200/40 w-24">
                    <div className="h-3 w-12 bg-slate-200 rounded" />
                    <div className="h-4 w-16 bg-slate-200 rounded mt-1.5 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Price & Status Block */}
              <div className="flex items-center justify-center lg:w-[25%] lg:justify-end lg:shrink-0">
                <div className="flex items-center gap-3 rounded-full border border-line bg-slate-50/50 p-1.5 pr-4 w-44">
                  <div className="h-6 w-24 bg-slate-200 rounded-full shrink-0" />
                  <div className="h-4 w-12 bg-slate-200 rounded shrink-0" />
                </div>
              </div>
            </div>

            {/* Product Summary */}
            <div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50/80 p-2 pr-3 border border-line/60">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-8 w-8 rounded-xl bg-slate-200 shrink-0" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-slate-200 rounded-lg shrink-0" />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalSkeleton;
