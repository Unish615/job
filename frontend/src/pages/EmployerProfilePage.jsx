import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Upload,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const EmployerProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'Software Development',
    location: '',
    website: '',
    companySize: '11-50',
    foundedYear: 2020,
    phone: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchProfile = async () => {
    try {
      const data = await profileService.getEmployerProfile();
      setProfile(data);
      setFormData({
        companyName: data.companyName || '',
        industry: data.industry || 'Software Development',
        location: data.location || '',
        website: data.website || '',
        companySize: data.companySize || '11-50',
        foundedYear: data.foundedYear || 2020,
        phone: data.phone || '',
        description: data.description || '',
      });
    } catch (err) {
      console.error('Error fetching employer profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const updated = await profileService.updateEmployerProfile({
        ...formData,
        foundedYear: parseInt(formData.foundedYear) || 2020,
      });
      setProfile(updated);
      setMsg({ type: 'success', text: 'Company profile details updated successfully!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update company profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Logo upload handler (JPG, JPEG, PNG, WEBP, max 5MB)
  const handleLogoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setMsg({ type: 'error', text: 'Invalid image format. Allowed formats: JPG, JPEG, PNG, WEBP.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'File size must be less than 5 MB.' });
      return;
    }

    setUploadingLogo(true);
    setMsg({ type: '', text: '' });

    try {
      const updated = await profileService.uploadLogo(file);
      setProfile(updated);
      setMsg({ type: 'success', text: 'Company logo updated successfully!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to upload logo.',
      });
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'WARNING: Are you sure you want to permanently delete your company account and all published jobs? This cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await profileService.deleteEmployerAccount();
      logout();
      navigate('/register');
    } catch (err) {
      alert('Could not delete company account.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading company profile..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Company Profile & Branding</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your organization details, logo, and company culture for job seekers.
        </p>
      </div>

      {msg.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Logo Branding Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl overflow-hidden shrink-0">
          {profile?.logo ? (
            <img
              src={`/api/files/logo/${profile.logo}`}
              alt={profile.companyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-12 h-12 text-blue-600" />
          )}
        </div>

        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-base font-bold text-slate-900">Company Logo</h2>
          <p className="text-xs text-slate-500">
            JPG, JPEG, PNG, or WEBP (Max 5 MB). Displayed across all your active job cards.
          </p>
          <label className="inline-flex items-center gap-1.5 cursor-pointer px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition mt-2">
            <Upload className="w-3.5 h-3.5" />
            {uploadingLogo ? 'Uploading...' : 'Upload New Logo'}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={handleLogoFileChange}
              disabled={uploadingLogo}
            />
          </label>
        </div>
      </div>

      {/* Main Details Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Company Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Software Development, Fintech"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Headquarters Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Size
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Founded Year
              </label>
              <input
                type="number"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
                placeholder="2018"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Description & Culture
              </label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your organization's mission, values, and technology stack..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Company Profile'}
          </button>
        </div>
      </form>

      {/* Account Deletion */}
      <div className="bg-rose-50/60 rounded-3xl border border-rose-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900">Delete Company Account</h3>
          <p className="text-xs text-rose-700 mt-0.5">
            Permanently delete your company profile and all associated job vacancies.
          </p>
        </div>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition shrink-0"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default EmployerProfilePage;
