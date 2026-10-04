import React from 'react';
import { Briefcase, Target, Shield, Award, Users, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <Briefcase className="w-4 h-4" /> About JobConnect
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Connecting Talent with Visionary Teams
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          JobConnect is a modern recruitment ecosystem built to simplify job discovery, eliminate friction in applications, and empower employers with intuitive applicant review workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Our Mission</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bridge the gap between skilled job seekers and high-growth companies with transparency and real-time status visibility.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Security & RBAC</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Enterprise-grade role-based access control protecting candidate resumes and employer hiring pipelines.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Verified Opportunities</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Curated listings across Software, Design, Data Science, and Engineering with transparent salary estimates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
