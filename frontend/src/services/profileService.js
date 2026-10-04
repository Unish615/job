import api from './api';

export const profileService = {
  // Job Seeker Profile
  getJobSeekerProfile: async () => {
    const res = await api.get('/job-seekers/profile');
    return res.data;
  },

  updateJobSeekerProfile: async (data) => {
    const res = await api.put('/job-seekers/profile', data);
    return res.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/job-seekers/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  removeResume: async () => {
    const res = await api.delete('/job-seekers/profile/resume');
    return res.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/job-seekers/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteJobSeekerAccount: async () => {
    const res = await api.delete('/job-seekers/profile');
    return res.data;
  },

  // Employer Profile
  getEmployerProfile: async () => {
    const res = await api.get('/employer/profile');
    return res.data;
  },

  updateEmployerProfile: async (data) => {
    const res = await api.put('/employer/profile', data);
    return res.data;
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/employer/profile/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteEmployerAccount: async () => {
    const res = await api.delete('/employer/profile');
    return res.data;
  },

  // Public Companies
  getAllCompanies: async (search = '') => {
    const res = await api.get('/employer/companies', {
      params: search ? { search } : {},
    });
    return res.data;
  },

  getCompanyById: async (id) => {
    const res = await api.get(`/employer/companies/${id}`);
    return res.data;
  },
};
