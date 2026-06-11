import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Building2, Clock as Clockicon, AlertCircle } from 'lucide-react';
import { BRAND_ICONS, CATEGORY_ICONS, CATEGORIES, BRANDS } from '@camera-rental-house/shared';
import { useToast } from '@camera-rental-house/ui';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';

import { PartnerSelection } from './PartnerSelection';
import { DateSelection } from './DateSelection';
import { EquipmentSelection } from './EquipmentSelection';
import { OrderSummary } from './OrderSummary';
import HouseBookingSkeleton from './HouseBookingSkeleton';
import { ManpowerSelection } from './ManpowerSelection';
import { SuccessScreen } from './SuccessScreen';

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const HouseBooking = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [isLoadingHouse, setIsLoadingHouse] = useState(false);

  useEffect(() => {
    const fetchHouse = async () => {
      if (!slug) return;
      setIsLoadingHouse(true);
      try {
        const res = await axiosInstance.get(`/admin/houses/slug/${slug}`);
        setSelectedHouse(res.data);
      } catch (error) {
        addToast({ title: 'Error', message: 'Failed to fetch house details.', tone: 'error' });
      } finally {
        setIsLoadingHouse(false);
      }
    };
    fetchHouse();
  }, [slug, addToast]);
  const [cart, setCart] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [rentalNo, setRentalNo] = useState('');
  const [finalTotal, setFinalTotal] = useState(0);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assistantCount, setAssistantCount] = useState(0);
  const [highlightTrigger, setHighlightTrigger] = useState(0);

  const triggerHighlightDates = () => {
    setHighlightTrigger(prev => prev + 1);
  };

  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  const categoryOptions = [
    { label: 'All Categories', value: 'All' },
    ...CATEGORIES.filter(c => c !== 'All').map(c => ({
      label: c,
      value: c,
      image: CATEGORY_ICONS[c]
    }))
  ];

  const brandOptions = [
    { label: 'All Brands', value: 'All' },
    ...BRANDS.filter(b => b !== 'All').map(b => ({
      label: b,
      value: b,
      image: BRAND_ICONS[b]
    }))
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    {
      label: 'In Stock',
      value: 'in_stock',
      icon: <CheckCircle2 className="h-3 w-3 text-emerald-500" />
    },
    {
      label: 'On Rent',
      value: 'on_rent',
      icon: <Clockicon className="h-3 w-3 text-amber-500" />
    },
    {
      label: 'Booked',
      value: 'booked',
      icon: <Clockicon className="h-3 w-3 text-sky-500" />
    },
    {
      label: 'Out of Stock',
      value: 'out_of_stock',
      icon: <AlertCircle className="h-3 w-3 text-rose-500" />
    }
  ];



  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get('/products', {
          params: {
            search: searchTerm,
            category: categoryFilter,
            brand: brandFilter,
            status: statusFilter,
            limit: 100,
            ...(startDate && endDate ? {
              pickup_date: startDate,
              drop_date: endDate,
            } : {})
          }
        });
        const mapped = data.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          category: item.category,
          price_per_day: item.price_per_day,
          price_2_days: item.price_2_days,
          price_5_days: item.price_5_days,
          status: item.status,
          booking_status: item.booking_status,
          available_quantity: item.available_quantity,
          unique_code: item.unique_code,
          image: item.images?.[0] ?? null,
        }));
        setFilteredProducts(mapped);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, brandFilter, statusFilter, startDate, endDate]);

  const addToCart = (product: any) => {
    if (cart.find(item => item.id === product.id)) {
      addToast({ title: 'Already in cart', message: 'Item already added.', tone: 'warning' });
      return;
    }
    setCart([...cart, product]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const [finalItemCount, setFinalItemCount] = useState(0);

  const handleProcessBooking = async () => {
    if (!selectedHouse || cart.length === 0 || !startDate || !endDate) {
      addToast({ title: 'Incomplete Details', message: 'Select partner, gear and rental period.', tone: 'error' });
      return;
    }

    setIsBookingInProgress(true);

    // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const finalDays = totalDays > 0 ? totalDays : 1;

    // Standard capped pricing calculation helper
    const calculateItemPrice = (item: any, daysCount: number) => {
      const p1 = Number(item.price_per_day) || 0;
      const p2 = Number(item.price_2_days) || 0;
      const p5 = Number(item.price_5_days) || 0;

      const getRawPrice = (d: number) => {
        let t = 0;
        let r = d;
        if (p5 > 0) {
          t += Math.floor(r / 5) * p5;
          r = r % 5;
        }
        if (p2 > 0 && r >= 2) {
          t += p2;
          r -= 2;
        }
        t += r * p1;
        return t;
      };

      let bestPrice = getRawPrice(daysCount);
      for (let i = 1; i <= 4; i++) {
        const cappedPrice = getRawPrice(daysCount + i);
        if (cappedPrice < bestPrice) {
          bestPrice = cappedPrice;
        }
      }
      return bestPrice;
    };

    const calculatedTotal = cart.reduce((sum, item) => sum + calculateItemPrice(item, finalDays), 0);

    try {
      const { data } = await axiosInstance.post('/rentals', {
        pickupDate: new Date(startDate).toISOString(),
        eventDate: new Date(endDate).toISOString(),
        userId: selectedHouse.user_id, // Link to selected house's user account
        assistantCrewCount: assistantCount,
        items: cart.map(item => ({
          productId: item.id,
          quantity: 1
        }))
      });

      setRentalNo(data.rental_no);
      setFinalTotal(calculatedTotal);
      setFinalItemCount(cart.length);
      setCart([]); // Reset local cart
      setIsComplete(true);

      addToast({
        title: 'Order Placed Successfully',
        message: `Order #${data.rental_no} is generated for ${selectedHouse.name}.`,
        tone: 'success'
      });
    } catch (err: any) {
      console.error('Failed to create rental order:', err);
      addToast({
        title: 'Booking Failed',
        message: err.response?.data?.message || err.message || 'Failed to generate order.',
        tone: 'error'
      });
    } finally {
      setIsBookingInProgress(false);
    }
  };

  if (isLoadingHouse) {
    return (
      <div className="admin-shell py-6 space-y-6">
        <button
          type="button"
          onClick={() => navigate('/houses')}
          className="group flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Houses
        </button>
        <HouseBookingSkeleton />
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="admin-shell py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <SuccessScreen
          pickupDate={startDate}
          dropDate={endDate}
          totalCost={finalTotal}
          rentalNo={rentalNo}
          houseName={selectedHouse.name}
          itemCount={finalItemCount}
          onViewRentals={() => navigate('/rentals')}
          onGoHome={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="admin-shell space-y-6 py-6">
      {/* Header */}
      <button
        type="button"
        onClick={() => navigate('/houses')}
        className="group flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Houses
      </button>

      {!selectedHouse ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
            <Building2 className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-black text-ink">House Not Found</h2>
          <p className="mt-2 text-sm font-medium text-muted">The production house could not be identified.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <PartnerSelection
              selectedHouse={selectedHouse}
            />
            <DateSelection
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              highlightTrigger={highlightTrigger}
            />
            <ManpowerSelection
              assistantCount={assistantCount}
              setAssistantCount={setAssistantCount}
            />
            <EquipmentSelection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryOptions={categoryOptions}
              brandOptions={brandOptions}
              statusOptions={statusOptions}
              filteredProducts={filteredProducts}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              hasDatesSelected={!!(startDate && endDate)}
              onSelectDatesClick={triggerHighlightDates}
            />
          </div>

          {/* Right Column: Order Summary */}
          <OrderSummary
            cart={cart}
            removeFromCart={removeFromCart}
            handleProcessBooking={handleProcessBooking}
            startDate={startDate}
            endDate={endDate}
            assistantCount={assistantCount}
            loading={isBookingInProgress}
          />
        </div>
      )}
    </div>
  );
};

export default HouseBooking;
