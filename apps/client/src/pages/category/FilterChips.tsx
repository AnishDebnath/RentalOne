import clsx from 'clsx';
import { CATEGORIES_LIST as CategoriesList, BRANDS_LIST as BrandsList } from '@rentalone/shared';

interface FilterChipsProps {
  activeCategory: string;
  activeBrand: string;
  onSelect: (type: 'category' | 'brand', value: string) => void;
  isDark?: boolean;
}

const FilterChips = ({ activeCategory, activeBrand, onSelect, isDark = false }: FilterChipsProps) => (
  <div className="space-y-6">
    {/* Categories Slider */}
    <div className="space-y-2.5">
      <p className={clsx(
        "text-xs font-bold uppercase tracking-wider pl-1",
        isDark ? "text-white/60" : "text-ink/60"
      )}>Gears</p>
      <div
        data-lenis-prevent
        className="hide-scrollbar flex gap-3 overflow-x-auto snap-x snap-proximity pb-2 -mx-1 px-1 touch-pan-x"
      >
        <button
          type="button"
          onClick={() => onSelect('category', 'All')}
          className={clsx(
            'flex flex-col items-center justify-center aspect-square h-20 w-20 min-w-[80px] rounded-2xl snap-start transition-colors',
            activeCategory === 'All'
              ? 'bg-primary text-white'
              : clsx(
                'border',
                isDark
                  ? 'border-white/10 bg-white/5 text-white'
                  : 'border-slate-100 bg-slate-50/50 text-ink hover:bg-white'
              )
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-center px-1">All <br />Gear</span>
        </button>
        {CategoriesList.map((item) => (
          <button
            key={item.category}
            type="button"
            onClick={() => onSelect('category', item.category)}
            className={clsx(
              'group flex flex-col items-center justify-between aspect-square h-20 w-20 min-w-[80px] rounded-2xl p-2.5 snap-start transition-colors',
              activeCategory === item.category
                ? 'bg-primary text-white'
                : clsx(
                  'border',
                  isDark
                    ? 'border-white/10 bg-white/5 text-white'
                    : 'border-slate-100 bg-slate-50/50 text-ink hover:bg-white'
                )
            )}
          >
            <div className="flex-1 flex items-center justify-center w-full pointer-events-none">
              <img
                src={item.image}
                alt={item.category}
                className={clsx(
                  "object-contain max-h-8 max-w-8",
                  isDark ? "brightness-0 invert" : ""
                )}
              />
            </div>
            <span className="text-[10px] font-bold tracking-wide text-center w-full truncate pointer-events-none">{item.category}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Brands Slider */}
    <div className="space-y-2.5">
      <p className={clsx(
        "text-xs font-bold uppercase tracking-wider pl-1",
        isDark ? "text-white/60" : "text-ink/60"
      )}>Top Brands</p>
      <div
        data-lenis-prevent
        className="hide-scrollbar flex gap-3 overflow-x-auto snap-x snap-proximity pb-2 -mx-1 px-1 touch-pan-x"
      >
        <button
          type="button"
          onClick={() => onSelect('brand', 'All')}
          className={clsx(
            'flex flex-col items-center justify-center aspect-square h-20 w-20 min-w-[80px] rounded-2xl snap-start transition-colors',
            activeBrand === 'All'
              ? 'bg-primary text-white'
              : clsx(
                'border',
                isDark
                  ? 'border-white/10 bg-white/5 text-white'
                  : 'border-slate-100 bg-slate-50/50 text-ink hover:bg-white'
              )
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-center px-1">All<br />Brand</span>
        </button>
        {BrandsList.map((item) => (
          <button
            key={item.category}
            type="button"
            onClick={() => onSelect('brand', item.category)}
            className={clsx(
              'group flex flex-col items-center justify-between aspect-square h-20 w-20 min-w-[80px] rounded-2xl p-2.5 snap-start transition-colors',
              activeBrand === item.category
                ? 'bg-primary text-white'
                : clsx(
                  'border',
                  isDark
                    ? 'border-white/10 bg-white/5 text-white'
                    : 'border-slate-100 bg-slate-50/50 text-ink hover:bg-white'
                )
            )}
          >
            <div className="flex-1 flex items-center justify-center w-full pointer-events-none">
              <img
                src={item.image}
                alt={item.category}
                className={clsx(
                  "object-contain max-h-7 max-w-10",
                  isDark ? "brightness-0 invert" : ""
                )}
              />
            </div>
            <span className="text-[10px] font-bold tracking-wide text-center w-full truncate pointer-events-none">{item.category}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default FilterChips;
