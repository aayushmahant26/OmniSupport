// This is one of the most important frontend files in your project.
// Its purpose is to create a single Axios instance that automatically attaches
// JWT tokens to every request and automatically refreshes expired access tokens
// without the user noticing. Without this file, you'd have to write the same
// authentication code in every API call.

import axios from 'axios';

const axiosClient = axios.create({
  // Uses base URL so that requests go to Vite server, proxying to backend
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Token dynamically
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor to handle JWT token expiration or 401s
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const isAuthUrl = originalRequest.url?.includes('/api/auth/login/') ||
        originalRequest.url?.includes('/api/auth/register/') ||
        originalRequest.url?.includes('/api/auth/token/refresh/');

      if (isAuthUrl) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new Event('auth-logout'));
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('/api/auth/token/refresh/', {
          refresh: refreshToken
        });
        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth-logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
