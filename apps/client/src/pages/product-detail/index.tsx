import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Footer from '../../components/common/footer/Footer';
import axiosInstance from '../../api/axiosInstance';
import { useCart } from '../../store/CartContext';
import { useFavourites } from '../../store/FavouritesContext';

// Section Components
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductActions from './ProductActions';
import ProductBookedCalendar from './ProductBookedCalendar';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, items, pickupDate, dropDate } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (pickupDate && dropDate) {
          params.pickup_date = format(pickupDate, 'yyyy-MM-dd');
          params.drop_date = format(dropDate, 'yyyy-MM-dd');
        }
        const { data } = await axiosInstance.get(`/products/${id}`, { params });
        const mappedProduct = {
          ...data,
          images: (data.images || []).map((url: string, i: number) => ({
            id: String(i),
            image_url: url,
            display_order: i
          }))
        };
        setProduct(mappedProduct);
      } catch (err: any) {
        console.error('Failed to fetch product details:', err);
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, pickupDate, dropDate]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-bold text-ink">{error || 'Product not found'}</p>
        <Link to="/category" className="primary-button">Back to Catalog</Link>
      </div>
    );
  }

  const inCart = items.some((item) => item.id === product.id);

  const handleCartAction = () => {
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  return (
    <>
      <div className="page-animate app-shell pb-10 md:pb-12 pt-4 lg:pt-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-sm font-bold text-muted transition-colors hover:text-primary mb-6 px-4 lg:px-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary active:scale-90">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Back to Catalog</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-start">

          {/* Left Column: Image Gallery */}
          <ProductGallery images={product.images} />

          {/* Right Column: Information & Actions */}
          <div className="lg:sticky lg:top-28 space-y-5 mt-6 lg:mt-0 px-4 lg:px-0">
            <ProductInfo product={product} />
            <ProductBookedCalendar bookedRanges={product.booked_ranges} />
            <ProductActions
              product={product}
              inCart={inCart}
              isFavourite={isFavourite}
              toggleFavourite={toggleFavourite}
              handleCartAction={handleCartAction}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
