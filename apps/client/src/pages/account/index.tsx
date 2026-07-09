import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Camera, PackageSearch, UserRound } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useToast, useLenis } from '@rentalone/ui';
import { resolveAuthAppUrl } from '@rentalone/shared';

import AccountHeader from './AccountHeader';
import AccountTabs from './AccountTabs';
import AccountDetailsTab from './AccountDetailsTab';
import ActiveRentalsTab from './ActiveRentalsTab';
import RentalHistoryTab from './RentalHistoryTab';
import QrModal from './QrModal';
import { motion, AnimatePresence } from 'framer-motion';

const authAppUrl = resolveAuthAppUrl(import.meta.env.VITE_AUTH_APP_URL);

const TABS = [
  { id: 'active', label: 'Active Rentals', icon: Camera },
  { id: 'history', label: 'Rental History', icon: PackageSearch },
  { id: 'details', label: 'Account Details', icon: UserRound },
] as const;

type TabId = (typeof TABS)[number]['id'];

const Account = () => {
  const { user, rentals, refreshRentals, refreshUser, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  const lenis = useLenis();
  const location = useLocation();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(user);
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const [showQrFullScreen, setShowQrFullScreen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as TabId;
    if (tabParam && ['details', 'active', 'history'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    refreshRentals();
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) setDraft(user);
  }, [user]);

  // Handle scroll lock (Lenis) when QR modal is open
  useEffect(() => {
    if (showQrFullScreen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => lenis?.start();
  }, [showQrFullScreen, lenis]);

  if (!user) {
    return null;
  }

  // Group rentals logically
  const pastRentals = rentals.filter((rental) =>
    ['returned', 'cancelled', 'failed', 'lost', 'closed'].includes(rental.status) ||
    ((rental.products || []).length > 0 && (rental.products || []).every((item: any) => ['returned', 'lost', 'damaged', 'failed', 'cancelled'].includes(item.status)))
  );

  const activeRentals = rentals.filter((rental) => !pastRentals.includes(rental));

  const validateDraft = () => {
    const newErrors: Record<string, string> = {};
    if (!draft.fullName) newErrors.fullName = "Full Name is required";

    if (!draft.phone) newErrors.phone = "Phone Number is required";
    else if (!/^\d{10}$/.test(draft.phone.replace(/\D/g, ''))) newErrors.phone = "Invalid phone number";

    if (!draft.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) newErrors.email = "Invalid email address";

    if (!draft.aadhaarNo) newErrors.aadhaarNo = "Aadhaar Number is required";
    else if (!/^\d{12}$/.test(draft.aadhaarNo.replace(/\D/g, ''))) newErrors.aadhaarNo = "Invalid aadhaar number";

    if (!draft.voterNo) newErrors.voterNo = "Voter ID is required";
    else if (draft.voterNo.length < 10) newErrors.voterNo = "Invalid Voter ID";

    if (!draft.facebook) newErrors.facebook = "Facebook URL is required";
    else if (!/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+/.test(draft.facebook)) newErrors.facebook = "Invalid Facebook URL";

    if (!draft.instagram) newErrors.instagram = "Instagram URL is required";
    else if (!/^(https?:\/\/)?(www\.)?instagram\.com\/.+/.test(draft.instagram) && !/^@?[a-zA-Z0-9._]+$/.test(draft.instagram)) newErrors.instagram = "Invalid Instagram URL";

    if (draft.youtube && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(draft.youtube)) {
      newErrors.youtube = "Invalid YouTube URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!draft) return;
    if (!validateDraft()) {
      addToast({ title: 'Validation Failed', message: 'Please fix the highlighted errors.', tone: 'error' });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await updateProfile(draft);
      setEditing(false);
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      const data = error.response?.data;
      const message = data?.message || error.message || 'Failed to update profile';
      const fieldErrors = data?.fieldErrors;

      addToast({ title: 'Error', message, tone: 'error' });

      if (fieldErrors) {
        setErrors(fieldErrors);
      } else {
        const lowercaseMsg = message.toLowerCase();
        if (lowercaseMsg.includes('email')) setErrors(prev => ({ ...prev, email: message }));
        else if (lowercaseMsg.includes('phone')) setErrors(prev => ({ ...prev, phone: message }));
        else if (lowercaseMsg.includes('aadhaar')) setErrors(prev => ({ ...prev, aadhaarNo: message }));
        else if (lowercaseMsg.includes('voter')) setErrors(prev => ({ ...prev, voterNo: message }));
        else setErrors(prev => ({ ...prev, general: message }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    window.location.replace(`${authAppUrl}/login`);
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="page-animate app-shell space-y-6 pb-2 pt-2 md:space-y-8">
      <AccountHeader
        user={user}
        onSignOut={handleSignOut}
        onOpenQr={() => setShowQrFullScreen(true)}
      />

      <AccountTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="tab-content relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {activeTab === 'details' && draft && (
              <AccountDetailsTab
                draft={draft}
                editing={editing}
                loading={loading}
                hasActiveRentals={activeRentals.length > 0}
                activeRentals={activeRentals}
                onSetEditing={(val) => {
                  const nextValue = typeof val === 'function' ? val(editing) : val;
                  if (!nextValue) setDraft(user);
                  setErrors({}); // Clear errors on toggle
                  setEditing(nextValue);
                }}
                onDraftChange={(key, value) => {
                  setDraft((prev: any) => ({ ...prev, [key]: value }));
                  if (Object.keys(errors).length > 0) setErrors({});
                }}
                onSave={handleSave}
                errors={errors}
              />
            )}

            {activeTab === 'active' && (
              <ActiveRentalsTab activeRentals={activeRentals} />
            )}

            {activeTab === 'history' && (
              <RentalHistoryTab pastRentals={pastRentals} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <QrModal
        show={showQrFullScreen}
        onClose={setShowQrFullScreen}
        user={user}
        memberSince={memberSince}
        lenis={lenis}
      />
    </div>
  );
};

export default Account;
