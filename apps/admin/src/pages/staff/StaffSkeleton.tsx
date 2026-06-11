import React from 'react';

const StaffSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Table Structure (Desktop) */}
      <div className="overflow-hidden rounded-[2rem] border border-line bg-white/50 hidden md:block">
        {/* Table Header */}
        <div className="border-b border-line bg-slate-50/50 p-4 grid grid-cols-6 gap-4">
          <div className="h-4 bg-slate-200 rounded w-20" />
          <div className="h-4 bg-slate-200 rounded w-20" />
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-4 bg-slate-200 rounded w-12" />
          <div className="h-4 bg-slate-200 rounded w-20" />
          <div className="h-4 bg-slate-200 rounded w-24" />
        </div>

        {/* Shimmering Table Body Rows */}
        <div className="divide-y divide-line">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 grid grid-cols-6 gap-4 items-center">
              {/* Member (Avatar + Name) */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-slate-200 shrink-0" />
                <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
              </div>

              {/* Username */}
              <div className="h-4 bg-slate-200 rounded w-16" />

              {/* Phone */}
              <div className="h-4 bg-slate-200 rounded w-24" />

              {/* Role */}
              <div className="h-5 bg-slate-200 rounded w-14" />

              {/* Status */}
              <div className="h-6 bg-slate-200 rounded-full w-16 animate-pulse" />

              {/* Last Activity */}
              <div className="space-y-1">
                <div className="h-2.5 bg-slate-200 rounded w-24" />
                <div className="h-3.5 bg-slate-200 rounded w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shimmering Cards (Mobile View) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-white/50 p-5 space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-line/60">
              <div className="h-14 w-14 rounded-xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                <div className="h-3.5 w-16 bg-slate-200 rounded" />
              </div>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-5">
              <div className="space-y-1.5">
                <div className="h-3 w-12 bg-slate-200 rounded" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-10 bg-slate-200 rounded" />
                <div className="h-4.5 w-14 bg-slate-200 rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-12 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded-full animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-4 w-28 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffSkeleton;
