import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  getAllUsers: async (params = {}) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  updateUser: async (id, data) => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  getAllJobSeekers: async () => {
    const res = await api.get('/admin/job-seekers');
    return res.data;
  },

  getAllEmployers: async () => {
    const res = await api.get('/admin/employers');
    return res.data;
  },

  getAllJobs: async (params = {}) => {
    const res = await api.get('/admin/jobs', { params });
    return res.data;
  },

  deleteJob: async (id) => {
    const res = await api.delete(`/admin/jobs/${id}`);
    return res.data;
  },

  getAllApplications: async () => {
    const res = await api.get('/admin/applications');
    return res.data;
  },
};
