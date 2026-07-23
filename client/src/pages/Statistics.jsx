import { useEffect, useState } from 'react';
import { fetchStats } from '../services/attendanceService';
import MonthlyBarChart from '../charts/MonthlyBarChart';
import AttendancePieChart from '../charts/AttendancePieChart';
import { getAttendanceColor } from '../utils/attendance';
import { MdBarChart, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const overviewItems = (stats, pct) => [
  { label: 'Working Days', value: stats?.workingDays || 0, gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20', border: 'border-blue-200 dark:border-blue-700/50' },
  { label: 'Holidays', value: stats?.holidays || 0, gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-700/50' },
  { label: 'Total Conducted', value: stats?.totalConducted || 0, gradient: 'from-violet-500 to-purple-500', bg: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20', border: 'border-violet-200 dark:border-violet-700/50' },
  { label: 'Total Attended', value: stats?.totalAttended || 0, gradient: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-700/50' },
  { label: 'Total Missed', value: stats?.totalMissed || 0, gradient: 'from-red-500 to-rose-500', bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20', border: 'border-red-200 dark:border-red-700/50' },
  { label: 'Attendance %', value: `${pct}%`, gradient: pct >= 75 ? 'from-emerald-500 to-teal-500' : pct >= 65 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500', bg: pct >= 75 ? 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' : 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20', border: pct >= 75 ? 'border-emerald-200 dark:border-emerald-700/50' : 'border-red-200 dark:border-red-700/50' },
];

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => toast.error('Failed to load statistics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-10 h-10 border-4 border-violet-200 dark:border-violet-900 border-t-violet-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading statistics...</p>
    </div>
  );

  const pct = parseFloat(stats?.percentage || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
          <MdBarChart size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Statistics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Detailed attendance breakdown</p>
        </div>
      </motion.div>

      {/* Overview grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 stagger">
        {overviewItems(stats, pct).map(({ label, value, gradient, bg, border }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.03 }}
            className={`rounded-2xl p-5 bg-gradient-to-br ${bg} border ${border} cursor-default`}
          >
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{label}</p>
            <p className={`text-2xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AttendancePieChart attended={stats?.totalAttended || 0} missed={stats?.totalMissed || 0} percentage={pct} />
        {stats?.monthly?.length > 0 && <MonthlyBarChart data={stats.monthly} />}
      </div>

      {/* Monthly table */}
      {stats?.monthly?.length > 0 && (
        <div className="card overflow-hidden p-0">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-[#ffffff26]">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Monthly Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#ffffff05]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Month</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Conducted</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Attended</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Missed</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#ffffff26]">
                {stats.monthly.map((m, i) => {
                  const mp = parseFloat(m.percentage);
                  const isGood = mp >= 75;
                  return (
                    <tr key={m.month} className="hover:bg-gray-50 dark:hover:bg-[#ffffff05] transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-gray-100">{m.month}</td>
                      <td className="px-4 py-3.5 text-center text-gray-600 dark:text-gray-300">{m.conducted}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <MdArrowUpward size={12} />{m.attended}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                          <MdArrowDownward size={12} />{m.conducted - m.attended}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isGood
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                            : mp >= 65
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {m.percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
