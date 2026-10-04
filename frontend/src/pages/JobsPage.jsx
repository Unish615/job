import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { savedJobService } from '../services/savedJobService';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/job/JobCard';
import JobFilterSidebar from '../components/job/JobFilterSidebar';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search, Briefcase, AlertCircle } from 'lucide-react';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isJobSeeker } = useAuth();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    jobType: searchParams.get('jobType') || '',
    location: searchParams.get('location') || '',
    experience: searchParams.get('experience') || '',
    sortBy: searchParams.get('sortBy') || 'latest',
  });

  const [page, setPage] = useState(0);
  const [pageSize] = useState(9);
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [toastMsg, setToastMsg] = useState('');

  // Load jobs whenever filters, keyword, or page change
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.searchJobs({
        keyword: keyword.trim() || undefined,
        category: filters.category || undefined,
        jobType: filters.jobType || undefined,
        location: filters.location || undefined,
        experience: filters.experience || undefined,
        sortBy: filters.sortBy || 'latest',
        page,
        size: pageSize,
      });

      setJobs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);

      // Check saved jobs if job seeker
      if (isJobSeeker) {
        try {
          const saved = await savedJobService.getSavedJobs();
          setSavedJobIds(new Set(saved.map((j) => j.id)));
        } catch (ignored) {}
      }
    } catch (err) {
      console.error('Error fetching jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setFilters({
      category: '',
      jobType: '',
      location: '',
      experience: '',
      sortBy: 'latest',
    });
    setPage(0);
  };

  const handleSaveToggle = async (jobId) => {
    if (!isJobSeeker) {
      setToastMsg('Please log in as a Job Seeker to bookmark jobs');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }

    try {
      if (savedJobIds.has(jobId)) {
        await savedJobService.removeSavedJob(jobId);
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        setToastMsg('Job removed from bookmarks');
      } else {
        await savedJobService.saveJob(jobId);
        setSavedJobIds((prev) => new Set([...prev, jobId]));
        setToastMsg('Job bookmarked successfully');
      }
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      console.error('Error saving job', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          {toastMsg}
        </div>
      )}

      {/* Header & Quick Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Opportunities</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through {totalElements} verified job openings matching top industry benchmarks.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by title, skills, or company name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Grid: Filters + Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <JobFilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Job Listings Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
            <span>
              Showing <strong className="text-slate-800">{jobs.length}</strong> of{' '}
              <strong className="text-slate-800">{totalElements}</strong> positions
            </span>
            <span className="font-medium">Page {page + 1} of {Math.max(totalPages, 1)}</span>
          </div>

          {loading ? (
            <LoadingSpinner text="Searching jobs..." />
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No jobs match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your filters, clearing search keywords, or selecting a broader category.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSaveToggle={handleSaveToggle}
                  isSaved={savedJobIds.has(job.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
