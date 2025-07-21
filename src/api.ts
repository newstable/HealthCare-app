import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Helper to decode JWT (naive, no validation)
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return parseJwt(token);
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

export default api; 