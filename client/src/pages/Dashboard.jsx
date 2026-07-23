import { useEffect, useState } from 'react';
import {
  MdCheckCircle, MdCancel, MdBeachAccess, MdWork,
  MdSchedule, MdTrendingUp, MdEmojiEvents, MdWarning,
} from 'react-icons/md';
import { motion } from 'framer-motion';
import { fetchStats } from '../services/attendanceService';
import AttendancePieChart from '../charts/AttendancePieChart';
import MonthlyBarChart from '../charts/MonthlyBarChart';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }),
};

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const num = parseFloat(value);
    if (isNaN(num)) { setDisplay(value); return; }
    let start = 0;
    const duration = 800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(typeof value === 'string' && value.includes('%')
        ? `${(eased * num).toFixed(1)}%`
        : Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span>{display}</span>;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-4 border-violet-200 dark:border-violet-900 border-t-violet-600 rounded-full"
      />
      <p className="text-sm text-gray-400 font-medium">Loading your dashboard...</p>
    </div>
  );

  const pct = parseFloat(stats?.percentage || 0);
  const statusColor = pct >= 75 ? 'from-emerald-500 to-teal-500' : pct >= 65 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500';
  const statusText = pct >= 75 ? 'Good Standing' : pct >= 65 ? 'At Risk' : 'Below Minimum';
  const statusIcon = pct >= 75 ? '🏆' : pct >= 65 ? '⚠️' : '🚨';

  const statCards = [
    { label: 'Attendance %', value: `${pct}%`, icon: MdTrendingUp, gradient: statusColor },
    { label: 'Present Periods', value: stats?.totalAttended || 0, icon: MdCheckCircle, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Absent Periods', value: stats?.totalMissed || 0, icon: MdCancel, gradient: 'from-red-500 to-rose-500' },
    { label: 'Holidays', value: stats?.holidays || 0, icon: MdBeachAccess, gradient: 'from-amber-500 to-orange-500' },
    { label: 'Working Days', value: stats?.workingDays || 0, icon: MdWork, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Total Conducted', value: stats?.totalConducted || 0, icon: MdSchedule, gradient: 'from-violet-500 to-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner with 3D */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl overflow-hidden animated-gradient p-6 text-white shadow-2xl shadow-violet-500/20 min-h-[180px] noise"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm font-medium"
            >
              Good day,
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black mt-0.5 tracking-tight"
            >
              {user?.name || 'Student'} 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-sm mt-1"
            >
              Here's your attendance overview
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex items-center gap-4"
          >
            <div className="text-center">
              <p className="text-5xl font-black"><AnimatedNumber value={pct} />%</p>
              <p className="text-white/70 text-xs mt-1 font-medium">Overall Attendance</p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-sm text-sm font-bold border border-white/20">
              {statusIcon} {statusText}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
          className="relative z-10 mt-5"
        >
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(pct, 100)}%` }}
              transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/50 mt-1.5">
            <span>0%</span>
            <span className="text-white/70 font-semibold">Target: 75%</span>
            <span>100%</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className="stat-card group cursor-default"
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
              >
                <card.icon size={22} />
              </motion.div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5 count-up">
                  <AnimatedNumber value={card.value} />
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        <AttendancePieChart attended={stats?.totalAttended || 0} missed={stats?.totalMissed || 0} percentage={pct} />
        {stats?.monthly?.length > 0 && <MonthlyBarChart data={stats.monthly} />}
      </motion.div>

      {/* Best / Worst */}
      {stats?.bestMonth && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="rounded-2xl p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50">
            <div className="flex items-center gap-2 mb-2">
              <MdEmojiEvents className="text-emerald-500" size={20} />
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Best Month</p>
            </div>
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">{stats.bestMonth}</p>
          </div>
          <div className="rounded-2xl p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50">
            <div className="flex items-center gap-2 mb-2">
              <MdWarning className="text-red-500" size={20} />
              <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">Lowest Month</p>
            </div>
            <p className="text-xl font-black text-red-700 dark:text-red-300">{stats.worstMonth}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
