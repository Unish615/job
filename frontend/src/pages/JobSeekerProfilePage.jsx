import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Code,
  FileText,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Globe,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const JobSeekerProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    education: '',
    skills: '',
    experience: '',
    about: '',
    linkedin: '',
    github: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchProfile = async () => {
    try {
      const data = await profileService.getJobSeekerProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        dateOfBirth: data.dateOfBirth || '',
        education: data.education || '',
        skills: data.skills || '',
        experience: data.experience || '',
        about: data.about || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
      });
    } catch (err) {
      console.error('Error fetching profile', err);
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
      const updated = await profileService.updateJobSeekerProfile(formData);
      setProfile(updated);
      updateUserProfile({ name: updated.name, phone: updated.phone });
      setMsg({ type: 'success', text: 'Profile details saved successfully!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Resume handlers
  const handleResumeFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setMsg({ type: 'error', text: 'Only PDF files are allowed for your CV/Resume.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'File size must be less than 5 MB.' });
      return;
    }

    setUploadingResume(true);
    setMsg({ type: '', text: '' });
    try {
      const updated = await profileService.uploadResume(file);
      setProfile(updated);
      setMsg({ type: 'success', text: 'CV/Resume uploaded successfully!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to upload resume.',
      });
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  };

  const handleRemoveResume = async () => {
    if (!window.confirm('Are you sure you want to remove your CV?')) return;
    try {
      const updated = await profileService.removeResume();
      setProfile(updated);
      setMsg({ type: 'success', text: 'CV removed successfully.' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to remove CV.' });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'WARNING: Are you sure you want to permanently delete your candidate account and all your applications? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await profileService.deleteJobSeekerAccount();
      logout();
      navigate('/register');
    } catch (err) {
      alert('Could not delete account.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading candidate profile..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Keep your professional details and resume fresh to stand out to hiring managers.
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

      {/* CV / Resume Section (Requirement #15) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Curriculum Vitae (CV) / Resume</h2>
            <p className="text-xs text-slate-500">PDF only, maximum file size: 5 MB</p>
          </div>
          {profile?.resume && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active CV
            </span>
          )}
        </div>

        {profile?.resume ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 break-all">
                  {profile.resumeOriginalName || profile.resume}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Uploaded on{' '}
                  {profile.resumeUploadedAt
                    ? new Date(profile.resumeUploadedAt).toLocaleDateString()
                    : 'Recent'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`/api/files/resume/${profile.resume}?download=true`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" /> Download
              </a>

              <label className="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 transition">
                <RefreshCw className="w-3.5 h-3.5" />
                {uploadingResume ? 'Replacing...' : 'Replace CV'}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleResumeFileChange}
                  disabled={uploadingResume}
                />
              </label>

              <button
                type="button"
                onClick={handleRemoveResume}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition"
                title="Remove CV"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Upload your CV to apply for jobs</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Only PDF format is accepted (Max 5MB)</p>
            </div>
            <label className="inline-block cursor-pointer px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition">
              {uploadingResume ? 'Uploading...' : 'Choose PDF File'}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleResumeFileChange}
                disabled={uploadingResume}
              />
            </label>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-8">
        {/* Personal Details */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
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
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Address / City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Seattle, WA, United States"
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Education, Skills & Experience */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Professional Profile & Skills
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                About Me / Summary
              </label>
              <textarea
                rows={3}
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="A brief introduction highlighting your career goals and key competencies..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Skills (Comma Separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Java, Spring Boot, React, Tailwind CSS, MySQL, Git, Docker"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Education
              </label>
              <textarea
                rows={3}
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. B.S. in Computer Science - University of Washington (2018)"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Experience
              </label>
              <textarea
                rows={4}
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 4+ years as Full Stack Software Engineer at TechCorp. Built resilient APIs and frontend dashboards."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Social / Portfolio Links */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Professional Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                GitHub / Portfolio URL
              </label>
              <div className="relative">
                <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Account Deletion Danger Zone (Requirement #2 & #6) */}
      <div className="bg-rose-50/60 rounded-3xl border border-rose-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900">Delete Account</h3>
          <p className="text-xs text-rose-700 mt-0.5">
            Permanently remove your account, profile, CV, and all submitted job applications.
          </p>
        </div>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition shrink-0"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default JobSeekerProfilePage;
