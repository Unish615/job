import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import {
  FileText,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Trash2,
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCancelApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw and cancel this application?')) return;

    try {
      await applicationService.cancelApplication(appId);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      setToastMsg('Application cancelled successfully.');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel application.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading applications..." />;

  return (
    <div className="space-y-8">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold border border-slate-700">
          {toastMsg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review status milestones and history for all jobs you have applied to.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore live positions and apply directly to track employer responses right here.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Find Open Jobs
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Position</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Type & Location</th>
                  <th className="py-4 px-6">Date Applied</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <Link to={`/jobs/${app.jobId}`} className="hover:text-blue-600">
                        {app.jobTitle}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{app.companyName}</td>
                    <td className="py-4 px-6 text-slate-500">
                      <span className="font-semibold text-slate-700">{app.jobType}</span> • {app.location}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                          title="View Application Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/jobs/${app.jobId}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                          title="View Job"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {app.status !== 'Accepted' && (
                          <button
                            onClick={() => handleCancelApplication(app.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Cancel Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Detail View Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Details - ${selectedApp.jobTitle}`}
        >
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedApp.companyName}</p>
                <p className="text-slate-500 mt-0.5">{selectedApp.location} • {selectedApp.jobType}</p>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div>
              <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Submitted Cover Letter
              </p>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 whitespace-pre-line leading-relaxed">
                {selectedApp.coverLetter || 'No cover letter was included.'}
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Submitted CV/Resume
              </p>
              {selectedApp.resume && (
                <a
                  href={`/api/files/resume/${selectedApp.resume}?download=true`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-blue-600 font-bold hover:bg-blue-50 transition"
                >
                  <FileText className="w-4 h-4" /> Download / View Attached PDF
                </a>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyApplicationsPage;
