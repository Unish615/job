import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Bookmark,
  FileText,
  PlusCircle,
  Building2,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isJobSeeker, isEmployer, isAdmin, getDashboardPath } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition px-3 py-2 rounded-xl ${
      isActive
        ? 'text-blue-600 bg-blue-50/70'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Job<span className="text-blue-600">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {!user && (
              <>
                <NavLink to="/" className={navLinkClass}>Home</NavLink>
                <NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink>
                <NavLink to="/companies" className={navLinkClass}>Companies</NavLink>
                <NavLink to="/about" className={navLinkClass}>About</NavLink>
                <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              </>
            )}

            {isJobSeeker && (
              <>
                <NavLink to="/job-seeker/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/jobs" className={navLinkClass}>Find Jobs</NavLink>
                <NavLink to="/job-seeker/saved-jobs" className={navLinkClass}>Saved Jobs</NavLink>
                <NavLink to="/job-seeker/applications" className={navLinkClass}>Applications</NavLink>
                <NavLink to="/job-seeker/profile" className={navLinkClass}>Profile</NavLink>
              </>
            )}

            {isEmployer && (
              <>
                <NavLink to="/employer/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/employer/jobs" className={navLinkClass}>My Jobs</NavLink>
                <NavLink to="/employer/post-job" className={navLinkClass}>Post Job</NavLink>
                <NavLink to="/employer/applicants" className={navLinkClass}>Applicants</NavLink>
                <NavLink to="/employer/profile" className={navLinkClass}>Company Profile</NavLink>
              </>
            )}

            {isAdmin && (
              <>
                <NavLink to="/admin/dashboard" className={navLinkClass}>Admin Dashboard</NavLink>
                <NavLink to="/admin/users" className={navLinkClass}>Users</NavLink>
                <NavLink to="/admin/jobs" className={navLinkClass}>All Jobs</NavLink>
                <NavLink to="/admin/applications" className={navLinkClass}>Applications</NavLink>
              </>
            )}
          </nav>

          {/* User CTA / Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-800 leading-tight max-w-[120px] truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium capitalize">{user.role?.replace('_', ' ').toLowerCase()}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                    </Link>

                    {isJobSeeker && (
                      <Link
                        to="/job-seeker/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" /> My Profile & CV
                      </Link>
                    )}

                    {isEmployer && (
                      <Link
                        to="/employer/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" /> Company Profile
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs shadow-blue-500/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2">
          {!user && (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Home</Link>
              <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Jobs</Link>
              <Link to="/companies" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Companies</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">About</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Contact</Link>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800">Log In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold">Register</Link>
              </div>
            </>
          )}

          {isJobSeeker && (
            <>
              <Link to="/job-seeker/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Dashboard</Link>
              <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Find Jobs</Link>
              <Link to="/job-seeker/saved-jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Saved Jobs</Link>
              <Link to="/job-seeker/applications" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Applications</Link>
              <Link to="/job-seeker/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Profile</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm font-bold text-rose-600 pt-3 border-t border-slate-100">Log Out</button>
            </>
          )}

          {isEmployer && (
            <>
              <Link to="/employer/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Dashboard</Link>
              <Link to="/employer/jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">My Jobs</Link>
              <Link to="/employer/post-job" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Post Job</Link>
              <Link to="/employer/applicants" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Applicants</Link>
              <Link to="/employer/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Company Profile</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm font-bold text-rose-600 pt-3 border-t border-slate-100">Log Out</button>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Admin Dashboard</Link>
              <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Users</Link>
              <Link to="/admin/jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">All Jobs</Link>
              <Link to="/admin/applications" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">Applications</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-sm font-bold text-rose-600 pt-3 border-t border-slate-100">Log Out</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
