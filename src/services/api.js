// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tms-backend-q1jq.onrender.com', // Adjust if deployed elsewhere
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Set this on login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
