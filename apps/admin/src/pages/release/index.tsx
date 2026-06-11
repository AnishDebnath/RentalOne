import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import ReleaseSearch from './ReleaseSearch';
import ReleaseVerify from './ReleaseVerify';
import ReleaseSuccess from './ReleaseSuccess';

const ReleaseReturn = () => {
  const [searchId, setSearchId] = useState('');
  const [activeRental, setActiveRental] = useState<any>(null);
  const [scannedProducts, setScannedProducts] = useState<string[]>([]);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [representativeName, setRepresentativeName] = useState('');
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [substitutions, setSubstitutions] = useState<Record<string, string>>({});

  const handleSubstitute = (oldId: string, newProduct: any) => {
    setActiveRental((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        products: prev.products.map((p: any) => {
          if (p.id === oldId) {
            return {
              id: newProduct.id,
              name: newProduct.name,
              image: newProduct.images?.[0]?.image_url || newProduct.image || '',
              status: p.status,
              unique_code: newProduct.unique_code
            };
          }
          return p;
        })
      };
    });

    setSubstitutions((prev: any) => ({
      ...prev,
      [oldId]: newProduct.id
    }));

    setScannedProducts((prev) => {
      const filtered = prev.filter((id) => id !== oldId);
      return [...filtered, newProduct.id];
    });
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    setError(null);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/rentals/${searchId.trim()}`);
      const rental = response.data;

      if (['returned', 'cancelled', 'failed'].includes(rental.status)) {
        setError('This rental is already processed.');
        setLoading(false);
        return;
      }

      // Check if rental dates match today
      const today = new Date();
      const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

      const toLocalDateStr = (iso: string) => {
        if (!iso) return '';
        const d = new Date(iso);
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
      };

      const pickupLocalDate = toLocalDateStr(rental.pickup_date);
      const returnLocalDate = toLocalDateStr(rental.event_date);

      if (rental.status === 'confirmed' && pickupLocalDate !== todayStr) {
        setError(`This rental is scheduled for collection on ${pickupLocalDate}, not today.`);
        setLoading(false);
        return;
      } else if (rental.status === 'released' && returnLocalDate !== todayStr) {
        setError(`This rental is scheduled for return on ${returnLocalDate}, not today.`);
        setLoading(false);
        return;
      }

      // Map DB rental to UI format
      const mappedRental = {
        id: rental.id.split('-')[0].toUpperCase(),
        rental_no: rental.rental_no,
        full_id: rental.id,
        name: rental.users?.full_name || 'Guest',
        phone: rental.users?.phone || 'N/A',
        member_id: rental.users?.member_id,
        user_image: rental.users?.avatar_url || '',
        user_id: rental.user_id,
        pickup: rental.pickup_date,
        return_date: rental.event_date,
        status: rental.status,
        handover_proof: rental.handover_proof_url,
        houseName: rental.houseName,
        isHouseBooking: rental.is_house_booking || rental.users?.role === 'partner' || !!rental.houseName,
        representativeName: rental.representative_name || '',
        products: (rental.products || []).map((item: any) => ({
          id: item.id,
          name: item.name || 'Unknown',
          image: item.image || '',
          status: item.status,
          unique_code: item.unique_code
        }))
      };

      setActiveRental(mappedRental);
      if (mappedRental.handover_proof) {
        setProofPhoto(mappedRental.handover_proof);
      }
      if (mappedRental.representativeName) {
        setRepresentativeName(mappedRental.representativeName);
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.response?.data?.message || 'Booking ID not found. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActiveRental(null);
    setSearchId('');
    setScannedProducts([]);
    setIsUserVerified(false);
    setProofPhoto(null);
    setIsComplete(false);
    setError(null);
    setSubstitutions({});
  };

  const handleRelease = async () => {
    if (!activeRental || scannedProducts.length === 0) return;

    if (activeRental.isHouseBooking && !representativeName.trim()) {
      const isReturn = activeRental.status === 'released' || activeRental.products.some((p: any) => p.status === 'released');
      setError(isReturn ? 'Name of person returning gear is required.' : 'Name of person picking up gear is required.');
      
      // Scroll to Step 2 section where input is located
      const inputEl = document.querySelector('input[placeholder*="Name of person"]');
      if (inputEl) {
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (inputEl as HTMLInputElement).focus();
      }
      return;
    }

    setLoading(true);
    try {
      const isReturn = activeRental.status === 'released' || activeRental.products.some((p: any) => p.status === 'released');
      const endpoint = isReturn ? '/manage/bulk-return' : '/manage/bulk-release';

      console.log('[Release] Sending request to:', endpoint, {
        rentalId: activeRental.full_id,
        productIds: scannedProducts,
        hasPhoto: !!proofPhoto
      });

      await axiosInstance.post(endpoint, {
        rentalId: activeRental.full_id,
        productIds: scannedProducts,
        proofPhoto: proofPhoto,
        receivedBy: representativeName,
        substitutions
      });

      setIsComplete(true);
    } catch (err: any) {
      console.error('Action failed:', err);
      setError(err.response?.data?.message || 'Failed to process products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleProductScan = (id: string) => {
    setScannedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (isComplete) {
    return <ReleaseSuccess rental={activeRental} onReset={handleReset} isReturn={activeRental.status === 'released'} />;
  }

  return (
    <div className="admin-shell py-8">
      {/* Header — only show when rental record is loaded */}
      {activeRental && (
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {activeRental.status === 'released' ? 'Return Products' : 'Release Products'}
            </h1>
            <p className="mt-1.5 text-xs font-medium text-muted sm:text-sm">
              {activeRental.status === 'released'
                ? 'Verify returned products and update inventory.'
                : 'Verify products and user identity for secure handover.'}
            </p>
          </div>
        </header>
      )}

      {loading && (
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
          <p className="text-sm font-bold text-muted">Searching rental records...</p>
        </div>
      )}

      {!loading && (
        <AnimatePresence mode="wait">
          {!activeRental ? (
            <ReleaseSearch
              key="search"
              searchId={searchId}
              setSearchId={setSearchId}
              onSearch={handleSearch}
              error={error}
            />
          ) : (
            <ReleaseVerify
              key="verify"
              rental={activeRental}
              scannedProducts={scannedProducts}
              onVerifyProduct={toggleProductScan}
              isUserVerified={isUserVerified}
              onToggleVerify={() => setIsUserVerified((v) => !v)}
              representativeName={representativeName}
              setRepresentativeName={(val) => {
                setRepresentativeName(val);
                if (error && val.trim() !== '') setError(null);
              }}
              proofPhoto={proofPhoto}
              onCapture={(photo) => setProofPhoto(photo)}
              onClearPhoto={() => setProofPhoto(null)}
              onRelease={handleRelease}
              onReset={handleReset}
              onSubstitute={handleSubstitute}
              error={error}
              isReturn={activeRental.status.toLowerCase() === 'released' || activeRental.status.toLowerCase() === 'active'}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ReleaseReturn;
