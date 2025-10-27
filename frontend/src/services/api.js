import axios from 'axios';

// Handle both environment variable and fallback
const getBaseURL = () => {
  const envURL = process.env.REACT_APP_BACKEND_URL;
  
  // If environment variable is set and valid, use it
  if (envURL && envURL !== 'undefined' && envURL.trim() !== '') {
    return `${envURL}/api`;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:8001/api';
};

const API_BASE_URL = getBaseURL();

console.log('🔗 API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;