import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
          <Compass className="w-8 h-8" />
        </div>
        <div>
          <span className="text-4xl font-black text-blue-600 block">404</span>
          <h1 className="text-xl font-bold text-slate-900 mt-2">Page Not Found</h1>
          <p className="mt-1 text-sm text-slate-500">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-blue-600 transition"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
