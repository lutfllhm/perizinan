import axios from 'axios';

// Gunakan environment variable untuk API URL
// Development: http://localhost:5000
// Production: https://perizinan-production.up.railway.app
const API_URL = process.env.REACT_APP_API_URL || 'https://perizinan-production.up.railway.app';

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

// Export API_URL untuk digunakan di komponen lain (misal untuk image URL)
export { API_URL };

export default api;
