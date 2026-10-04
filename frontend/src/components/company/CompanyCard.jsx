import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase, ExternalLink } from 'lucide-react';

const CompanyCard = ({ company }) => {
  if (!company) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl overflow-hidden shrink-0">
            {company.logo ? (
              <img
                src={`/api/files/logo/${company.logo}`}
                alt={company.companyName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="w-7 h-7 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
              <Link to={`/companies/${company.id}`}>{company.companyName}</Link>
            </h3>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-0.5">
              {company.industry || 'Technology'}
            </p>
          </div>
        </div>

        {company.description && (
          <p className="mt-3.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {company.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4 text-xs text-slate-500">
          {company.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {company.location}
            </span>
          )}
          {company.companySize && (
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              {company.companySize} employees
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-5 text-xs">
        <span className="font-semibold text-slate-700">
          <span className="text-blue-600 font-bold">{company.totalJobs || 0}</span> Openings
        </span>
        <Link
          to={`/companies/${company.id}`}
          className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 transition"
        >
          View Company <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
