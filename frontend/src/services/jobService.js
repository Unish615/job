import api from './api';

export const jobService = {
  searchJobs: async (params = {}) => {
    const res = await api.get('/jobs', { params });
    return res.data;
  },

  getJobById: async (id) => {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },

  getFeaturedJobs: async () => {
    const res = await api.get('/jobs/featured');
    return res.data;
  },

  getCategoryCounts: async () => {
    const res = await api.get('/jobs/categories');
    return res.data;
  },

  getEmployerJobs: async () => {
    const res = await api.get('/jobs/employer/my');
    return res.data;
  },

  createJob: async (jobData) => {
    const res = await api.post('/jobs', jobData);
    return res.data;
  },

  updateJob: async (id, jobData) => {
    const res = await api.put(`/jobs/${id}`, jobData);
    return res.data;
  },

  deleteJob: async (id) => {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  },
};
