import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '@camera-rental-house/ui';
import StaffHeader from './StaffHeader';
import StaffList from './StaffList';
import StaffSkeleton from './StaffSkeleton';


const Staff = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const fetchStaff = async () => {
    try {
      const response = await axiosInstance.get('/admin/staff');
      const rolePriority: Record<string, number> = { admin: 0, manager: 1, staff: 2 };
      const sortedStaff = (response.data || []).sort((a: any, b: any) => {
        const priorityA = rolePriority[a.role] ?? 99;
        const priorityB = rolePriority[b.role] ?? 99;
        return priorityA - priorityB;
      });
      setStaff(sortedStaff);
    } catch (error) {
      console.error('Staff fetch error:', error);
      addToast({ title: 'Error', message: 'Failed to fetch staff list', tone: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="admin-shell py-8">
      <StaffHeader />
      <div className="mt-6">
        {isLoading ? (
          <StaffSkeleton />
        ) : staff && staff.length > 0 ? (
          <StaffList staff={staff} />
        ) : (
          <div className="rounded-2xl border border-dashed border-line p-12 text-center">
            <p className="text-muted font-medium">No team members found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;
