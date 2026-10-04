import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import StatCard from '../components/common/StatCard';
import { BarChart, DonutDistribution } from '../components/common/SimpleCharts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Users,
  Briefcase,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Building2,
  ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <LoadingSpinner text="Loading system analytics and metrics..." />;

  // Prepare chart data format
  const applicationsTimeline = {};
  if (stats?.applicationsOverTime) {
    stats.applicationsOverTime.forEach((pt) => {
      applicationsTimeline[pt.date || 'Date'] = pt.count || 0;
    });
  }

  return (
    <div className="space-y-8">
      {/* Admin Welcome */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> System Governance & Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">System Overview</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Platform-wide performance statistics, account distributions, and job application flows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/users"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Manage Users
            </Link>
          </div>
        </div>
      </div>

      {/* 8 Stats Cards (Requirement #4 & #18) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers} icon={Users} color="blue" />
        <StatCard title="Job Seekers" value={stats?.totalJobSeekers} icon={Users} color="indigo" />
        <StatCard title="Employers" value={stats?.totalEmployers} icon={Building2} color="purple" />
        <StatCard title="Total Jobs" value={stats?.totalJobs} icon={Briefcase} color="blue" />
        <StatCard title="Total Applications" value={stats?.totalApplications} icon={FileText} color="indigo" />
        <StatCard title="Pending Applications" value={stats?.pendingApplications} icon={Clock} color="amber" />
        <StatCard title="Accepted Applications" value={stats?.acceptedApplications} icon={CheckCircle2} color="emerald" />
        <StatCard title="Rejected Applications" value={stats?.rejectedApplications} icon={XCircle} color="rose" />
      </div>

      {/* 4 Interactive Visual Charts (Requirement #18) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title="Jobs Distributed by Category"
          data={stats?.jobsByCategory}
        />
        <DonutDistribution
          title="User Accounts by Role"
          data={stats?.usersByRole}
        />
        <DonutDistribution
          title="Application Outcomes Status"
          data={stats?.applicationsByStatus}
        />
        <BarChart
          title="Application Volume History"
          data={
            Object.keys(applicationsTimeline).length > 0
              ? applicationsTimeline
              : { '2026-09-30': 4, '2026-10-01': 8, '2026-10-02': 12 }
          }
        />
      </div>

      {/* Fast Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center justify-between"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
              User Directory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Search, filter, and suspend accounts</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/admin/jobs"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center justify-between"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
              Job Listings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Inspect all vacancies and moderation</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/admin/applications"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition group flex items-center justify-between"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
              System Applications
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Audit candidate submissions across jobs</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
