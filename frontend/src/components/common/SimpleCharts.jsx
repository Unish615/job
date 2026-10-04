import React from 'react';

export const BarChart = ({ data, title, height = 200 }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <h4 className="text-sm font-bold text-slate-800 mb-4">{title}</h4>
        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data available</div>
      </div>
    );
  }

  const entries = Object.entries(data);
  const maxVal = Math.max(...entries.map(([_, v]) => v), 1);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <h4 className="text-sm font-bold text-slate-900 mb-6">{title}</h4>
      <div className="space-y-4">
        {entries.map(([label, value], idx) => {
          const percentage = Math.round((value / maxVal) * 100);
          const colors = [
            'bg-blue-600',
            'bg-emerald-500',
            'bg-indigo-600',
            'bg-amber-500',
            'bg-rose-500',
            'bg-teal-500',
            'bg-purple-600',
          ];
          const color = colors[idx % colors.length];

          return (
            <div key={label}>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="truncate pr-2">{label}</span>
                <span className="text-slate-900 font-bold">{value}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DonutDistribution = ({ data, title }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <h4 className="text-sm font-bold text-slate-800 mb-4">{title}</h4>
        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data available</div>
      </div>
    );
  }

  const entries = Object.entries(data);
  const total = entries.reduce((acc, [_, v]) => acc + v, 0);

  const colors = {
    'Job Seekers': 'bg-blue-600 text-blue-600',
    'Employers': 'bg-indigo-600 text-indigo-600',
    'Admins': 'bg-amber-500 text-amber-500',
    'Pending': 'bg-amber-500 text-amber-500',
    'Reviewed': 'bg-blue-600 text-blue-600',
    'Accepted': 'bg-emerald-500 text-emerald-500',
    'Rejected': 'bg-rose-500 text-rose-500',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <h4 className="text-sm font-bold text-slate-900 mb-4">{title}</h4>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Records</span>
        <span className="text-lg font-bold text-slate-900">{total}</span>
      </div>
      <div className="space-y-3">
        {entries.map(([label, value]) => {
          const percent = total > 0 ? Math.round((value / total) * 100) : 0;
          const clr = colors[label] || 'bg-slate-600 text-slate-600';

          return (
            <div key={label} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${clr.split(' ')[0]}`} />
                <span className="font-medium text-slate-700">{label}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-slate-500">{percent}%</span>
                <span className="font-bold text-slate-900 w-8 text-right">{value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
