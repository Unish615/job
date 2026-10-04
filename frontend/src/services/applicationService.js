import api from './api';

export const applicationService = {
  applyForJob: async (applicationData) => {
    const res = await api.post('/applications', applicationData);
    return res.data;
  },

  getMyApplications: async () => {
    const res = await api.get('/applications/my');
    return res.data;
  },

  getEmployerApplications: async (jobId = null) => {
    const res = await api.get('/applications/employer', {
      params: jobId ? { jobId } : {},
    });
    return res.data;
  },

  updateStatus: async (applicationId, status) => {
    const res = await api.put(`/applications/${applicationId}/status`, { status });
    return res.data;
  },

  cancelApplication: async (applicationId) => {
    const res = await api.delete(`/applications/${applicationId}`);
    return res.data;
  },
};
