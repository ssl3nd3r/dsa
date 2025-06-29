import axios from 'axios';

// Get the API URL from environment or use a fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to automatically include bearer token
api.interceptors.request.use((config) => {
  // Only add token if we're in the browser (not during SSR)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor to handle token expiration and authentication
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 (Unauthorized), the token might be expired or invalid
    if (error.response?.status === 401) {
      // Remove the expired token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        
        // Check if we're not already on the login page to avoid infinite redirects
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath === '/login' || currentPath === '/auth/login';
        const isRegisterPage = currentPath === '/register' || currentPath === '/auth/register';
        
        if (!isLoginPage && !isRegisterPage) {
          // Redirect to login page
          window.location.href = '/login';
        }
      }
    }
    
    // Handle 403 Forbidden (user doesn't have permission)
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        // Redirect to unauthorized page or show error
        window.location.href = '/unauthorized';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 