import { ADMIN_ROLE_STORAGE_KEY, ADMIN_TOKEN_STORAGE_KEY } from './tokens';
import type { AppRole } from './roles';

export const saveAuthSession = (token: string, role: AppRole) => {
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, role);
};

export const saveAuthUser = (user: any) => {
  localStorage.setItem('camera_rental_house_user', JSON.stringify(user));
};

export const getAuthUser = () => {
  const stored = localStorage.getItem('camera_rental_house_user');
  return stored ? JSON.parse(stored) : null;
};
