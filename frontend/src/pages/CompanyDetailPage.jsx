import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { jobService } from '../services/jobService';
import JobCard from '../components/job/JobCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Users,
  Calendar,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

const CompanyDetailPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const comp = await profileService.getCompanyById(id);
        setCompany(comp);

        if (comp?.userId) {
          const companyJobs = await jobService.getEmployerJobs();
          // Filter jobs by employer id
          setJobs(companyJobs.filter((j) => j.employerId === comp.userId));
        }
      } catch (err) {
        console.error('Error fetching company details', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading company profile..." />;
  if (!company) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Company Not Found</h2>
        <Link to="/companies" className="mt-4 inline-block text-xs font-bold text-blue-600">
          Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Companies
        </Link>
      </div>

      {/* Company Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl overflow-hidden shrink-0">
              {company.logo ? (
                <img
                  src={`/api/files/logo/${company.logo}`}
                  alt={company.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-10 h-10 text-blue-600" />
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {company.industry || 'Technology'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                {company.companyName}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Founded {company.foundedYear || 2020} • {company.companySize || '11-50'} employees
              </p>
            </div>
          </div>

          {company.website && (
            <a
              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              <Globe className="w-4 h-4 text-blue-600" /> Visit Website
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}
        </div>

        {/* Company Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-slate-600">
          {company.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{company.location}</span>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>{company.phone}</span>
            </div>
          )}
          {company.email && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{company.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Active on JobConnect</span>
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">About Company</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {company.description}
            </p>
          </div>
        )}
      </div>

      {/* Available Jobs from this company */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Open Positions ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No active job postings from this company at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailPage;
