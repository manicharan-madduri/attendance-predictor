import { useState, useEffect } from 'react';
import { format, parseISO, isToday, isFuture } from 'date-fns';
import { MdBeachAccess, MdCheckCircle } from 'react-icons/md';
import { motion } from 'framer-motion';

const STATUS = {
  P: { label: 'P', title: 'Present', active: 'bg-emerald-500 text-white ring-2 ring-emerald-400/60 scale-110 shadow-lg shadow-emerald-500/30', inactive: 'bg-gray-100 dark:bg-[#ffffff0d] text-gray-400 dark:text-gray-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-500 border border-gray-200 dark:border-[#ffffff1a]' },
  A: { label: 'A', title: 'Absent', active: 'bg-red-500 text-white ring-2 ring-red-400/60 scale-110 shadow-lg shadow-red-500/30', inactive: 'bg-gray-100 dark:bg-[#ffffff0d] text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 border border-gray-200 dark:border-[#ffffff1a]' },
  C: { label: 'C', title: 'Not Conducted', active: 'bg-amber-400 text-white ring-2 ring-amber-300/60 scale-110 shadow-lg shadow-amber-400/30', inactive: 'bg-gray-100 dark:bg-[#ffffff0d] text-gray-400 dark:text-gray-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-500 border border-gray-200 dark:border-[#ffffff1a]' },
};

function periodToStatus(period) {
  if (!period.conducted) return 'C';
  if (period.attended) return 'P';
  return 'A';
}

function statusToPeriod(status, periodNumber) {
  return {
    periodNumber,
    conducted: status !== 'C',
    attended: status === 'P',
  };
}

// null means "not set yet" — only map to status if record was actually saved (has periods)
function getInitialDraft(record) {
  if (!record?.periods?.length) return Array(7).fill(null);
  // If all periods are the default (conducted:true, attended:false) and record has no _id, treat as unsaved
  const hasId = record._id;
  if (!hasId) return Array(7).fill(null);
  return record.periods.map((p) => periodToStatus(p));
}

export default function DayCard({ date, record, onUpdate }) {
  const dateObj = parseISO(date);
  const future = isFuture(dateObj) && !isToday(dateObj);
  const isHoliday = record.isHoliday;

  const [draft, setDraft] = useState(() => getInitialDraft(record));
  const [saved, setSaved] = useState(false);

  // Re-sync when record updates from server
  useEffect(() => {
    setDraft(getInitialDraft(record));
  }, [record]);

  const toggleHoliday = () => {
    onUpdate({
      date,
      isHoliday: !isHoliday,
      holidayReason: !isHoliday ? 'Holiday' : '',
      periods: !isHoliday
        ? []
        : Array.from({ length: 7 }, (_, i) => ({ periodNumber: i + 1, conducted: true, attended: false })),
    });
  };

  const setStatus = (idx, status) => {
    if (future || isHoliday) return;
    setDraft((prev) => {
      const next = [...prev];
      // clicking same status deselects it
      next[idx] = prev[idx] === status ? null : status;
      return next;
    });
    setSaved(false);
  };

  const handleSubmit = () => {
    // treat null as 'A' only on submit
    const periods = draft.map((status, i) => statusToPeriod(status ?? 'A', i + 1));
    onUpdate({ ...record, date, periods });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setCount = draft.filter((s) => s !== null).length;
  const attendedCount = draft.filter((s) => s === 'P').length;
  const conductedCount = draft.filter((s) => s !== 'C' && s !== null).length;

  const isCurrentDay = isToday(dateObj);

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isHoliday
        ? 'bg-amber-50 dark:bg-[#1a1200] border-amber-200 dark:border-amber-800/50'
        : isCurrentDay
        ? 'bg-white dark:bg-[#111118] border-violet-300 dark:border-violet-700/50 shadow-md shadow-violet-500/10'
        : future
        ? 'bg-gray-50 dark:bg-[#0d0d14] border-gray-200 dark:border-[#ffffff26] opacity-50'
        : 'bg-white dark:bg-[#111118] border-gray-200 dark:border-[#ffffff26]'
    }`}>

      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${
        isCurrentDay
          ? 'bg-gradient-to-r from-violet-600 to-indigo-600'
          : isHoliday
          ? 'bg-gradient-to-r from-amber-400 to-orange-400'
          : 'bg-gray-50 dark:bg-[#ffffff05] border-b border-gray-200 dark:border-[#ffffff26]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold shadow-sm flex-shrink-0 ${
            isCurrentDay ? 'bg-white/20 text-white' : 'bg-white dark:bg-[#ffffff1a] text-gray-800 dark:text-gray-100'
          }`}>
            <span className="text-lg leading-none">{format(dateObj, 'dd')}</span>
            <span className="text-[9px] leading-none opacity-60 mt-0.5">{format(dateObj, 'EEE')}</span>
          </div>
          <div>
            <p className={`font-bold text-sm ${isCurrentDay ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
              {format(dateObj, 'EEEE')}
            </p>
            <p className={`text-xs ${isCurrentDay ? 'text-white/60' : 'text-gray-400'}`}>
              {format(dateObj, 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isHoliday && !future && setCount > 0 && (
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              conductedCount === 0 ? 'bg-gray-100 dark:bg-[#ffffff1a] text-gray-400'
              : attendedCount / conductedCount >= 0.75
                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400'
            }`}>
              {attendedCount}/{conductedCount}
            </span>
          )}
          <button
            onClick={toggleHoliday}
            title={isHoliday ? 'Remove holiday' : 'Mark as holiday'}
            className={`p-1.5 rounded-lg transition-all ${
              isHoliday
                ? 'bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300'
                : isCurrentDay
                ? 'text-white/50 hover:text-white hover:bg-white/20'
                : 'text-gray-300 dark:text-gray-600 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30'
            }`}
          >
            <MdBeachAccess size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      {isHoliday ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <span className="text-5xl">🏖️</span>
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Holiday</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Period grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, idx) => {
              const current = draft[idx];
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">P{idx + 1}</span>
                  <div className="flex flex-col gap-1">
                    {['P', 'A', 'C'].map((s) => {
                      const st = STATUS[s];
                      const active = current === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setStatus(idx, s)}
                          disabled={future}
                          title={st.title}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150 ${
                            active ? st.active : st.inactive
                          } disabled:cursor-not-allowed disabled:opacity-40`}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Present</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />Absent</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />Not Conducted</span>
          </div>

          {/* Submit */}
          {!future && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200 ${
                saved
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25'
              }`}
            >
              <MdCheckCircle size={16} />
              {saved ? 'Saved!' : 'Submit'}
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
