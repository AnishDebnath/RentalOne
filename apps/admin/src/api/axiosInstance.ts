import axios from 'axios';
import { ADMIN_TOKEN_STORAGE_KEY, ADMIN_ROLE_STORAGE_KEY } from '@camera-rental-house/shared';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Expired Token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken } = response.data;
        localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        localStorage.removeItem(ADMIN_ROLE_STORAGE_KEY);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
