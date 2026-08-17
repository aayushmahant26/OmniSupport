// This file is called the API Service Layer. 
// Its purpose is to keep all authentication-related API calls in one place.
// Instead of writing Axios requests inside every React component, you write them once here and reuse them.

import axiosClient from '../services/axiosClient';

export const authApi = {
  register: async (payload) => {
    const response = await axiosClient.post('/api/auth/register/', payload);
    return response.data;
  },

  login: async (payload) => {
    const response = await axiosClient.post('/api/auth/login/', payload);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosClient.get('/api/auth/profile/');
    return response.data;
  },
};
