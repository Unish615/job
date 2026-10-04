import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
    reviewed: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
    closed: 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-500/20',
    suspended: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20',
  };

  const currentStyle = styles[normalized] || 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ring-1 ring-inset ${currentStyle}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};

export default StatusBadge;
