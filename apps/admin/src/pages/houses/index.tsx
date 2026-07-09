import { useState, useMemo, useEffect } from 'react';
import HouseHeader from './HouseHeader';
import HouseStats from './HouseStats';
import HouseFilters from './HouseFilters';
import HouseCard from './HouseCard';
import HouseModal from './HouseModal';
import HouseSkeleton from './HouseSkeleton';
import { useToast } from '@rentalone/ui';
import axiosInstance from '../../api/axiosInstance';

const ProductionHouses = () => {
  const [houses, setHouses] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalHouses: 0, activeItems: 0, totalRevenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const fetchHouses = async () => {
    try {
      const [housesRes, statsRes] = await Promise.all([
        axiosInstance.get('/admin/houses'),
        axiosInstance.get('/admin/houses/stats')
      ]);
      setHouses(housesRes.data?.data || []);
      setStats(statsRes.data);
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to fetch production houses.', tone: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const filteredHouses = useMemo(() => {
    let result = houses;
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        result = result.filter(h => (h.rentalStatus || (h.hasActiveRental ? 'active' : 'no-rental')) === 'active');
      } else if (statusFilter === 'no-rental') {
        result = result.filter(h => (h.rentalStatus || (h.hasActiveRental ? 'active' : 'no-rental')) === 'no-rental');
      } else if (statusFilter === 'overdue') {
        result = result.filter(h => (h.rentalStatus || (h.hasActiveRental ? 'active' : 'no-rental')) === 'overdue');
      } else {
        result = result.filter(h => h.status?.toLowerCase() === statusFilter);
      }
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(h =>
        h.name?.toLowerCase().includes(lower) ||
        h.owner_name?.toLowerCase().includes(lower) ||
        h.phone?.includes(lower)
      );
    }
    return result;
  }, [houses, searchTerm, statusFilter]);

  const handleAddSuccess = (newHouse: any) => {
    setHouses(prev => [newHouse, ...prev]);
    addToast({
      title: 'Success',
      message: 'Production house registered successfully.',
      tone: 'success'
    });
  };

  return (
    <div className="admin-shell space-y-5 py-6">
      <HouseHeader onAddClick={() => setIsModalOpen(true)} />

      {isLoading ? (
        <HouseSkeleton />
      ) : (
        <>
          <HouseStats
            totalHouses={stats.totalHouses}
            activeRentals={stats.activeItems}
            revenue={`₹${stats.totalRevenue.toLocaleString()}`}
          />

          <HouseFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <HouseCard houses={filteredHouses} />
        </>
      )}

      <HouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default ProductionHouses;

