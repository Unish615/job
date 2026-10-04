import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import HomePage from '../pages/HomePage';
import JobsPage from '../pages/JobsPage';
import JobDetailPage from '../pages/JobDetailPage';
import CompaniesPage from '../pages/CompaniesPage';
import CompanyDetailPage from '../pages/CompanyDetailPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';

// Job Seeker Pages
import JobSeekerDashboard from '../pages/JobSeekerDashboard';
import JobSeekerProfilePage from '../pages/JobSeekerProfilePage';
import MyApplicationsPage from '../pages/MyApplicationsPage';
import SavedJobsPage from '../pages/SavedJobsPage';

// Employer Pages
import EmployerDashboard from '../pages/EmployerDashboard';
import ManageJobsPage from '../pages/ManageJobsPage';
import PostJobPage from '../pages/PostJobPage';
import EditJobPage from '../pages/EditJobPage';
import EmployerApplicantsPage from '../pages/EmployerApplicantsPage';
import EmployerProfilePage from '../pages/EmployerProfilePage';

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminJobsPage from '../pages/AdminJobsPage';
import AdminApplicationsPage from '../pages/AdminApplicationsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with Main Navbar and Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Job Seeker Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/job-seeker/dashboard" element={<JobSeekerDashboard />} />
        <Route path="/job-seeker/profile" element={<JobSeekerProfilePage />} />
        <Route path="/job-seeker/applications" element={<MyApplicationsPage />} />
        <Route path="/job-seeker/saved-jobs" element={<SavedJobsPage />} />
      </Route>

      {/* Employer Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/jobs" element={<ManageJobsPage />} />
        <Route path="/employer/post-job" element={<PostJobPage />} />
        <Route path="/employer/edit-job/:id" element={<EditJobPage />} />
        <Route path="/employer/applicants" element={<EmployerApplicantsPage />} />
        <Route path="/employer/profile" element={<EmployerProfilePage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/jobs" element={<AdminJobsPage />} />
        <Route path="/admin/applications" element={<AdminApplicationsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
