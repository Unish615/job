import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Briefcase, Bookmark, BookmarkCheck, Clock } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const JobCard = ({ job, onSaveToggle, isSaved, isApplied }) => {
  if (!job) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const skillsList = job.skills
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 4)
    : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header with Logo and Bookmark */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg overflow-hidden shrink-0">
              {job.companyLogo ? (
                <img
                  src={`/api/files/logo/${job.companyLogo}`}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {job.category || 'General'}
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="text-sm font-medium text-slate-500 line-clamp-1">{job.companyName}</p>
            </div>
          </div>

          {onSaveToggle && (
            <button
              onClick={() => onSaveToggle(job.id)}
              className={`p-2 rounded-xl transition ${
                isSaved || job.saved
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={isSaved || job.saved ? 'Remove bookmark' : 'Save job'}
            >
              {isSaved || job.saved ? (
                <BookmarkCheck className="w-5 h-5 fill-current" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Metadata chips */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
              {job.jobType}
            </span>
          </span>
          {job.salary && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
              <DollarSign className="w-3.5 h-3.5" />
              {job.salary}
            </span>
          )}
        </div>

        {/* Short description */}
        <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        {skillsList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {skillsList.map((skill, i) => (
              <span
                key={i}
                className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700"
              >
                {skill}
              </span>
            ))}
            {job.skills && job.skills.split(',').length > 4 && (
              <span className="inline-block px-2 py-1 rounded-lg text-xs text-slate-400">
                +{job.skills.split(',').length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-5 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Posted {formatDate(job.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          {isApplied || job.alreadyApplied ? (
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Already Applied
            </span>
          ) : (
            <Link
              to={`/jobs/${job.id}`}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-blue-600 transition shadow-xs"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
