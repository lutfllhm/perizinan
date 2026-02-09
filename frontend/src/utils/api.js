import axios from 'axios';

// Gunakan environment variable untuk API URL
// Development: http://localhost:5000
// Production: Relative path untuk Hostinger
const API_URL = process.env.REACT_APP_API_URL || '';

console.log('🔗 API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

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

// Export API_URL untuk digunakan di komponen lain (misal untuk image URL)
export { API_URL };

export default api;
