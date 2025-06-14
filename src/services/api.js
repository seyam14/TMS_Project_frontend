// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/', // Adjust if deployed elsewhere
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Set this on login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
