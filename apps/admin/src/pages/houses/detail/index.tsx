import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Building2, PlusCircle } from 'lucide-react';
import { useToast } from '@camera-rental-house/ui';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../../api/axiosInstance';

// Components
import DetailHeader from './DetailHeader';
import DetailStats from './DetailStats';
import OwnerCredentials from './OwnerCredentials';
import HousePayments from './HousePayments';
import DetailHistory from './DetailHistory';
import HouseDetailSkeleton from './HouseDetailSkeleton';

const HouseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [house, setHouse] = useState<any>(null);
  const [houseRentals, setHouseRentals] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'details' | 'credentials'>('details');

  const fetchHouseData = useCallback(async () => {
    try {
      const [detailRes, rentalsRes] = await Promise.all([
        axiosInstance.get(`/admin/houses/slug/${slug}`),
        axiosInstance.get(`/rentals/house/slug/${slug}`)
      ]);
      
      setHouse(detailRes.data);
      setHouseRentals(rentalsRes.data || []);

      if (detailRes.data.users?.email) {
        setCredentials(prev => ({ ...prev, username: detailRes.data.users.email }));
      }
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to fetch house details.', tone: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [slug, addToast]);

  useEffect(() => {
    if (slug) fetchHouseData();
  }, [slug, fetchHouseData]);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.password) return;
    setIsUpdatingCreds(true);
    try {
      await axiosInstance.post(`/admin/houses/${house.id}/credentials`, credentials);
      addToast({ title: 'Success', message: 'Credentials updated successfully.', tone: 'success' });
      setCredentials(prev => ({ ...prev, password: '' }));
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to update credentials.', tone: 'error' });
    } finally {
      setIsUpdatingCreds(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-shell py-6 space-y-5">
        {/* Navigation Header */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <button
            onClick={() => navigate('/houses')}
            className="group flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Houses
          </button>

          <div className="flex items-center gap-3">
            <Link
              to={`/houses/${slug}/booking`}
              className="primary-button group text-[11px] font-black uppercase tracking-widest px-6"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </div>
        </div>
        <HouseDetailSkeleton />
      </div>
    );
  }

  if (!house) {
    return (
      <div className="admin-shell py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-slate-50 text-slate-300">
          <Building2 className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-black text-ink">Production House Not Found</h2>
        <p className="mt-2 text-sm font-medium text-muted">The record you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/houses')}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </button>
      </div>
    );
  }

  const hasOverdueRentals = houseRentals.some((rental: any) => {
    const isReleased = rental.status.toLowerCase() === 'released' || rental.status.toLowerCase() === 'active';
    const isOverdue = new Date().setHours(0,0,0,0) > new Date(rental.event_date || rental.return_date).setHours(0,0,0,0);
    return isReleased && isOverdue;
  });

  return (
    <div className="admin-shell space-y-5 py-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <button
          onClick={() => navigate('/houses')}
          className="group flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Houses
        </button>

        <div className="flex items-center gap-3">
          <Link
            to={`/houses/${slug}/booking`}
            className="primary-button group text-[11px] font-black uppercase tracking-widest px-6"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </div>
      </div>

      {hasOverdueRentals && (
        <div className="rounded-2xl bg-danger/10 border border-danger/20 p-4 flex items-start gap-3 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-danger animate-pulse shrink-0 mt-1" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-danger">Overdue Unreturned Gear Alert</p>
            <p className="text-xs font-medium text-danger/80 leading-relaxed">
              This production house has rentals that are overdue and have not been returned yet. Please contact them to return the products immediately.
            </p>
          </div>
        </div>
      )}

      <DetailHeader house={house} activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence mode="wait">
        {activeTab === 'details' ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <DetailStats house={house} />
            <HousePayments houseId={house.id} onRefresh={fetchHouseData} />
            <DetailHistory
              rentals={houseRentals}
              expandedOrderId={expandedOrderId}
              setExpandedOrderId={setExpandedOrderId}
              onRefresh={fetchHouseData}
            />
          </motion.div>
        ) : (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <OwnerCredentials
              house={house}
              credentials={credentials}
              setCredentials={setCredentials}
              isUpdating={isUpdatingCreds}
              onUpdate={handleUpdateCredentials}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HouseDetailPage;
