import React from 'react';

const UserDetailSkeleton = () => {
  return (
    <div className="animate-pulse space-y-5">
      {/* 1. Profile Header & Stats Card Shimmer */}
      <div className="bg-white rounded-[1rem] border border-line p-5 sm:p-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-4 sm:contents">
            {/* Avatar skeleton */}
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0">
              <div className="h-full w-full rounded-xl bg-slate-200" />
            </div>
            {/* Mobile title skeleton */}
            <div className="flex-1 min-w-0 sm:hidden space-y-2">
              <div className="h-5 w-1/2 bg-slate-200 rounded" />
              <div className="h-4 w-28 bg-slate-200 rounded-full" />
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3 sm:space-y-2">
            <div className="hidden sm:flex items-center gap-3">
              <div className="h-6 w-1/3 bg-slate-200 rounded" />
              <div className="h-5 w-28 bg-slate-200 rounded-full" />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <div className="h-9 w-32 rounded-xl bg-slate-100 border border-line/40" />
            </div>
          </div>
        </div>

        {/* Tab Switcher Shimmer */}
        <div className="relative flex h-11 w-full rounded-xl bg-slate-100 p-1 shadow-inner">
          <div className="h-9 flex-1 bg-white rounded-lg shadow-sm" />
          <div className="h-9 flex-1 bg-transparent rounded-lg" />
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* 2. Personal Information Section Shimmer */}
        <div className="bg-white rounded-[1rem] border border-line p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <div className="h-5 w-5 bg-slate-200 rounded" />
            <div className="h-5 w-40 bg-slate-200 rounded" />
          </div>
          <div className="space-y-3">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-[1rem] p-4 bg-slate-50 border border-line/40 h-[72px] space-y-2">
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="rounded-[1rem] p-4 bg-slate-50 border border-line/40 h-[72px] space-y-2">
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Identity Verification Section Shimmer */}
        <div className="bg-white rounded-[1rem] border border-line p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <div className="h-5 w-5 bg-slate-200 rounded" />
            <div className="h-5 w-40 bg-slate-200 rounded" />
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-[1rem] border border-line p-4 bg-white space-y-4">
                <div className="h-4 w-28 bg-slate-200 rounded" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-slate-200 rounded" />
                  <div className="h-11 bg-slate-50 border border-line rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3.5 w-24 bg-slate-200 rounded" />
                  <div className="aspect-video w-full rounded-xl bg-slate-50 border border-line flex items-center justify-center">
                    <div className="h-6 w-6 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Social Connections Section Shimmer */}
        <div className="bg-white rounded-[1rem] border border-line p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <div className="h-5 w-5 bg-slate-200 rounded" />
            <div className="h-5 w-40 bg-slate-200 rounded" />
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-[1rem] border border-line p-4 bg-white space-y-2">
                <div className="h-4 w-20 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailSkeleton;
