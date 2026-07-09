import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { getAuthRole } from '@rentalone/shared';

// Modular Components
import RentalHeader from './RentalHeader';
import RentalTabs from './RentalTabs';
import RentalCard from './RentalCard';
import CustomDatePicker from './CustomDatePicker';
import RentalSkeleton from './RentalSkeleton';

const Rentals = () => {
  const role = getAuthRole();
  const isStaff = role === 'staff';
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'returning'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [upcomingRentals, setUpcomingRentals] = useState<any[]>([]);
  const [activeRentals, setActiveRentals] = useState<any[]>([]);

  // Default to today's date (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, []);
  const [filterDate, setFilterDate] = useState(todayStr);

  useEffect(() => {
    const fetchAllRentals = async () => {
      setLoading(true);
      try {
        const [upRes, actRes] = await Promise.all([
          axiosInstance.get('/admin/rentals/upcoming'),
          axiosInstance.get('/admin/rentals/active')
        ]);
        setUpcomingRentals(upRes.data?.data || upRes.data?.items || []);
        setActiveRentals(actRes.data?.data || actRes.data?.items || []);
      } catch (error) {
        console.error('Failed to fetch rentals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRentals();
  }, []);

  const toLocalDate = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const mapRental = (r: any) => {
    const rental = r.rentals ? r.rentals : r;
    const users = r.users || rental.users || {};

    return {
      id: rental.rental_no || rental.id.split('-')[0].toUpperCase(),
      name: users.full_name || 'Guest',
      user_image: users.avatar_url || '',
      phone: users.phone || 'N/A',
      pickup: rental.pickup_date,
      return_date: rental.event_date,
      total_price: rental.total_amount || 0,
      status: rental.status,
      products: (rental.products || []).map((p: any) => ({
        id: p.id,
        name: p.name || 'Unknown',
        price: p.price || 0,
        qty: p.qty || 1,
        image: p.image || '',
        unique_code: p.unique_code || '',
        released_to_representative_name: p.released_to_representative_name,
        returned_by_representative_name: p.returned_by_representative_name,
      })),
      handover_proof: rental.handover_proof_url,
      released_to_representative_name: rental.released_to_representative_name,
      returned_by_representative_name: rental.returned_by_representative_name,
      isHouseBooking: !!rental.house_id || !!rental.house_booking_id,
      assistant_crew_count: rental.assistant_crew_count || 0,
    };
  };

  const mappedUpcoming = useMemo(() => upcomingRentals.map(mapRental), [upcomingRentals]);
  const mappedActive = useMemo(() => activeRentals.map(mapRental), [activeRentals]);

  const filteredRentals = useMemo(() => {
    let list: any[] = [];
    if (activeTab === 'upcoming') {
      list = mappedUpcoming.filter(r => toLocalDate(r.pickup) === filterDate);
    } else if (activeTab === 'active') {
      list = mappedActive;
    } else if (activeTab === 'returning') {
      list = mappedActive.filter(r => toLocalDate(r.return_date) === filterDate && !['cancelled', 'failed', 'returned'].includes(r.status));
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      list = list.filter((r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.id.toLowerCase().includes(lowerQuery)
      );
    }

    return list;
  }, [mappedUpcoming, mappedActive, activeTab, searchQuery, filterDate]);

  const counts = useMemo(() => {
    const upcomingCount = mappedUpcoming.filter(r => toLocalDate(r.pickup) === filterDate).length;
    const activeCount = mappedActive.length;
    const returningCount = mappedActive.filter(r =>
      toLocalDate(r.return_date) === filterDate &&
      !['cancelled', 'failed', 'returned'].includes(r.status)
    ).length;

    return {
      upcoming: upcomingCount,
      active: activeCount,
      returning: returningCount,
    };
  }, [mappedUpcoming, mappedActive, filterDate]);

  const shiftDate = (days: number) => {
    const [y, m, d] = filterDate.split('-').map(Number);
    const date = new Date(y, m - 1, d + days); // local date, no UTC issue
    setFilterDate(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
  };

  const displayDate = useMemo(() => {
    const [y, m, d] = filterDate.split('-');
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    const formatted = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (filterDate === todayStr) return `Today, ${formatted}`;
    return formatted;
  }, [filterDate, todayStr]);

  return (
    <div className="admin-shell space-y-6 py-8">
      <RentalHeader isStaff={isStaff} />

      {loading ? (
        <RentalSkeleton />
      ) : (
        <div className="space-y-6">
          <RentalTabs
            activeTab={activeTab}
            setActiveTab={(tab: any) => {
              setActiveTab(tab);
              setSearchQuery('');
            }}
            counts={counts}
          />

          {/* Toolbar: Search + Date Filter */}
          <section className="card-surface p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search Bar */}
              <label className="input-shell min-h-11 flex-1">
                <Search className="h-4 w-4 text-muted" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by customer name or rental code..."
                  className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0"
                />
              </label>

              {/* Date Navigator */}
              {activeTab !== 'active' && (
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <div className="flex flex-1 items-center justify-between gap-1 rounded-xl border border-line bg-slate-50/50 p-1 sm:justify-start">
                    <button
                      onClick={() => shiftDate(-1)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-ink hover:shadow-sm transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <span className="flex-1 text-center text-sm font-bold text-ink select-none px-2 sm:min-w-[110px]">
                      {displayDate}
                    </span>

                    <button
                      onClick={() => shiftDate(1)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-ink hover:shadow-sm transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <CustomDatePicker
                    selectedDate={filterDate}
                    onChange={setFilterDate}
                  />
                </div>
              )}
            </div>
          </section>

          <RentalCard
            rentals={filteredRentals}
            activeTab={activeTab}
          />
        </div>
      )}
    </div>
  );
};

export default Rentals;
