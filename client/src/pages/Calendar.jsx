import { useState, useMemo, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { MdChevronLeft, MdChevronRight, MdCalendarMonth } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useAttendance } from '../hooks/useAttendance';
import DayCard from '../components/DayCard';
import { getMonthDates, calcSummary } from '../utils/attendance';
import { fetchStats } from '../services/attendanceService';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const yearMonth = format(currentDate, 'yyyy-MM');

  const { records, loading, getRecord, updateRecord } = useAttendance(yearMonth);
  const dates = useMemo(() => getMonthDates(yearMonth), [yearMonth]);
  const summary = useMemo(() => calcSummary(records), [records]);

  // Total attendance from all-time stats
  const [totalStats, setTotalStats] = useState(null);
  useEffect(() => {
    fetchStats().then(setTotalStats).catch(() => {});
  }, [records]); // re-fetch when records change so it stays in sync

  const totalPct = parseFloat(totalStats?.percentage || 0);
  const isGood = totalPct >= 75;
  const isRisk = totalPct >= 65 && totalPct < 75;

  return (
    <div className="space-y-6 fade-in-up">
      {/* Hero Header — Total Attendance */}
      <div className="relative rounded-3xl overflow-hidden p-6 text-white shadow-2xl shadow-violet-500/20 animated-gradient">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MdCalendarMonth size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h1>
                <p className="text-white/60 text-xs mt-0.5">Attendance Calendar</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate((d) => subMonths(d, 1))}
                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
              >
                <MdChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="bg-white/20 hover:bg-white/30 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate((d) => addMonths(d, 1))}
                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
              >
                <MdChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Total Attendance Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-end text-sm">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wide font-semibold">Total Attendance</p>
                <p className="text-white/80 text-xs mt-0.5">
                  {totalStats?.totalAttended ?? '—'} attended / {totalStats?.totalConducted ?? '—'} conducted (all time)
                </p>
              </div>
              <span className="text-3xl font-black">{totalPct}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${Math.min(totalPct, 100)}%` }}
              />
            </div>
            {/* 75% marker */}
            <div className="relative h-0">
              <div
                className="absolute top-[-14px] w-0.5 h-4 bg-white/50 rounded-full"
                style={{ left: '75%' }}
              />
              <span
                className="absolute top-[-26px] text-[10px] text-white/50 -translate-x-1/2"
                style={{ left: '75%' }}
              >
                75%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* This month stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Attended', value: summary.attended, icon: '✅', from: 'from-emerald-50 dark:from-emerald-900/20', to: 'to-teal-50 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-700/50', val: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Missed', value: summary.missed, icon: '❌', from: 'from-red-50 dark:from-red-900/20', to: 'to-rose-50 dark:to-rose-900/20', border: 'border-red-200 dark:border-red-700/50', val: 'text-red-500 dark:text-red-400' },
          { label: 'Holidays', value: summary.holidays, icon: '🏖️', from: 'from-amber-50 dark:from-amber-900/20', to: 'to-orange-50 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-700/50', val: 'text-amber-600 dark:text-amber-400' },
          { label: 'Conducted', value: summary.conducted, icon: '📚', from: 'from-blue-50 dark:from-blue-900/20', to: 'to-indigo-50 dark:to-indigo-900/20', border: 'border-blue-200 dark:border-blue-700/50', val: 'text-blue-600 dark:text-blue-400' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border bg-gradient-to-br ${s.from} ${s.to} ${s.border} p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform`}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className={`text-xl font-bold ${s.val}`}>{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label} this month</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status badge */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border ${
        isGood
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400'
          : isRisk
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-400'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-400'
      }`}>
        <span>{isGood ? '🏆' : isRisk ? '⚠️' : '🚨'}</span>
        <span>
          {isGood
            ? `Overall on track! Total ${totalStats?.totalAttended ?? 0}/${totalStats?.totalConducted ?? 0} periods attended.`
            : isRisk
            ? `Overall at risk — need more attendance to reach 75%.`
            : `Overall below minimum — attend more classes urgently.`}
        </span>
      </div>

      {/* Day cards — vertical */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <div className="w-10 h-10 border-4 border-violet-200 dark:border-violet-900 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading calendar...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dates.map((date, i) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.35 }}
            >
              <DayCard
                date={date}
                record={getRecord(date)}
                onUpdate={updateRecord}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
