import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  MdDashboard, MdCalendarMonth, MdBarChart, MdTrendingUp,
  MdMenu, MdClose, MdLogout, MdDarkMode, MdLightMode,
} from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/', icon: MdDashboard, label: 'Dashboard', color: 'from-violet-500 to-indigo-500' },
  { to: '/calendar', icon: MdCalendarMonth, label: 'Calendar', color: 'from-blue-500 to-cyan-500' },
  { to: '/statistics', icon: MdBarChart, label: 'Statistics', color: 'from-emerald-500 to-teal-500' },
  { to: '/predictor', icon: MdTrendingUp, label: 'Predictor', color: 'from-orange-500 to-pink-500' },
];

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex flex-col w-64 h-full bg-white dark:bg-[#0a0a14] border-r border-gray-200 dark:border-[#ffffff26]">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200 dark:border-[#ffffff26]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl animated-gradient flex items-center justify-center text-white font-black text-base shadow-lg shadow-violet-500/30">
            A
          </div>
          <div>
            <p className="font-black text-base leading-none tracking-tight">AttendCalc</p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Attendance Tracker</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
            <MdClose size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, color }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <NavLink
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'nav-active'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#ffffff0d] hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? 'bg-white/20' : `bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100`
                  }`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span>{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-[#ffffff26] space-y-2">
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#ffffff0d] hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#ffffff1a] flex items-center justify-center">
            {dark ? <MdLightMode size={15} /> : <MdDarkMode size={15} />}
          </div>
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#ffffff08] border border-gray-200 dark:border-[#ffffff26]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} title="Logout" className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <MdLogout size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#07070f]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative z-10 flex flex-col"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 bg-white/90 dark:bg-[#0a0a14]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#ffffff26] shrink-0">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#ffffff0d] text-gray-500"
            onClick={() => setSidebarOpen(true)}
          >
            <MdMenu size={22} />
          </button>
          <div className="flex-1" />
          <button
            onClick={toggle}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#ffffff0d] text-gray-500 dark:text-gray-400 lg:hidden"
          >
            {dark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>
        </header>

        {/* Page with transition */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
