import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Briefcase,
  PlusCircle,
  Edit3,
  Trash2,
  Users,
  Eye,
  Calendar,
  ExternalLink
} from 'lucide-react';

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const fetchJobs = async () => {
    try {
      const data = await jobService.getEmployerJobs();
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing? Applications submitted to this job will also be removed.')) {
      return;
    }

    try {
      await jobService.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      setToastMsg('Job deleted successfully');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job.');
    }
  };

  const handleStatusToggle = async (job) => {
    const newStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await jobService.updateJob(job.id, {
        ...job,
        status: newStatus,
      });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
      );
      setToastMsg(`Job listing marked as ${newStatus}`);
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner text="Loading your jobs..." />;

  return (
    <div className="space-y-8">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold border border-slate-700">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Job Listings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track, update, or close vacancies published by your company.
          </p>
        </div>

        <Link
          to="/employer/post-job"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs self-start"
        >
          <PlusCircle className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No jobs posted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Post your first vacancy to start receiving qualified applicants.
          </p>
          <Link
            to="/employer/post-job"
            className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Create Job Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Job Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Type & Location</th>
                  <th className="py-4 px-6">Applicants</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <Link to={`/jobs/${job.id}`} className="hover:text-blue-600">
                        {job.title}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{job.category}</td>
                    <td className="py-4 px-6 text-slate-500">
                      <span className="font-semibold text-slate-700">{job.jobType}</span> • {job.location}
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/employer/applicants?jobId=${job.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition"
                      >
                        <Users className="w-3.5 h-3.5" />
                        {job.applicantCount || 0}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleStatusToggle(job)}
                        className="focus:outline-hidden"
                        title="Click to toggle Active/Closed"
                      >
                        <StatusBadge status={job.status} />
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                          title="View Public Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/employer/edit-job/${job.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                          title="Edit Job"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobsPage;
