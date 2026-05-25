import axios from 'axios';

// Apuntamos al backend Node.js
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const uid = localStorage.getItem('uid');
  if (uid) {
    config.headers.Authorization = `Bearer ${uid}`;
  }
  return config;
});

export default api;