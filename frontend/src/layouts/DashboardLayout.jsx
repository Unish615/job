import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  LayoutDashboard,
  Search,
  Bookmark,
  FileText,
  User,
  PlusCircle,
  Building2,
  Users,
  Shield,
  Layers,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout, isJobSeeker, isEmployer, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
      isActive
        ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="font-black text-slate-900 text-base">
            Job<span className="text-blue-600">Connect</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Job<span className="text-blue-600">Connect</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User mini profile */}
          <div className="my-5 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider">
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {isJobSeeker && (
              <>
                <NavLink to="/job-seeker/dashboard" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <LayoutDashboard className="w-4 h-4" /> Overview
                </NavLink>
                <NavLink to="/jobs" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <Search className="w-4 h-4" /> Find Jobs
                </NavLink>
                <NavLink to="/job-seeker/saved-jobs" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <Bookmark className="w-4 h-4" /> Saved Jobs
                </NavLink>
                <NavLink to="/job-seeker/applications" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <FileText className="w-4 h-4" /> My Applications
                </NavLink>
                <NavLink to="/job-seeker/profile" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <User className="w-4 h-4" /> Profile & CV
                </NavLink>
              </>
            )}

            {isEmployer && (
              <>
                <NavLink to="/employer/dashboard" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </NavLink>
                <NavLink to="/employer/jobs" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <Briefcase className="w-4 h-4" /> Manage Jobs
                </NavLink>
                <NavLink to="/employer/post-job" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <PlusCircle className="w-4 h-4" /> Post a Job
                </NavLink>
                <NavLink to="/employer/applicants" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <Users className="w-4 h-4" /> Applicants
                </NavLink>
                <NavLink to="/employer/profile" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <Building2 className="w-4 h-4" /> Company Profile
                </NavLink>
              </>
            )}

            {isAdmin && (
              <>
                <NavLink to="/admin/dashboard" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <LayoutDashboard className="w-4 h-4" /> Admin Stats
                </NavLink>
                <NavLink to="/admin/users" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <Users className="w-4 h-4" /> User Management
                </NavLink>
                <NavLink to="/admin/jobs" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <Briefcase className="w-4 h-4" /> Job Governance
                </NavLink>
                <NavLink to="/admin/applications" onClick={() => setSidebarOpen(false)} className={navItemClass}>
                  <FileText className="w-4 h-4" /> All Applications
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> Back to Main Site
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
