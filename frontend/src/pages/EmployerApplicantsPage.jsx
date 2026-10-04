import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import {
  Users,
  FileText,
  Mail,
  Phone,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  AlertCircle
} from 'lucide-react';

const EmployerApplicantsPage = () => {
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get('jobId');

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const fetchApplicants = async () => {
    try {
      const data = await applicationService.getEmployerApplications(jobIdParam || null);
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applicants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobIdParam]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const updated = await applicationService.updateStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: updated.status } : a))
      );
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp((prev) => ({ ...prev, status: updated.status }));
      }
      setToastMsg(`Applicant status updated to "${newStatus}"`);
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert('Failed to update applicant status');
    }
  };

  if (loading) return <LoadingSpinner text="Loading applicants for your jobs..." />;

  return (
    <div className="space-y-8">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold border border-slate-700">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Applicants</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review candidate qualifications, cover letters, and PDF resumes submitted to your openings.
          </p>
        </div>

        {jobIdParam && (
          <Link
            to="/employer/applicants"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 self-start"
          >
            ← View All Applicants
          </Link>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No applicants yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Applications submitted to your company's active positions will show up here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Applicant Name</th>
                  <th className="py-4 px-6">Contact Email</th>
                  <th className="py-4 px-6">Job Applied For</th>
                  <th className="py-4 px-6">Date Applied</th>
                  <th className="py-4 px-6">CV / Resume</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {app.applicantName}
                    </td>
                    <td className="py-4 px-6 text-slate-500">{app.applicantEmail}</td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      <Link to={`/jobs/${app.jobId}`} className="hover:text-blue-600">
                        {app.jobTitle}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {app.resume ? (
                        <a
                          href={`/api/files/resume/${app.resume}?download=true`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition"
                        >
                          <FileText className="w-3.5 h-3.5" /> PDF CV
                        </a>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="text-xs font-bold rounded-lg border border-slate-200 bg-white px-2 py-1 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:text-blue-600 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applicant Detail View Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Candidate Profile - ${selectedApp.applicantName}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Header / Contacts */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedApp.applicantName}</h3>
                <p className="text-slate-500 mt-0.5">{selectedApp.applicantEmail} • {selectedApp.applicantPhone || 'No phone'}</p>
                <p className="text-[11px] text-blue-600 font-semibold mt-1">Applied for: {selectedApp.jobTitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Status:</span>
                <StatusBadge status={selectedApp.status} />
              </div>
            </div>

            {/* Applicant Skills & Education */}
            {selectedApp.applicantSkills && (
              <div>
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">Skills</p>
                <p className="p-3 rounded-xl border border-slate-100 bg-white text-slate-700 font-medium leading-relaxed">
                  {selectedApp.applicantSkills}
                </p>
              </div>
            )}

            {selectedApp.applicantEducation && (
              <div>
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">Education</p>
                <p className="p-3 rounded-xl border border-slate-100 bg-white text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedApp.applicantEducation}
                </p>
              </div>
            )}

            {selectedApp.applicantExperience && (
              <div>
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">Work Experience</p>
                <p className="p-3 rounded-xl border border-slate-100 bg-white text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedApp.applicantExperience}
                </p>
              </div>
            )}

            {/* Cover Letter */}
            <div>
              <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">Cover Letter</p>
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedApp.coverLetter || 'No cover letter submitted.'}
              </div>
            </div>

            {/* Resume Action */}
            {selectedApp.resume && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-600" /> Candidate Resume (PDF)
                </span>
                <a
                  href={`/api/files/resume/${selectedApp.resume}?download=true`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download CV
                </a>
              </div>
            )}

            {/* Status Change Fast Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="font-bold text-slate-700 text-[11px]">Update Decision:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(selectedApp.id, 'Reviewed')}
                  className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-bold hover:bg-blue-100"
                >
                  Mark Reviewed
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApp.id, 'Accepted')}
                  className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100"
                >
                  Accept Candidate
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApp.id, 'Rejected')}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmployerApplicantsPage;
