// axios/axios.jsx
import axios from "axios";

const environment = import.meta.env.VITE_APP_ENV;

const url =
  environment === "test"
    ? import.meta.env.VITE_APP_BASE_TEST_URL
    : environment === "development"
      ? import.meta.env.VITE_APP_BASE_DEV_URL
      : import.meta.env.VITE_APP_BASE_PROD_URL;

export const http = axios.create({
  baseURL: url,
  withCredentials: true,
  timeout: 30000,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`✅ [${config.method?.toUpperCase()}] ${config.url} - Token attached`);
    } else {
      console.log(`⚠️ [${config.method?.toUpperCase()}] ${config.url} - No token`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with token refresh
http.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Don't retry login or checkauth requests
    if (originalRequest.url?.includes('/loginuser') || originalRequest.url?.includes('/checkauth')) {
      // For checkauth, just reject - don't try to refresh
      if (originalRequest.url?.includes('/checkauth')) {
        console.warn("⚠️ Auth check failed, token may be expired");
        // Don't clear token here, let the app handle it
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
    
    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while token is being refreshed
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return http(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const response = await http.post('/refresh-token', {}, { withCredentials: true });
        const { token } = response.data;
        
        if (token) {
          localStorage.setItem('token', token);
          http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          processQueue(null, token);
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return http(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        processQueue(refreshError, null);
        
        // Clear expired token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other errors
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 error:", error.response?.data?.message);
    }
    
    return Promise.reject(error);
  }
);