import { useState, useEffect } from 'react';
import { fetchStats } from '../services/attendanceService';
import { getAttendanceColor } from '../utils/attendance';
import { MdTrendingUp, MdCalculate, MdRefresh, MdCheckCircle, MdSchedule, MdCalendarToday } from 'react-icons/md';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PERIODS_PER_DAY = 7;

function calcPrediction(attended, conducted, target) {
  const current = conducted > 0 ? (attended / conducted) * 100 : 0;
  if (current >= target) {
    return { current: current.toFixed(1), periodsNeeded: 0, daysNeeded: 0, alreadyMet: true };
  }
  const t = target / 100;
  const periodsNeeded = Math.ceil((t * conducted - attended) / (1 - t));
  const daysNeeded = Math.ceil(periodsNeeded / PERIODS_PER_DAY);
  return { current: current.toFixed(1), periodsNeeded, daysNeeded, alreadyMet: false };
}

export default function Predictor() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [target, setTarget] = useState(75);
  const [result, setResult] = useState(null);

  const loadStats = () => {
    setLoadingStats(true);
    setResult(null);
    fetchStats()
      .then(setStats)
      .catch(() => toast.error('Failed to load attendance data'))
      .finally(() => setLoadingStats(false));
  };

  useEffect(() => { loadStats(); }, []);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!stats) return toast.error('Attendance data not loaded yet');
    if (!target || target < 1 || target > 100) return toast.error('Enter a valid target between 1–100');
    setResult(calcPrediction(stats.totalAttended, stats.totalConducted, Number(target)));
  };

  const currentPct = stats ? parseFloat(((stats.totalAttended / (stats.totalConducted || 1)) * 100).toFixed(1)) : 0;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
          <MdTrendingUp size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Attendance Predictor</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Auto-loaded from your calendar data</p>
        </div>
      </motion.div>

      {/* Current Stats */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-bold text-base">Your Current Attendance</p>
          <button
            onClick={loadStats}
            disabled={loadingStats}
            className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 font-semibold px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700/50 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-all disabled:opacity-50"
          >
            <MdRefresh size={14} className={loadingStats ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loadingStats ? (
          <div className="flex items-center gap-3 py-4">
            <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading your attendance data...</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-700/50 text-center">
              <p className="text-[10px] text-violet-500 uppercase tracking-wide font-semibold mb-1">Attended</p>
              <p className="text-2xl font-black text-violet-600 dark:text-violet-400">{stats.totalAttended}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">periods</p>
            </div>
            <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700/50 text-center">
              <p className="text-[10px] text-blue-500 uppercase tracking-wide font-semibold mb-1">Conducted</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.totalConducted}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">periods</p>
            </div>
            <div className="rounded-2xl p-4 bg-gray-50 dark:bg-[#ffffff08] border border-gray-200 dark:border-[#ffffff26] text-center">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Current %</p>
              <p className={`text-2xl font-black ${getAttendanceColor(currentPct)}`}>{currentPct}%</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">overall</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-500">Failed to load data. Click Refresh.</p>
        )}
      </div>

      {/* Target Input */}
      <form onSubmit={handleCalculate} className="card space-y-5">
        <div className="flex items-center gap-2">
          <MdCalculate className="text-violet-500" size={20} />
          <h3 className="font-bold text-base">Set Your Target</h3>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block">
            Target Attendance %
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              className="input text-lg font-bold"
              placeholder="e.g. 75"
              value={target}
              onChange={(e) => { setTarget(e.target.value); setResult(null); }}
              min={1}
              max={100}
              required
            />
            <span className="text-2xl font-black text-gray-400">%</span>
          </div>
          <div className="flex gap-2 mt-1">
            {[75, 80, 85, 90].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTarget(t); setResult(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  Number(target) === t
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/30'
                    : 'bg-gray-100 dark:bg-[#ffffff0d] border-gray-200 dark:border-[#ffffff26] text-gray-500 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 hover:border-violet-300 dark:hover:border-violet-700/50'
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingStats || !stats}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2"
        >
          <MdCalculate size={18} /> Calculate
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="card space-y-5">
          <h3 className="font-bold text-base">Prediction Results</h3>

          {result.alreadyMet ? (
            <div className="flex items-center gap-3 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                <MdCheckCircle size={24} />
              </div>
              <div>
                <p className="font-bold text-emerald-700 dark:text-emerald-400">Target Already Met! 🎉</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-0.5">
                  Your current {result.current}% already meets the {target}% target.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-4 bg-gray-50 dark:bg-[#ffffff08] border border-gray-200 dark:border-[#ffffff26] text-center">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Current</p>
                  <p className={`text-3xl font-black ${getAttendanceColor(parseFloat(result.current))}`}>
                    {result.current}%
                  </p>
                </div>
                <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-700/50 text-center">
                  <p className="text-[10px] text-violet-500 uppercase tracking-wide font-semibold mb-1">Target</p>
                  <p className="text-3xl font-black text-violet-600 dark:text-violet-400">{target}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                      <MdSchedule size={16} />
                    </div>
                    <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Periods Needed</p>
                  </div>
                  <p className="text-4xl font-black text-orange-600 dark:text-orange-400">{result.periodsNeeded}</p>
                  <p className="text-xs text-orange-500/70 dark:text-orange-400/60 mt-1">consecutive periods to attend</p>
                </div>

                <div className="rounded-2xl p-5 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-pink-500 flex items-center justify-center text-white">
                      <MdCalendarToday size={16} />
                    </div>
                    <p className="text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide">Days Needed</p>
                  </div>
                  <p className="text-4xl font-black text-pink-600 dark:text-pink-400">{result.daysNeeded}</p>
                  <p className="text-xs text-pink-500/70 dark:text-pink-400/60 mt-1">full days @ 7 periods/day</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50">
                <span className="text-xl flex-shrink-0">📌</span>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Attend the next <strong>{result.periodsNeeded} periods</strong> without missing any class.
                  That's approximately <strong>{result.daysNeeded} full days</strong> (at 7 periods/day) to reach <strong>{target}%</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
