import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { DashboardHeader } from './DashboardHeader';

export const AdminLayout = ({ children, title, subtitle }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F4F3F8] dark:bg-[#111116] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <DashboardHeader
          title={title || "Admin Console"}
          subtitle={subtitle || "Platform management, user accounts & ML operations"}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};
