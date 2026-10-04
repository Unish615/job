import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { savedJobService } from '../services/savedJobService';
import JobCard from '../components/job/JobCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Bookmark, Search } from 'lucide-react';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const data = await savedJobService.getSavedJobs();
      setSavedJobs(data || []);
    } catch (err) {
      console.error('Error fetching saved jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      await savedJobService.removeSavedJob(jobId);
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      console.error('Error removing saved job', err);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your bookmarked jobs..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Jobs</h1>
        <p className="text-xs text-slate-500 mt-1">
          Positions you've bookmarked to review or apply for later.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No bookmarked jobs</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When browsing jobs, click the bookmark icon to save opportunities here.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              onSaveToggle={() => handleRemove(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
