import { Heart } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import ProductCard from '../../components/product/ProductCard';
import { useFavourites } from '../../store/FavouritesContext';
import Footer from '../../components/common/footer/Footer';

const Favourites = () => {
  const { favourites } = useFavourites();

  return (
    <div className="page-animate space-y-10 md:space-y-12">
      <div className="app-shell pt-2 pb-0">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-ink px-4">My Favourites</h1>
            </div>
            <p className="rounded-[100px] bg-primary-light px-4 py-2 text-xs font-semibold text-primary-dark">
              {favourites.length} item{favourites.length !== 1 ? 's' : ''}
            </p>
          </div>
          {favourites.length ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {favourites.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <EmptyState
              title="No favourites yet"
              message="Save your go-to camera bodies, lenses, and accessories for faster checkouts."
              actionLabel="Explore Category"
              actionTo="/category"
              icon={<Heart className="h-8 w-8" />}
            />
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Favourites;
