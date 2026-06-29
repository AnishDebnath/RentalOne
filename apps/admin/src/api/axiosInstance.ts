import axios from 'axios';
import { ADMIN_TOKEN_STORAGE_KEY, ADMIN_ROLE_STORAGE_KEY } from '@camera-rental-house/shared';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const CLIENT_APP_URL = import.meta.env.VITE_CLIENT_APP_URL || import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5173';

if (!API_URL && import.meta.env.PROD) {
  console.error('CRITICAL: VITE_API_URL or VITE_API_BASE_URL must be set in production for API calls to work.');
}
const axiosInstance = axios.create({
  baseURL: API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Auth failure guards ───────────────────────────────────────────────
// These prevent a request storm when the token is expired:
// multiple parallel 401s → multiple refresh attempts → rate limit exhaustion.
let isRefreshing = false;
let isRedirectingToLogin = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

/**
 * Clear ALL auth-related data from localStorage
 */
const clearAllAuthData = () => {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  localStorage.removeItem(ADMIN_ROLE_STORAGE_KEY);
  localStorage.removeItem('camera_rental_house_user');
};

/**
 * Redirect to the client login page (bypassing the admin login route)
 */
const redirectToLogin = () => {
  if (isRedirectingToLogin) return;
  isRedirectingToLogin = true;

  const currentPath = window.location.pathname + window.location.search;
  const loginUrl = `${CLIENT_APP_URL}/login?next=${encodeURIComponent(currentPath)}`;
  window.location.replace(loginUrl);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors from API calls (not from the refresh endpoint itself)
    if (error.response?.status !== 401 || originalRequest._isRefreshAttempt) {
      return Promise.reject(error);
    }

    // If we're already redirecting, don't queue anything
    if (isRedirectingToLogin) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${axiosInstance.defaults.baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const { accessToken } = response.data;
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, accessToken);
      processQueue(null, accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAllAuthData();
      processQueue(refreshError, null);
      redirectToLogin();
      // Return the original error so the caller can still handle it
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
