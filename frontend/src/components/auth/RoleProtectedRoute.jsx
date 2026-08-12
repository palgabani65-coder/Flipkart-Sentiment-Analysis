import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export const RoleProtectedRoute = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050711] text-slate-100">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role || 'user';
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050711] text-slate-100 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-2xl bg-[#0F172A] border border-rose-500/30 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            You do not have administrative permissions to view this section. This area is restricted to system administrators only.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to User Dashboard</span>
            </Link>

            <Link
              to="/"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return children;
};
