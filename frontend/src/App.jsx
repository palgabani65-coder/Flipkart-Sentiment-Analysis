import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';
import { UserLayout } from './components/dashboard/UserLayout';
import { AdminLayout } from './components/dashboard/AdminLayout';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F4F3F8] dark:bg-[#111116]">
    <div className="w-10 h-10 border-4 border-slate-300 border-t-[#111116] dark:border-t-[#2563EB] rounded-full animate-spin" />
  </div>
);

// Public Pages
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then((m) => ({ default: m.Register })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

// Seller Dashboard Pages
const UserDashboardHome = lazy(() => import('./pages/dashboard/UserDashboardHome').then((m) => ({ default: m.UserDashboardHome })));
const SellerProducts = lazy(() => import('./pages/dashboard/SellerProducts').then((m) => ({ default: m.SellerProducts })));
const ProductDetail = lazy(() => import('./pages/dashboard/ProductDetail').then((m) => ({ default: m.ProductDetail })));
const SellerReviews = lazy(() => import('./pages/dashboard/SellerReviews').then((m) => ({ default: m.SellerReviews })));
const SellerSentimentAnalysis = lazy(() => import('./pages/dashboard/SellerSentimentAnalysis').then((m) => ({ default: m.SellerSentimentAnalysis })));
const SellerAnalytics = lazy(() => import('./pages/dashboard/SellerAnalytics').then((m) => ({ default: m.SellerAnalytics })));
const SellerInsights = lazy(() => import('./pages/dashboard/SellerInsights').then((m) => ({ default: m.SellerInsights })));
const ReviewHistory = lazy(() => import('./pages/dashboard/ReviewHistory').then((m) => ({ default: m.ReviewHistory })));
const SellerProfile = lazy(() => import('./pages/dashboard/SellerProfile').then((m) => ({ default: m.SellerProfile })));
const SellerSettings = lazy(() => import('./pages/dashboard/SellerSettings').then((m) => ({ default: m.SellerSettings })));
const SellerNotifications = lazy(() => import('./pages/dashboard/SellerNotifications').then((m) => ({ default: m.SellerNotifications })));
const SellerReports = lazy(() => import('./pages/dashboard/SellerReports').then((m) => ({ default: m.SellerReports })));

// Admin Dashboard Pages
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview').then((m) => ({ default: m.AdminOverview })));
const AdminSellers = lazy(() => import('./pages/admin/AdminSellers').then((m) => ({ default: m.AdminSellers })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts })));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews').then((m) => ({ default: m.AdminReviews })));
const AdminSentimentAnalytics = lazy(() => import('./pages/admin/AdminSentimentAnalytics').then((m) => ({ default: m.AdminSentimentAnalytics })));
const AdminModel = lazy(() => import('./pages/admin/AdminModel').then((m) => ({ default: m.AdminModel })));
const AdminModelEvaluation = lazy(() => import('./pages/admin/AdminModelEvaluation').then((m) => ({ default: m.AdminModelEvaluation })));
const AdminSystemActivity = lazy(() => import('./pages/admin/AdminSystemActivity').then((m) => ({ default: m.AdminSystemActivity })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })));

export const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Seller Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><UserDashboardHome /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/products"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><SellerProducts /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/products/:productId"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><ProductDetail /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/reviews"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><SellerReviews /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/sentiment-analysis"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><SellerSentimentAnalysis /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/analytics"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><SellerAnalytics /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/insights"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><SellerInsights /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/review-history"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><ReviewHistory /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/profile"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><SellerProfile /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/settings"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><SellerSettings /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/notifications"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><SellerNotifications /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/reports"
                  element={
                    <RoleProtectedRoute allowedRoles={['user', 'admin']}>
                      <UserLayout><SellerReports /></UserLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Backward compatibility redirects */}
                <Route path="/dashboard/analyze" element={<Navigate to="/dashboard/reviews" replace />} />
                <Route path="/dashboard/product-analysis" element={<Navigate to="/dashboard/products" replace />} />

                {/* Admin Dashboard Routes */}
                <Route
                  path="/admin"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout title="Admin Console" subtitle="Platform Overview"><AdminOverview /></AdminLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/sellers"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout title="Seller Management" subtitle="Manage registered seller stores"><AdminSellers /></AdminLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout title="Global Products" subtitle="All Flipkart products catalog"><AdminProducts /></AdminLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reviews"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout title="Review Audits" subtitle="System-wide review logs"><AdminReviews /></AdminLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout title="Global Analytics" subtitle="Aggregate sentiment trends"><AdminSentimentAnalytics /></AdminLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/model"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout title="ML Model Management" subtitle="Model metrics & retraining"><AdminModel /></AdminLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/evaluation"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout title="Model Evaluation" subtitle="Algorithm comparison & confusion matrix"><AdminModelEvaluation /></AdminLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/activity"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout title="System Activity" subtitle="Real-time system audit logs"><AdminSystemActivity /></AdminLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout title="Platform Settings" subtitle="Global AI & platform configuration"><AdminSettings /></AdminLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};
export default App;
