import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationService } from '../services/applicationService';
import { profileService } from '../services/profileService';
import { savedJobService } from '../services/savedJobService';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Bookmark,
  Search,
  User,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profData, appsData, savedData] = await Promise.all([
          profileService.getJobSeekerProfile(),
          applicationService.getMyApplications(),
          savedJobService.getSavedJobs(),
        ]);
        setProfile(profData);
        setApplications(appsData || []);
        setSavedJobsCount(savedData?.length || 0);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading candidate dashboard..." />;

  const pendingCount = applications.filter((a) => a.status === 'Pending').length;
  const acceptedCount = applications.filter((a) => a.status === 'Accepted').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;
  const completionPercent = profile?.completionPercentage || 40;

  return (
    <div className="space-y-8">
      {/* Welcome & Profile Completion Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Candidate Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Track your application milestones, update your credentials, and discover matching vacancies.
            </p>
          </div>

          {/* Profile Completion Meter */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 min-w-[260px]">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span>Profile Strength</span>
              <span>{completionPercent}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            {completionPercent < 100 && (
              <Link
                to="/job-seeker/profile"
                className="mt-3 block text-[11px] font-bold text-white underline hover:text-blue-200"
              >
                Complete profile to increase recruiter reach →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Applied"
          value={applications.length}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Accepted"
          value={acceptedCount}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Saved Jobs"
          value={savedJobsCount}
          icon={Bookmark}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/jobs"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Search Jobs</p>
            <p className="text-[10px] text-slate-400">Find new vacancies</p>
          </div>
        </Link>

        <Link
          to="/job-seeker/applications"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">My Applications</p>
            <p className="text-[10px] text-slate-400">Track application status</p>
          </div>
        </Link>

        <Link
          to="/job-seeker/profile"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">My Profile</p>
            <p className="text-[10px] text-slate-400">Update CV & skills</p>
          </div>
        </Link>

        <Link
          to="/job-seeker/saved-jobs"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Saved Jobs</p>
            <p className="text-[10px] text-slate-400">View bookmarked posts</p>
          </div>
        </Link>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
            <p className="text-xs text-slate-500">Live submission updates</p>
          </div>
          <Link
            to="/job-seeker/applications"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            You haven't submitted any applications yet.{' '}
            <Link to="/jobs" className="text-blue-600 font-bold underline">
              Browse jobs
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-6">Position</th>
                  <th className="py-3 px-6">Company</th>
                  <th className="py-3 px-6">Date Applied</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      <Link to={`/jobs/${app.jobId}`} className="hover:text-blue-600">
                        {app.jobTitle}
                      </Link>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-600">{app.companyName}</td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        View Job <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
