import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* 1. Stats Row Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-between rounded-[1rem] border border-line p-3 sm:p-4 bg-white/50 h-[88px]"
          >
            <div className="h-3 w-20 bg-slate-200 rounded-full" />
            <div className="h-8 w-12 bg-slate-200 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* 2. Filters Row Skeleton */}
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-line bg-white/50 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-10 flex-1 bg-slate-200 rounded-xl" />
          <div className="h-10 w-28 bg-slate-200 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-10 bg-slate-200 rounded-xl" />
          <div className="h-10 bg-slate-200 rounded-xl" />
          <div className="h-10 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* 3. Table Rows Skeleton */}
      <div className="overflow-hidden rounded-[2rem] border border-line bg-white/50">
        {/* Table Header */}
        <div className="border-b border-line bg-slate-50/50 p-4 hidden md:grid grid-cols-6 gap-4">
          <div className="h-4 bg-slate-200 rounded col-span-2" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
        </div>

        {/* Shimmering Table Body Rows */}
        <div className="divide-y divide-line">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex flex-col md:grid md:grid-cols-6 gap-4 items-center">
              {/* Product Info Column */}
              <div className="flex items-center gap-3 w-full col-span-2">
                <div className="h-12 w-12 rounded-xl bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              {/* Other columns */}
              <div className="h-4 bg-slate-200 rounded w-20 md:w-full hidden md:block" />
              <div className="h-4 bg-slate-200 rounded w-16 md:w-full hidden md:block" />
              <div className="h-4 bg-slate-200 rounded w-24 md:w-full hidden md:block" />
              <div className="h-8 bg-slate-200 rounded-lg w-20 md:w-full col-span-1 justify-self-end hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
