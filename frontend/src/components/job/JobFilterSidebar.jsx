import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Software Development',
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Science',
  'Cyber Security',
  'Networking',
  'Marketing',
  'Finance',
  'Human Resources',
  'Other',
];

const JOB_TYPES = ['All', 'Full Time', 'Part Time', 'Internship', 'Contract', 'Remote'];

const EXPERIENCES = ['All', '0-1 Years', '2+ Years', '3+ Years', '4+ Years', '5+ Years'];

const JobFilterSidebar = ({ filters, onChange, onReset }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Category
        </label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => onChange('category', e.target.value)}
          className="w-full text-sm rounded-xl border-slate-200 bg-slate-50/70 p-2.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Job Type
        </label>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center text-sm text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="radio"
                name="jobType"
                checked={(filters.jobType || 'All') === type}
                onChange={() => onChange('jobType', type === 'All' ? '' : type)}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span className="ml-2.5 font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Experience Level
        </label>
        <select
          value={filters.experience || 'All'}
          onChange={(e) => onChange('experience', e.target.value === 'All' ? '' : e.target.value)}
          className="w-full text-sm rounded-xl border-slate-200 bg-slate-50/70 p-2.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        >
          {EXPERIENCES.map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Location / Remote
        </label>
        <input
          type="text"
          placeholder="e.g. Remote, San Francisco"
          value={filters.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full text-sm rounded-xl border-slate-200 bg-slate-50/70 p-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        />
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Sort By
        </label>
        <select
          value={filters.sortBy || 'latest'}
          onChange={(e) => onChange('sortBy', e.target.value)}
          className="w-full text-sm rounded-xl border-slate-200 bg-slate-50/70 p-2.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="salary">Salary (Highest)</option>
        </select>
      </div>
    </div>
  );
};

export default JobFilterSidebar;
