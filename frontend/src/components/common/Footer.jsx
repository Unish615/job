import { Link } from 'react-router-dom';
import { Briefcase, Heart, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Job<span className="text-blue-500">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Discover dream careers, connect directly with visionary employers, and build your future.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">For Candidates</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition">Browse All Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-white transition">Explore Companies</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Candidate Sign Up</Link></li>
              <li><Link to="/job-seeker/dashboard" className="hover:text-white transition">Candidate Dashboard</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">For Employers</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/employer/post-job" className="hover:text-white transition">Post a Job</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-white transition">Employer Dashboard</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Register Company</Link></li>
              <li><Link to="/companies" className="hover:text-white transition">Talent Search</Link></li>
            </ul>
          </div>

          {/* Quick Links & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About JobConnect</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Support</Link></li>
              <li><span className="text-slate-500 text-xs">Role-based Access Control (RBAC)</span></li>
              <li><span className="text-slate-500 text-xs">Spring Boot 3 + MySQL + React</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobConnect Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
