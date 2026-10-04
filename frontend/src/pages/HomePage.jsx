import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Users,
  Building2,
  FileCheck,
  Code2,
  Smartphone,
  Palette,
  Database,
  ShieldAlert,
  Network,
  Megaphone,
  CircleDollarSign,
  UserCheck
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { adminService } from '../services/adminService';
import JobCard from '../components/job/JobCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [stats, setStats] = useState({
    totalJobs: 1200,
    totalEmployers: 450,
    totalJobSeekers: 5200,
    totalApplications: 10400,
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [jobsRes, catsRes] = await Promise.all([
          jobService.getFeaturedJobs(),
          jobService.getCategoryCounts(),
        ]);
        setFeaturedJobs(jobsRes || []);
        setCategoryCounts(catsRes || {});

        // Try getting live stats if available
        try {
          const statsRes = await adminService.getDashboardStats();
          if (statsRes) {
            setStats({
              totalJobs: Math.max(statsRes.totalJobs || 0, 1000),
              totalEmployers: Math.max(statsRes.totalEmployers || 0, 500),
              totalJobSeekers: Math.max(statsRes.totalJobSeekers || 0, 5000),
              totalApplications: Math.max(statsRes.totalApplications || 0, 10000),
            });
          }
        } catch (ignored) {}
      } catch (err) {
        console.error('Error fetching home data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle.trim()) params.set('keyword', searchTitle.trim());
    if (searchLocation.trim()) params.set('location', searchLocation.trim());
    if (searchCategory) params.set('category', searchCategory);
    navigate(`/jobs?${params.toString()}`);
  };

  const categoriesList = [
    { name: 'Software Development', icon: Code2, count: categoryCounts['Software Development'] || 12 },
    { name: 'Web Development', icon: Layers, count: categoryCounts['Web Development'] || 8 },
    { name: 'Mobile Development', icon: Smartphone, count: categoryCounts['Mobile Development'] || 5 },
    { name: 'UI/UX Design', icon: Palette, count: categoryCounts['UI/UX Design'] || 7 },
    { name: 'Data Science', icon: Database, count: categoryCounts['Data Science'] || 9 },
    { name: 'Cyber Security', icon: ShieldAlert, count: categoryCounts['Cyber Security'] || 4 },
    { name: 'Networking', icon: Network, count: categoryCounts['Networking'] || 3 },
    { name: 'Marketing', icon: Megaphone, count: categoryCounts['Marketing'] || 6 },
    { name: 'Finance', icon: CircleDollarSign, count: categoryCounts['Finance'] || 4 },
    { name: 'Human Resources', icon: UserCheck, count: categoryCounts['Human Resources'] || 3 },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold mb-6">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            #1 Modern Tech Job Portal for High-Growth Careers
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Find Your Next <span className="text-blue-600">Opportunity</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover jobs, connect with employers, and build your career. Seamless application workflows, real-time status tracking, and verified company profiles.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/jobs"
              className="px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
            >
              Find Jobs
            </Link>
            <Link
              to="/employer/post-job"
              className="px-6 py-3 rounded-xl text-sm font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition shadow-xs"
            >
              Post a Job
            </Link>
          </div>

          {/* Search Jobs Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 grid grid-cols-1 md:grid-cols-12 gap-3"
            >
              <div className="md:col-span-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Job title, keyword, skills..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-100 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="md:col-span-3 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Location or Remote"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-100 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-100 bg-slate-50 text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="">All Categories</option>
                  {categoriesList.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full min-h-[42px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-slate-900/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-blue-400">
                {stats.totalJobs.toLocaleString()}+
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">Active Jobs</p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-blue-400">
                {stats.totalEmployers.toLocaleString()}+
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">Companies</p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-blue-400">
                {stats.totalJobSeekers.toLocaleString()}+
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">Job Seekers</p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-blue-400">
                {stats.totalApplications.toLocaleString()}+
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">Applications Processed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Explore by Field</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Popular Job Categories
            </h2>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition group text-left flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{cat.count} jobs open</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Jobs Section (6 jobs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Fresh Openings</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Latest Featured Jobs
            </h2>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            Explore All Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading latest openings..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Simple Process</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            How JobConnect Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered for seamless matchmaking between ambitious candidates and modern organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Job Seekers */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">For Job Seekers</h3>
                <p className="text-xs text-slate-500">Fast track your professional journey</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { step: '01', title: 'Create Profile', desc: 'Add your skills, education, experience and upload your PDF CV.' },
                { step: '02', title: 'Find Jobs', desc: 'Search and filter hundreds of positions tailored to your seniority.' },
                { step: '03', title: 'Apply', desc: 'Submit one-click applications with custom cover letters.' },
                { step: '04', title: 'Get Hired', desc: 'Track live status updates from Pending to Reviewed and Accepted.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/register"
              className="inline-block w-full text-center py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Sign Up as Candidate
            </Link>
          </div>

          {/* For Employers */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">For Employers</h3>
                <p className="text-xs text-slate-500">Source and hire high-impact talent</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { step: '01', title: 'Create Company Profile', desc: 'Establish your brand with logo, company details and culture.' },
                { step: '02', title: 'Post Job', desc: 'Publish detailed job descriptions with salary and skill tags.' },
                { step: '03', title: 'Find Candidates', desc: 'Receive structured applicant profiles and inspect PDF resumes.' },
                { step: '04', title: 'Hire', desc: 'Change application status to Accepted, Rejected or Reviewed directly.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/register"
              className="inline-block w-full text-center py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              Post a Job as Employer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
