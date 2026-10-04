import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { profileService } from '../services/profileService';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Building2,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profData, jobsData, appsData] = await Promise.all([
          profileService.getEmployerProfile(),
          jobService.getEmployerJobs(),
          applicationService.getEmployerApplications(),
        ]);
        setProfile(profData);
        setJobs(jobsData || []);
        setApplications(appsData || []);
      } catch (err) {
        console.error('Error loading employer dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading employer dashboard..." />;

  const activeJobsCount = jobs.filter((j) => j.status === 'ACTIVE').length;
  const pendingAppsCount = applications.filter((a) => a.status === 'Pending').length;
  const acceptedAppsCount = applications.filter((a) => a.status === 'Accepted').length;
  const rejectedAppsCount = applications.filter((a) => a.status === 'Rejected').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Employer Hiring Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {profile?.companyName || user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Manage your active vacancies, evaluate applicant resumes, and track recruitment pipelines in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/employer/post-job"
              className="px-5 py-3 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
            >
              <PlusCircle className="w-4 h-4" /> Post New Job
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row (Requirement #17) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Total Jobs" value={jobs.length} icon={Briefcase} color="blue" />
        <StatCard title="Active Jobs" value={activeJobsCount} icon={Briefcase} color="indigo" />
        <StatCard title="Applicants" value={applications.length} icon={Users} color="purple" />
        <StatCard title="Pending" value={pendingAppsCount} icon={Clock} color="amber" />
        <StatCard title="Accepted" value={acceptedAppsCount} icon={CheckCircle2} color="emerald" />
        <StatCard title="Rejected" value={rejectedAppsCount} icon={XCircle} color="rose" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/employer/post-job"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Post New Job</p>
            <p className="text-[10px] text-slate-400">Create new vacancy</p>
          </div>
        </Link>

        <Link
          to="/employer/jobs"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Manage Jobs</p>
            <p className="text-[10px] text-slate-400">Edit and track listings</p>
          </div>
        </Link>

        <Link
          to="/employer/applicants"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">View Applicants</p>
            <p className="text-[10px] text-slate-400">Review submissions & CVs</p>
          </div>
        </Link>

        <Link
          to="/employer/profile"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Company Profile</p>
            <p className="text-[10px] text-slate-400">Logo and branding</p>
          </div>
        </Link>
      </div>

      {/* Two columns: Recent Jobs & Recent Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Postings</h2>
            <Link
              to="/employer/jobs"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              All Jobs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No jobs posted yet.{' '}
              <Link to="/employer/post-job" className="text-blue-600 font-bold underline">
                Post your first job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {jobs.slice(0, 4).map((j) => (
                <div key={j.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <Link to={`/jobs/${j.id}`} className="font-bold text-slate-900 hover:text-blue-600">
                      {j.title}
                    </Link>
                    <p className="text-slate-500 mt-0.5">{j.category} • {j.jobType}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={j.status} />
                    <p className="text-[10px] text-slate-400 mt-1">{j.applicantCount} applicants</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applicants */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Applicants</h2>
            <Link
              to="/employer/applicants"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              All Applicants <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No applications received yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{app.applicantName}</p>
                    <p className="text-slate-500 mt-0.5">Applied for {app.jobTitle}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={app.status} />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
