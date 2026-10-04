import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { profileService } from '../services/profileService';
import { savedJobService } from '../services/savedJobService';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/job/ApplyModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  Calendar,
  Clock,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Share2,
  Users
} from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user, isJobSeeker } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchJob = async () => {
    try {
      const data = await jobService.getJobById(id);
      setJob(data);
      setIsSaved(data.saved);
    } catch (err) {
      console.error('Error fetching job details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();

    if (isJobSeeker) {
      profileService.getJobSeekerProfile()
        .then((p) => setUserProfile(p))
        .catch(() => {});
    }
  }, [id, isJobSeeker]);

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (!isJobSeeker) {
      setToastMsg('Only Job Seeker accounts can apply for job postings.');
      setTimeout(() => setToastMsg(''), 4000);
      return;
    }

    if (!userProfile?.resume) {
      setToastMsg('Please upload your CV/Resume in your profile before applying.');
      setTimeout(() => setToastMsg(''), 4000);
      setIsApplyModalOpen(true); // Modal will guide user
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleSaveToggle = async () => {
    if (!isJobSeeker) {
      setToastMsg('Please log in as a Job Seeker to bookmark jobs');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }

    try {
      if (isSaved) {
        await savedJobService.removeSavedJob(job.id);
        setIsSaved(false);
        setToastMsg('Job removed from saved list');
      } else {
        await savedJobService.saveJob(job.id);
        setIsSaved(true);
        setToastMsg('Job saved to your bookmarks');
      }
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      console.error('Error saving job', err);
    }
  };

  if (loading) return <LoadingSpinner text="Loading job information..." />;
  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">This listing might have been removed or expired.</p>
        <Link to="/jobs" className="mt-4 inline-block text-xs font-bold text-blue-600">
          Back to Jobs List
        </Link>
      </div>
    );
  }

  const skillsList = job.skills
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold border border-slate-700">
          {toastMsg}
        </div>
      )}

      {/* Back link */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl overflow-hidden shrink-0">
              {job.companyLogo ? (
                <img
                  src={`/api/files/logo/${job.companyLogo}`}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-blue-600" />
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {job.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                {job.title}
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-1">{job.companyName}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToggle}
              className={`p-3 rounded-xl border transition ${
                isSaved
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Saved' : 'Save Job'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 fill-current" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            {job.alreadyApplied ? (
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Already Applied
              </span>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-8 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Location</p>
              <p className="font-bold text-slate-800">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Job Type</p>
              <p className="font-bold text-slate-800">{job.jobType}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Salary</p>
              <p className="font-bold text-emerald-700">{job.salary || 'Competitive'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Deadline</p>
              <p className="font-bold text-slate-800">{job.deadline || 'Open until filled'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Job Description
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Key Responsibilities
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.responsibilities}
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Requirements & Qualifications
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Benefits & Perks
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.benefits}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Column: Requirements Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Job Information</h3>

            <div className="space-y-4 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase">Experience Required</p>
                <p className="text-slate-800 font-bold mt-0.5">{job.experience || 'Not specified'}</p>
              </div>

              <div>
                <p className="text-slate-400 font-semibold uppercase">Education Required</p>
                <p className="text-slate-800 font-bold mt-0.5">{job.education || 'Degree or equivalent'}</p>
              </div>

              <div>
                <p className="text-slate-400 font-semibold uppercase">Vacancies</p>
                <p className="text-slate-800 font-bold mt-0.5">{job.vacancies || 1} position(s)</p>
              </div>

              <div>
                <p className="text-slate-400 font-semibold uppercase">Applicants</p>
                <p className="text-slate-800 font-bold mt-0.5">{job.applicantCount || 0} applied</p>
              </div>
            </div>

            {/* Required Skills */}
            {skillsList.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-slate-400 font-semibold uppercase text-xs mb-3">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Apply CTA Banner */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white space-y-4 shadow-lg shadow-blue-500/10">
            <h4 className="text-base font-bold">Ready to apply?</h4>
            <p className="text-xs text-blue-100 leading-relaxed">
              Ensure your CV is up to date in your candidate profile before submitting your application.
            </p>
            {job.alreadyApplied ? (
              <span className="block text-center py-2.5 rounded-xl text-xs font-bold bg-white/20 text-white">
                Application Received
              </span>
            ) : (
              <button
                onClick={handleApplyClick}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-white text-blue-700 hover:bg-blue-50 transition"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        userProfile={userProfile}
        onSuccess={() => {
          fetchJob();
          setToastMsg('Application submitted successfully!');
          setTimeout(() => setToastMsg(''), 4000);
        }}
      />
    </div>
  );
};

export default JobDetailPage;
