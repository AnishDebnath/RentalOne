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

export default axiosInstance;
