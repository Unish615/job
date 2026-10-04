import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { FileText, Eye, Download, Users } from 'lucide-react';

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await adminService.getAllApplications();
        setApplications(data || []);
      } catch (err) {
        console.error('Error fetching admin applications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <LoadingSpinner text="Loading system applications..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Application Oversight</h1>
        <p className="text-xs text-slate-500 mt-1">
          Audit and monitor candidate job submissions across all companies.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No applications recorded in the system yet.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Applicant</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Job Position</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">{app.applicantName}</td>
                    <td className="py-4 px-6 text-slate-500">{app.applicantEmail}</td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      <Link to={`/jobs/${app.jobId}`} className="hover:text-blue-600">
                        {app.jobTitle}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{app.companyName}</td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Record #${selectedApp.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <p><strong className="text-slate-800">Applicant:</strong> {selectedApp.applicantName} ({selectedApp.applicantEmail})</p>
              <p><strong className="text-slate-800">Target Role:</strong> {selectedApp.jobTitle}</p>
              <p><strong className="text-slate-800">Employer Company:</strong> {selectedApp.companyName}</p>
              <p><strong className="text-slate-800">Submitted:</strong> {new Date(selectedApp.appliedAt).toLocaleString()}</p>
              <div className="pt-1 flex items-center gap-2">
                <strong className="text-slate-800">Current Status:</strong>
                <StatusBadge status={selectedApp.status} />
              </div>
            </div>

            {selectedApp.coverLetter && (
              <div>
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Cover Letter</p>
                <div className="p-3.5 rounded-xl border border-slate-100 bg-white text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            {selectedApp.resume && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-600" /> Attached Resume
                </span>
                <a
                  href={`/api/files/resume/${selectedApp.resume}?download=true`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            )}

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

export default AdminApplicationsPage;
