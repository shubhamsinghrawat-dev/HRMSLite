import { NavLink } from 'react-router-dom';
import { HiHome, HiUsers, HiCalendar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const navItems = [
  { path: '/', icon: HiHome, label: 'Dashboard' },
  { path: '/employees', icon: HiUsers, label: 'Employees' },
  { path: '/attendance', icon: HiCalendar, label: 'Attendance' },
];

export default function Sidebar({ isOpen, width, onToggle }) {
  return (
    <aside
      style={{ width: `${width}px` }}
      className="fixed left-0 top-0 h-full bg-white border-r border-zinc-200 transition-all duration-300 z-50"
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-7 w-6 h-6 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-400 shadow-sm hover:text-zinc-600 hover:shadow transition-all z-50"
      >
        {isOpen ? (
          <HiChevronLeft className="w-4 h-4" />
        ) : (
          <HiChevronRight className="w-4 h-4" />
        )}
      </button>

      <div className="h-full flex flex-col">
        {/* Logo Section */}
        <div className="p-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            {isOpen && (
              <div>
                <h1 className="text-base font-semibold text-zinc-900">
                  HRMS <span className="text-violet-600">Lite</span>
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center ${isOpen ? 'px-3' : 'justify-center'} py-2.5 rounded-md transition-colors relative ${
                    isActive
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 ${isOpen ? 'mr-3' : ''}`} />

                    {isOpen && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-zinc-100">
          <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} p-2.5 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer`}>
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
              A
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 truncate">Admin</p>
                <p className="text-xs text-zinc-500 truncate">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
