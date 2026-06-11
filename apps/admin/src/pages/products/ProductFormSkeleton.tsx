import React from 'react';

const ProductFormSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* 1. Images Card Shimmer */}
      <div className="bg-white rounded-[1rem] border border-line p-5 space-y-3">
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-60 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-square rounded-[1rem] bg-slate-200 border border-slate-300/30" />
          ))}
          <div className="aspect-square rounded-[1rem] border border-dashed border-primary/20 bg-slate-50 flex flex-col items-center justify-center animate-pulse" />
        </div>
      </div>

      {/* 2. Details Card Shimmer */}
      <div className="bg-white rounded-[1rem] border border-line p-6 space-y-6">
        <div className="border-b border-line pb-4">
          <div className="h-4 w-28 bg-slate-200 rounded" />
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-11 bg-slate-50 border border-line rounded-xl" />
        </div>

        {/* Category & Brand */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-11 bg-slate-50 border border-line rounded-xl" />
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-11 bg-slate-50 border border-line rounded-xl" />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-28 bg-slate-50 border border-line rounded-xl" />
        </div>

        {/* Out of Stock toggle */}
        <div className="flex items-center justify-between rounded-xl border border-line bg-slate-50/50 p-4">
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-3.5 w-60 bg-slate-200 rounded" />
          </div>
          <div className="h-6 w-11 rounded-full bg-slate-200" />
        </div>

        {/* Warning Card */}
        <div className="rounded-[1rem] bg-amber-50 p-4 border border-amber-100/50 space-y-2">
          <div className="h-3 w-32 bg-amber-200/60 rounded" />
          <div className="h-3.5 w-full bg-amber-200/40 rounded animate-pulse" />
        </div>

        {/* Submit button */}
        <div className="h-11 w-full bg-slate-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

export default ProductFormSkeleton;
