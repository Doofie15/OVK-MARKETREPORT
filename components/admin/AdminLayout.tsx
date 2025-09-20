import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import type { AdminSection } from './AdminSidebar';
import LoginPage from './LoginPage';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isAuthenticated: boolean;
  onLogin: (username: string, password: string) => Promise<boolean>;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  isAuthenticated,
  onLogin,
  onLogout
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={onLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-2 sm:px-6 py-4">
          <div className="w-[95%] max-w-none mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                {activeSection.replace('-', ' ')}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {getSectionDescription(activeSection)}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">A</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="w-[95%] max-w-none mx-auto p-2 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const getSectionDescription = (section: AdminSection): string => {
  const descriptions: Record<AdminSection, string> = {
    dashboard: 'Overview of system statistics and key metrics',
    seasons: 'Manage auction seasons and their configurations',
    auctions: 'Manage auction reports and trading data',
    'cape-mohair': 'Cape Mohair market reports and analysis',
    'ovk-reports': 'OVK market intelligence and reports',
    analytics: 'Advanced analytics and data visualization',
    insights: 'Market insights and trend analysis',
    'import-export': 'Bulk data import and export tools',
    users: 'User account management and permissions',
    settings: 'System configuration and preferences'
  };
  
  return descriptions[section] || '';
};

export default AdminLayout;
