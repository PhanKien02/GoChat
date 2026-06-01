import axios from 'axios';
import { useChatStore } from '@/store/chatStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies when cross-domain requests
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You can attach tokens from localStorage here if needed,
    // though HttpOnly cookies (withCredentials: true) are better.
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (e.g., 401 Unauthorized -> redirect to login)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        useChatStore.getState().clearStore();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
