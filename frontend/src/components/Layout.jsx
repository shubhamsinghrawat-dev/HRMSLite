import { Outlet, useLocation } from 'react-router-dom';
import { HiMenuAlt2 } from 'react-icons/hi';
import { useState } from 'react';
import Sidebar from './Sidebar';

const getPageTitle = (pathname) => {
  const titles = {
    '/': 'Dashboard',
    '/employees': 'Employees',
    '/attendance': 'Attendance',
  };
  return titles[pathname] || 'Dashboard';
};

const getPageSubtitle = (pathname) => {
  const subtitles = {
    '/': 'Welcome back! Here\'s your workforce overview',
    '/employees': 'Manage your organization\'s workforce',
    '/attendance': 'Track and manage attendance records',
  };
  return subtitles[pathname] || '';
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const sidebarWidth = sidebarOpen ? 240 : 72;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} width={sidebarWidth} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        style={{ marginLeft: `${sidebarWidth}px` }}
        className="min-h-screen transition-all duration-300"
      >
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md hover:bg-zinc-100 transition-colors"
              >
                <HiMenuAlt2 className="w-5 h-5 text-zinc-500" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">{getPageTitle(location.pathname)}</h2>
                <p className="text-sm text-zinc-500">
                  {getPageSubtitle(location.pathname)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-md">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                <span className="text-sm text-zinc-600">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
