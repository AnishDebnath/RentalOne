import { ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import SkeletonCard from '../../components/product/SkeletonCard';
import { useStaggeredRender } from '../../hooks/useStaggeredRender';
import { useRetryFetch } from '../../hooks/useRetryFetch';
import axiosInstance from '../../api/axiosInstance';

const FeaturedGear = () => {
  const { data, loading } = useRetryFetch<{ items: any[]; pagination: any }>(
    async () => {
      const { data } = await axiosInstance.get('/products?limit=8&sort=most_rented');
      return data;
    },
    [],
    { retryDelayMs: 2000, cacheKey: 'featured_gear' },
  );

  const products = useMemo(() => {
    if (!data) return [];
    let items: any[] = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.items)) {
      items = data.items;
    }
    return items.map((p: any) => ({
      ...p,
      images: Array.isArray(p.images)
        ? p.images.map((url: string, i: number) => ({
          id: String(i),
          image_url: url,
          display_order: i
        }))
        : []
    }));
  }, [data]);

  const staggeredCount = useStaggeredRender(loading ? 0 : products.length);

  return (
    <section className="app-shell space-y-4">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-xl font-bold text-ink md:text-2xl">
            Most Rented Gear
          </h2>
        </div>
        <Link
          to="/category"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          See All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
        ) : products.length > 0 ? (
          products.slice(0, staggeredCount).map((product, index) => (
            <div key={product.id || index} className={index >= 6 ? 'hidden lg:block' : 'block'}>
              <ProductCard product={product} hideCart={true} />
            </div>
          ))
        ) : null}
      </div>
    </section>
  );
};

export default FeaturedGear;
