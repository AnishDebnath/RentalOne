import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) - Expired Token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.post('/auth/refresh');
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed (refresh token expired) -> logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('camera_rental_house_user');
        // Optional: redirect to login if we can access navigate or window.location
        // window.location.href = '/login'; 
      }
    }

    const data = error.response?.data;
    const message = data?.message || error.message || 'Network error occurred.';
    
    // Create a standard error object so .message always works
    const enhancedError = new Error(message);
    (enhancedError as any).fieldErrors = data?.fieldErrors;
    (enhancedError as any).response = error.response;
    (enhancedError as any).exists = data?.exists;
    
    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;
