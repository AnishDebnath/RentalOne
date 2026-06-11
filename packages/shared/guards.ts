import { ADMIN_ROLE_STORAGE_KEY, ADMIN_TOKEN_STORAGE_KEY } from './tokens';
import { isValidRole, type AppRole } from './roles';

export const getAuthRole = (): AppRole => {
  const storedRole =
    typeof localStorage === 'undefined' ? null : localStorage.getItem(ADMIN_ROLE_STORAGE_KEY);

  return isValidRole(storedRole) ? storedRole : 'admin';
};

export const hasAdminSession = () => {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY));
};

export const hasUserSession = () => {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem('camera_rental_house_user'));
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  localStorage.removeItem(ADMIN_ROLE_STORAGE_KEY);
  localStorage.removeItem('camera_rental_house_user');
  localStorage.removeItem('accessToken');
};
