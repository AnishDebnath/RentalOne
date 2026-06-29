import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import axiosInstance from '../api/axiosInstance';
import { useToast } from '@camera-rental-house/ui';

export interface User {
  id: string;
  memberId?: string;
  fullName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  userQrBase64?: string;
  aadhaarNo?: string;
  aadhaarDocUrl?: string;
  voterNo?: string;
  voterDocUrl?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  role: string;
  isHouseOwner?: boolean;
  isVerified: boolean;
  createdAt?: string;
}

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  rentals: any[];
  login: (credentials: any, options?: { silent?: boolean }) => Promise<any>;
  signup: (formData: FormData) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  logout: (options?: { silent?: boolean }) => void;
  refreshRentals: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('camera_rental_house_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [rentals, setRentals] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('camera_rental_house_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('camera_rental_house_user');
    }
  }, [user]);

  const login = useCallback(async (credentials: any, options?: { silent?: boolean }) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    const { user: data, accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(data);
    if (!options?.silent) {
      addToast({ title: 'Welcome back', message: 'Logged in successfully.', tone: 'success' });
    }
    return response.data;
  }, [addToast]);

  const signup = useCallback(async (formData: FormData) => {
    try {
      const response = await axiosInstance.post('/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { user: data, accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(data);
      addToast({ title: 'Account created', message: 'Registration complete.', tone: 'success' });
    } catch (error: any) {
      throw error;
    }
  }, [addToast]);

  const updateProfile = useCallback(async (updates: any) => {
    try {
      const finalUpdates = { ...updates };
      // Remove internal/read-only fields that shouldn't be sent back to server
      delete (finalUpdates as any).aadhaarDocUrl;
      delete (finalUpdates as any).voterDocUrl;
      delete (finalUpdates as any).avatarUrl;
      delete (finalUpdates as any).userQrBase64;
      delete (finalUpdates as any).createdAt;
      delete (finalUpdates as any).id;
      delete (finalUpdates as any).memberId;

      const hasFiles = finalUpdates.aadhaarDoc instanceof File || finalUpdates.voterDoc instanceof File || finalUpdates.selfie instanceof File;
      let payload: any = finalUpdates;

      if (hasFiles) {
        const formData = new FormData();
        Object.entries(finalUpdates).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as any);
          }
        });
        payload = formData;
      }

      const response = await axiosInstance.patch('/auth/update-profile', payload);

      const { user: updatedUser } = response.data;
      setUser(updatedUser);
      addToast({ title: 'Profile updated', message: 'Your changes were saved successfully.', tone: 'success' });
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      throw error;
    }
  }, [addToast]);

  const logout = useCallback((options?: { silent?: boolean }) => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('camera_rental_house_admin_token');
    localStorage.removeItem('camera_rental_house_admin_role');
    if (!options?.silent) {
      addToast({ title: 'Signed out', message: 'You have been logged out.', tone: 'info' });
    }
  }, [addToast]);

  const refreshRentals = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/rentals/my');
      setRentals(response.data.data || []);
    } catch (error) {
      console.error('Failed to refresh rentals:', error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      rentals,
      login,
      signup,
      updateProfile,
      logout,
      refreshRentals,
      refreshUser,
    }),
    [user, rentals, login, signup, updateProfile, logout, refreshRentals, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
