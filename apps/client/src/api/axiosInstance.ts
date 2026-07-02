import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
if (!API_URL && import.meta.env.PROD) {
  console.error('CRITICAL: VITE_API_URL or VITE_API_BASE_URL must be set in production for API calls to work.');
}
const axiosInstance = axios.create({
  baseURL: API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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
  localStorage.removeItem('accessToken');
  localStorage.removeItem('camera_rental_house_user');
};

/**
 * Redirect to the login page (bypassing the current route)
 */
const redirectToLogin = () => {
  if (isRedirectingToLogin) return;
  isRedirectingToLogin = true;

  const currentPath = window.location.pathname + window.location.search;
  const loginUrl = `/login?next=${encodeURIComponent(currentPath)}`;
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

    // Don't intercept 401 on auth endpoints — login returns 401 for bad creds, not expired token
    if (originalRequest.url?.includes('/auth/')) {
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
    originalRequest._isRefreshAttempt = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${axiosInstance.defaults.baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
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
