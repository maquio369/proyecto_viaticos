import axios from 'axios';
import { API_BASE_URL } from './config';

// Configure default axios instance
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Security: Only send token to our own API
    // Relative URLs (starting with /) or URLs starting with our API_BASE_URL are safe
    const isExternal = config.url.startsWith('http') && !config.url.startsWith(API_BASE_URL);
    
    if (token && !isExternal) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error is 401 (Unauthorized), it means the session has expired
    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada o inválida. Redirigiendo al login...');

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentView'); // Optional: reset view

      // Force redirect to login (root in this SPA)
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axios;
