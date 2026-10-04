import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Send, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { applicationService } from '../../services/applicationService';

const ApplyModal = ({ isOpen, onClose, job, userProfile, onSuccess }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userProfile?.resume) {
      setError('You must have a CV/Resume uploaded in your profile to apply. Please update your profile first.');
      return;
    }

    try {
      setSubmitting(true);
      await applicationService.applyForJob({
        jobId: job.id,
        coverLetter: coverLetter.trim(),
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${job.title}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company</p>
          <p className="text-sm font-bold text-slate-900">{job.companyName}</p>
          <p className="text-xs text-slate-600 mt-1">{job.location} • {job.jobType}</p>
        </div>

        {/* Attached CV verification */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Attached CV/Resume
          </label>
          {userProfile?.resume ? (
            <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="truncate max-w-xs">{userProfile.resumeOriginalName || userProfile.resume}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                <CheckCircle className="w-4 h-4" /> Ready
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs flex items-center justify-between">
              <span>No CV uploaded to your profile yet!</span>
              <a
                href="/job-seeker/profile"
                className="font-bold underline text-amber-900 hover:text-amber-950"
              >
                Upload Now
              </a>
            </div>
          )}
        </div>

        {/* Cover letter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Cover Letter / Note to Employer (Optional)
          </label>
          <textarea
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Share why you're a great fit for this position, relevant experience, and what excites you about the company..."
            className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 p-3 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !userProfile?.resume}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 shadow-xs"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyModal;
