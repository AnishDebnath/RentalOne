import React from 'react';

const HouseSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* 1. Stats Row Skeleton */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-between rounded-[1rem] border border-line p-3 sm:p-4 bg-white/50 h-[88px]"
          >
            <div className="h-3 w-16 sm:w-20 bg-slate-200 rounded-full" />
            <div className="h-6 w-12 bg-slate-200 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* 2. Filters Row Skeleton */}
      <div className="card-surface p-4 flex flex-col md:flex-row items-stretch gap-4 bg-white/50">
        <div className="h-11 flex-1 md:max-w-lg bg-slate-200 rounded-xl" />
        <div className="h-11 md:w-[240px] bg-slate-200 rounded-xl" />
      </div>

      {/* 3. Table Structure (Desktop) */}
      <div className="overflow-hidden rounded-[2rem] border border-line bg-white/50 hidden md:block">
        {/* Table Header */}
        <div className="border-b border-line bg-slate-50/50 p-4 grid grid-cols-7 gap-4">
          <div className="h-4 bg-slate-200 rounded col-span-2" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded justify-self-end w-20" />
        </div>

        {/* Shimmering Table Body Rows */}
        <div className="divide-y divide-line">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 grid grid-cols-7 gap-4 items-center">
              {/* House Info (Avatar + Names) */}
              <div className="flex items-center gap-3 col-span-2">
                <div className="h-10 w-10 rounded-xl bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>

              {/* House ID */}
              <div className="h-6 w-20 bg-slate-200 rounded" />

              {/* Contact */}
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />

              {/* This Month */}
              <div className="h-4 w-20 bg-slate-200 rounded" />

              {/* Due Amount */}
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />

              {/* Status & Actions */}
              <div className="flex items-center gap-2 justify-self-end col-span-1 w-full justify-end">
                <div className="h-9 w-20 bg-slate-200 rounded-lg shrink-0" />
                <div className="h-9 w-16 bg-slate-200 rounded-lg shrink-0 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shimmering Cards (Mobile View) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-white/50 p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-200 rounded" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 w-16 bg-slate-200 rounded" />
                  <div className="h-5 w-20 bg-slate-200 rounded-full" />
                </div>
              </div>
            </div>

            {/* Business section */}
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 border border-line/60">
              <div className="space-y-1.5">
                <div className="h-3 w-12 bg-slate-200 rounded" />
                <div className="h-4 w-16 bg-slate-200 rounded" />
              </div>
              <div className="space-y-1.5 flex flex-col items-end">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <div className="h-11 flex-1 bg-slate-200 rounded-xl" />
              <div className="h-11 flex-1 bg-slate-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HouseSkeleton;
