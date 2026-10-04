import api from './api';

export const savedJobService = {
  saveJob: async (jobId) => {
    const res = await api.post(`/saved-jobs/${jobId}`);
    return res.data;
  },

  removeSavedJob: async (jobId) => {
    const res = await api.delete(`/saved-jobs/${jobId}`);
    return res.data;
  },

  getSavedJobs: async () => {
    const res = await api.get('/saved-jobs');
    return res.data;
  },
};
