import axios from 'axios';
import { message } from 'antd';

// Same-origin in dev thanks to the Vite proxy; withCredentials for the session cookie.
// Override the base URL for production builds via VITE_API_BASE_URL (see .env.example).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: surface backend error messages; redirect on 401.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const msg = data?.message || error.message || 'Request failed';

    if (status === 401) {
      const PUBLIC_PATHS = ['/', '/login'];
      const isPublic = PUBLIC_PATHS.includes(window.location.pathname);
      if (!isPublic) {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      message.error('You do not have permission to perform this action');
    } else if (status >= 500) {
      message.error('Server error: ' + msg);
    }
    return Promise.reject(error);
  }
);

export default api;
