import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData);
      // Redirect based on role
      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (data.role === 'EMPLOYER') {
        navigate('/employer/dashboard');
      } else {
        navigate(location.state?.from?.pathname || '/job-seeker/dashboard');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' || !err.response
          ? 'Unable to connect to backend server. Please check connection.'
          : 'Invalid email or password');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to your JobConnect account</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-1">
          <p className="font-bold text-slate-700">Quick Demo Logins:</p>
          <p><span className="font-semibold text-slate-800">Job Seeker:</span> seeker@jobconnect.com / seeker123</p>
          <p><span className="font-semibold text-slate-800">Employer:</span> techcorp@jobconnect.com / employer123</p>
          <p><span className="font-semibold text-slate-800">Admin:</span> admin@jobconnect.com / admin123</p>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
