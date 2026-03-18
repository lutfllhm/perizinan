import axios from 'axios';

function normalizeApiBaseUrl(input) {
  if (!input) return '';
  const trimmed = String(input).trim();
  if (!trimmed) return '';
  // Allow user to set either:
  // - https://domain.com        -> will become https://domain.com/api
  // - https://domain.com/api    -> kept as-is
  // - /api                     -> becomes /api (no double /api/api)
  // - /                        -> becomes '' (same-origin)
  if (trimmed === '/') return '';
  if (trimmed === '/api') return '/api';
  if (trimmed.endsWith('/api')) return trimmed;
  return trimmed;
}

// Gunakan environment variable untuk API base URL
// Development default: http://localhost:5000
// Production default: same-origin (empty string) so Nginx can proxy /api
const RAW_API_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== 'undefined' && window.location?.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '');

const API_BASE = normalizeApiBaseUrl(RAW_API_URL);

const baseURL =
  API_BASE === '/api'
    ? '/api'
    : `${API_BASE}/api`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerHRD: (data) => api.post('/auth/register-hrd', data),
  getUsers: () => api.get('/auth/users'),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const pengajuanAPI = {
  submit: (formData) => api.post('/pengajuan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => api.get('/pengajuan'),
  updateStatus: (id, data) => api.put(`/pengajuan/${id}`, data),
  delete: (id) => api.delete(`/pengajuan/${id}`),
  getStats: () => api.get('/pengajuan/stats/dashboard'),
  getReport: (params) => api.get('/pengajuan/report', { params }),
};

export const karyawanAPI = {
  getAll: (params) => api.get('/karyawan', { params }),
  getAllWithQuota: () => api.get('/karyawan/all/with-quota'),
  getById: (id) => api.get(`/karyawan/${id}`),
  getQuota: (id) => api.get(`/karyawan/${id}/quota`),
  create: (data) => api.post('/karyawan', data),
  update: (id, data) => api.put(`/karyawan/${id}`, data),
  resetCuti: (id, data) => api.post(`/karyawan/${id}/reset-cuti`, data),
  delete: (id) => api.delete(`/karyawan/${id}`),
};

// Export API_BASE untuk digunakan di komponen lain (misal untuk image URL)
export { API_BASE as API_URL };

export default api;
