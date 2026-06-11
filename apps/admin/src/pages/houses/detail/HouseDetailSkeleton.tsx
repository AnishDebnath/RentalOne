import React from 'react';

const HouseDetailSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* 1. Profile Card Shimmer */}
      <div className="bg-white rounded-[1rem] border border-line p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-4 sm:contents">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0">
              <div className="h-full w-full rounded-lg bg-slate-200 border border-slate-300/30" />
            </div>
            <div className="flex-1 min-w-0 sm:hidden space-y-1.5">
              <div className="h-5 w-40 bg-slate-200 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded-full" />
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3 sm:space-y-2">
            <div className="hidden sm:flex items-center gap-3">
              <div className="h-6 w-48 bg-slate-200 rounded" />
              <div className="h-5 w-20 bg-slate-200 rounded-full" />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <div className="h-9 w-32 rounded-xl bg-slate-100 border border-line/40" />
              <div className="h-9 w-36 rounded-xl bg-slate-100 border border-line/40" />
            </div>
          </div>
        </div>

      {/* 2. Credentials + Stats Grid */}
      <div className="flex flex-col gap-5">
        
        {/* Owner Credentials Shimmer */}
        <div className="bg-white rounded-[1rem] border border-line overflow-hidden">
          <div className="p-5 border-b border-line bg-slate-50/50 flex flex-col gap-1.5">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-60 bg-slate-200 rounded" />
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                  <div className="h-11 bg-slate-100 rounded-xl" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 bg-slate-200 rounded" />
                    <div className="h-11 bg-slate-100 rounded-xl animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                    <div className="h-11 bg-slate-100 rounded-xl" />
                  </div>
                  <div className="h-12 bg-slate-200 rounded-xl w-full mt-4" />
                </div>
              </div>
              <div className="bg-indigo-50/30 rounded-2xl p-5 border border-indigo-100/50 flex flex-col justify-center h-[240px]">
                <div className="h-10 w-10 rounded-xl bg-white border border-indigo-100/30 mb-3 shrink-0" />
                <div className="h-4 w-36 bg-slate-200 rounded mb-2" />
                <div className="space-y-1.5 flex-1 mt-1">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                  <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse" />
                </div>
                <div className="h-4 w-32 bg-slate-200 rounded mt-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row Shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1 (Dark) */}
          <div className="bg-slate-900 rounded-[1.5rem] p-6 border border-white/5 h-36 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20" />
              <div className="h-3 w-16 bg-slate-800 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-12 bg-slate-700 rounded" />
              <div className="h-7 w-20 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-[1.5rem] p-6 border border-line h-36 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100" />
              <div className="h-3 w-16 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="h-7 w-20 bg-slate-200 rounded" />
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-[1.5rem] p-6 border border-line h-36 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100" />
              <div className="h-3 w-16 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-7 w-20 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

      </div>

      {/* 3. History Section Skeleton */}
      <div className="bg-white rounded-[1rem] border border-line overflow-hidden">
        <div className="p-5 md:p-6 border-b border-line bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 shadow-sm shrink-0" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4.5 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-48 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="h-10 w-full sm:w-72 lg:w-[450px] bg-slate-50 border border-line rounded-xl" />
        </div>

        {/* Desktop History Rows Shimmer */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="w-full min-w-[900px]">
            {/* Header row */}
            <div className="bg-slate-50/50 px-6 py-4 flex border-b border-line justify-between items-center gap-4">
              <div className="h-3.5 w-16 bg-slate-200 rounded" />
              <div className="h-3.5 w-40 bg-slate-200 rounded" />
              <div className="h-3.5 w-32 bg-slate-200 rounded" />
              <div className="h-3.5 w-20 bg-slate-200 rounded" />
              <div className="h-3.5 w-16 bg-slate-200 rounded" />
              <div className="h-5 w-5 rounded-full" />
            </div>
            {/* 3 Content rows */}
            <div className="divide-y divide-line/40">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-6 py-5 flex items-center justify-between gap-4">
                  <div className="h-4 w-16 bg-slate-200 rounded shrink-0" />
                  <div className="flex items-center gap-3 w-[28%] shrink-0">
                    <div className="space-y-1 flex-1">
                      <div className="h-2.5 w-8 bg-slate-200 rounded" />
                      <div className="h-3.5 w-24 bg-slate-200 rounded" />
                    </div>
                    <div className="h-px w-4 bg-line/60" />
                    <div className="space-y-1 flex-1">
                      <div className="h-2.5 w-8 bg-slate-200 rounded" />
                      <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="w-[25%] space-y-1 shrink-0">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                  </div>
                  <div className="h-4 w-20 bg-slate-200 rounded shrink-0" />
                  <div className="h-6 w-20 bg-slate-200 rounded-full shrink-0" />
                  <div className="h-5 w-5 bg-slate-200 rounded-full shrink-0 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile History Rows Shimmer */}
        <div className="lg:hidden pb-4 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-line/40 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-16 bg-slate-200 rounded" />
                      <div className="h-5 w-20 bg-slate-200 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-1 pt-1">
                      <div className="h-2.5 w-12 bg-slate-200 rounded" />
                      <div className="h-4 w-20 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-slate-50 border border-line" />
                </div>
                <div className="flex items-center justify-between py-4 border-y border-line/20 -mx-5 px-5 bg-slate-50/20">
                  <div className="h-6 w-24 bg-slate-200 rounded" />
                  <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="space-y-1 pt-1">
                  <div className="h-3.5 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default HouseDetailSkeleton;
