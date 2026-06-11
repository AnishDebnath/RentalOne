import { Link } from 'react-router-dom';
import { CATEGORIES_LIST as CategoriesList } from '@camera-rental-house/shared';
import { LayoutGrid } from 'lucide-react';

import { LazyImage } from '@camera-rental-house/ui';

const CategorySelection = () => {
  return (
    <section className="app-shell space-y-5">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-xl font-bold text-ink md:text-2xl">Categories</h2>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6 lg:gap-5">
        {CategoriesList.slice(0, 5).map((item, index) => {
          return (
            <Link
              key={item.category}
              to={item.path}
              className="group flex flex-col items-center justify-center rounded-[24px] bg-white/60 backdrop-blur-xl aspect-square shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-white/60 transition-all duration-300 hover:bg-white/90 hover:shadow-[0_8px_24px_rgba(31,56,82,0.08)] hover:-translate-y-1 active:scale-95"
            >
              <LazyImage
                src={item.image}
                alt={item.category}
                aspectRatio="h-12 w-12 sm:h-14 sm:w-14"
                className="!object-contain mb-3 transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
              />
              <span className="text-xs sm:text-sm font-bold text-slate-800 text-center tracking-tight transition-colors group-hover:text-primary">
                {item.category}
              </span>
            </Link>
          );
        })}

        {/* 'More' / View All Categories Card */}
        <Link
          to="/category"
          className="group flex flex-col items-center justify-center rounded-[24px] bg-white/60 backdrop-blur-xl aspect-square shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-white/60 transition-all duration-300 hover:bg-white/90 hover:shadow-[0_8px_24px_rgba(31,56,82,0.08)] hover:-translate-y-1 active:scale-95"
        >
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-transparent border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-primary mb-3">
            <LayoutGrid className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-500 group-hover:scale-110" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-800 text-center tracking-tight transition-colors group-hover:text-primary">
            More
          </span>
        </Link>
      </div>
    </section>
  );
};

export default CategorySelection;
