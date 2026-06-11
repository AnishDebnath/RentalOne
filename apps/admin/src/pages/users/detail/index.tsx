import { Ban, Trash2, UserRoundCheck, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { useToast } from '@camera-rental-house/ui';
import ConfirmModal from '../../../components/ui/ConfirmModal';

// Components
import UserDetailHeader from './UserDetailHeader';
import UserPersonalInfo from './UserPersonalInfo';
import UserIdentityVerification from './UserIdentityVerification';
import UserSocialConnections from './UserSocialConnections';
import UserRentalHistory from './UserRentalHistory';
import UserDetailSkeleton from './UserDetailSkeleton';

const UserDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [verified, setVerified] = useState(false);
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [confirmType, setConfirmType] = useState<'block' | 'delete' | 'verify' | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  const isChanged = useCallback(
    (field: string) => !verified && changedFields.includes(field),
    [verified, changedFields]
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/admin/users/${id}`);
        setUser(response.data);
        setBlocked(response.data.is_blocked || false);
        setVerified(response.data.is_verified || false);
        setChangedFields(response.data.changed_fields || []);
      } catch (error) {
        addToast({ title: 'Error', message: 'Failed to fetch user details.', tone: 'error' });
        navigate('/users');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id, addToast, navigate]);

  const handleVerify = async () => {
    setIsUpdating(true);
    try {
      await axiosInstance.put(`/admin/users/${id}/verify`);
      setVerified(true);
      setChangedFields([]);
      addToast({ title: 'Success', message: 'User verified successfully.', tone: 'success' });
      setConfirmType(null);
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to verify user.', tone: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBlock = async () => {
    setIsUpdating(true);
    try {
      await axiosInstance.put(`/admin/users/${id}/block`);
      setBlocked(!blocked);
      addToast({ title: 'Success', message: `User ${blocked ? 'unblocked' : 'blocked'} successfully.`, tone: 'success' });
      setConfirmType(null);
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to update block status.', tone: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setDeleted(true);
      addToast({ title: 'Success', message: 'User deleted successfully.', tone: 'success' });
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to delete user.', tone: 'error' });
    } finally {
      setIsUpdating(false);
      setConfirmType(null);
    }
  };

  const onConfirmAction = () => {
    if (confirmType === 'verify') handleVerify();
    if (confirmType === 'block') handleBlock();
    if (confirmType === 'delete') handleDelete();
  };

  if (isLoading) {
    return (
      <div className="admin-shell space-y-5 py-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="group flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Users
          </button>
        </div>
        <UserDetailSkeleton />
      </div>
    );
  }

  if (deleted || !user) {
    return (
      <div className="admin-shell py-6">
        <div className="bg-white rounded-[1rem] border border-line shadow-sm space-y-4 p-6">
          <h1 className="text-3xl font-bold tracking-tight text-ink">User Removed</h1>
          <p className="text-sm font-medium text-muted">This user account has been removed from the system.</p>
          <button type="button" onClick={() => navigate('/users')} className="primary-button">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const hasOverdueRentals = (user?.rentals || []).some((rental: any) => {
    const isReleased = rental.status === 'released' || rental.status === 'active';
    const isOverdue = new Date().setHours(0,0,0,0) > new Date(rental.event_date || rental.return_date).setHours(0,0,0,0);
    return isReleased && isOverdue;
  });

  return (
    <div className="admin-shell space-y-5 py-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="group flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Users
        </button>
      </div>

      {hasOverdueRentals && (
        <div className="rounded-2xl bg-danger/10 border border-danger/20 p-4 flex items-start gap-3 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-danger animate-pulse shrink-0 mt-1" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-danger">Overdue Unreturned Gear Alert</p>
            <p className="text-xs font-medium text-danger/80 leading-relaxed">
              This user has rentals that are overdue and have not been returned yet. Please contact the user to return the products immediately.
            </p>
          </div>
        </div>
      )}

      <UserDetailHeader
        user={user}
        blocked={blocked}
        verified={verified}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="space-y-4 md:space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'details' ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <UserPersonalInfo user={user} isChanged={isChanged} />
              <UserIdentityVerification user={user} isChanged={isChanged} />
              <UserSocialConnections user={user} />

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                {!verified && !blocked && (
                  <button
                    type="button"
                    onClick={() => setConfirmType('verify')}
                    disabled={isUpdating}
                    className="pill-button border border-success/20 bg-success/10 text-success hover:bg-success hover:text-white disabled:opacity-50 sm:col-span-2"
                  >
                    <UserRoundCheck className="mr-2 h-4 w-4" />
                    Verify Account
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setConfirmType('block')}
                  disabled={isUpdating}
                  className={`pill-button border ${
                    blocked
                      ? 'border-success/20 bg-success/10 text-success hover:bg-success'
                      : 'border-warning/20 bg-warning/10 text-warning hover:bg-warning'
                  } hover:text-white disabled:opacity-50`}
                >
                  {blocked ? 'Unblock User' : 'Block User'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmType('delete')}
                  disabled={isUpdating}
                  className="pill-button border border-danger/20 bg-danger/5 text-danger hover:bg-danger hover:text-white disabled:opacity-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <UserRentalHistory rentals={user.rentals || []} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ConfirmModal
        isOpen={confirmType !== null}
        onClose={() => setConfirmType(null)}
        onConfirm={onConfirmAction}
        loading={isUpdating}
        tone={confirmType === 'delete' ? 'danger' : confirmType === 'block' ? 'warning' : 'success'}
        title={
          confirmType === 'delete'
            ? 'Delete User?'
            : confirmType === 'block'
            ? blocked
              ? 'Unblock User?'
              : 'Block User?'
            : 'Verify User?'
        }
        message={
          confirmType === 'delete'
            ? 'This action is permanent and will remove all user data and rental history. Are you sure?'
            : confirmType === 'block'
            ? blocked
              ? 'This will allow the user to log in and rent gear again.'
              : 'This will prevent the user from logging in or placing new rentals.'
            : 'This will mark the user as verified and allow them to rent gear. Have you verified their documents?'
        }
        confirmLabel={
          confirmType === 'delete'
            ? 'Delete Permanently'
            : confirmType === 'block'
            ? blocked
              ? 'Unblock'
              : 'Block User'
            : 'Verify & Accept'
        }
      />
    </div>
  );
};

export default UserDetailPage;
