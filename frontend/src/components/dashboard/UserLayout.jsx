import React, { useState } from 'react';
import { UserSidebar } from './UserSidebar';
import { DashboardHeader } from './DashboardHeader';
import { PageTransition } from './PageTransition';

export const UserLayout = ({ children, title, subtitle }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('flipsentiment_sidebar_collapsed');
      return saved !== null ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('flipsentiment_sidebar_collapsed', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  return (
    <div className="min-h-screen flex bg-[#F4F3F8] dark:bg-[#111116] text-slate-900 dark:text-white transition-colors duration-300 font-sans relative overflow-x-hidden">
      {/* Reference-style Collapsible Sidebar */}
      <UserSidebar
        isOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Workspace Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>

      </div>
    </div>
  );
};
