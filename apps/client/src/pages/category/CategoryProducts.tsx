import { SearchX } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import SkeletonCard from '../../components/product/SkeletonCard';
import EmptyState from '../../components/ui/EmptyState';

interface CategoryProductsProps {
  loading: boolean;
  filteredProducts: any[];
  itemsToShow: number;
  setItemsToShow: React.Dispatch<React.SetStateAction<number>>;
}

const CategoryProducts = ({ loading, filteredProducts, itemsToShow, setItemsToShow }: CategoryProductsProps) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-ink px-4">Explore Gears</h1>
        </div>
        <p className="rounded-pill bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">
          {filteredProducts.length} items
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : filteredProducts.length ? (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {filteredProducts.slice(0, itemsToShow).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {itemsToShow < filteredProducts.length ? (
            <button type="button" onClick={() => setItemsToShow((current: number) => current + 4)} className="secondary-button mx-auto">
              Load More
            </button>
          ) : null}
        </>
      ) : (
        <EmptyState
          title="No gear found"
          message="Try a different search or clear your filters to see more equipment."
          actionLabel="Clear Filters"
          actionTo="/category"
          icon={<SearchX className="h-8 w-8" />}
        />
      )}
    </section>
  );
};

export default CategoryProducts;
