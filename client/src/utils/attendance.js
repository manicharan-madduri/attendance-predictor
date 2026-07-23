import { format, getDaysInMonth, startOfMonth } from 'date-fns';

// Calculate attendance summary from records array
export const calcSummary = (records) => {
  let conducted = 0;
  let attended = 0;
  let holidays = 0;

  records.forEach((rec) => {
    if (rec.isHoliday) { holidays++; return; }
    rec.periods?.forEach((p) => {
      if (p.conducted) {
        conducted++;
        if (p.attended) attended++;
      }
    });
  });

  const percentage = conducted ? ((attended / conducted) * 100).toFixed(1) : '0.0';
  return { conducted, attended, missed: conducted - attended, holidays, percentage: parseFloat(percentage) };
};

// Get color class based on attendance percentage
export const getAttendanceColor = (pct) => {
  if (pct >= 75) return 'text-green-500';
  if (pct >= 65) return 'text-orange-500';
  return 'text-red-500';
};

export const getAttendanceBg = (pct) => {
  if (pct >= 75) return 'bg-green-500';
  if (pct >= 65) return 'bg-orange-500';
  return 'bg-red-500';
};

// Generate all dates for a given month (YYYY-MM)
export const getMonthDates = (yearMonth) => {
  const [year, month] = yearMonth.split('-').map(Number);
  const count = getDaysInMonth(new Date(year, month - 1));
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(year, month - 1, i + 1);
    return format(d, 'yyyy-MM-dd');
  });
};

// Default 7 periods
export const defaultPeriods = () =>
  Array.from({ length: 7 }, (_, i) => ({
    periodNumber: i + 1,
    conducted: true,
    attended: false,
  }));
