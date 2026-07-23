import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { fetchAttendance, saveAttendance } from '../services/attendanceService';
import { defaultPeriods } from '../utils/attendance';
import toast from 'react-hot-toast';

export const useAttendance = (yearMonth) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!yearMonth) return;
    setLoading(true);
    try {
      const data = await fetchAttendance(yearMonth);
      setRecords(data);
    } catch {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, [yearMonth]);

  useEffect(() => { load(); }, [load]);

  // Get record for a specific date or return default (empty periods = no selection)
  const getRecord = (date) =>
    records.find((r) => r.date === date) || {
      date,
      isHoliday: false,
      holidayReason: '',
      periods: [],
    };

  // Save a record and update local state optimistically
  const updateRecord = async (payload) => {
    // Optimistic update
    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.date === payload.date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...payload };
        return updated;
      }
      return [...prev, payload];
    });
    try {
      const saved = await saveAttendance(payload);
      setRecords((prev) => {
        const idx = prev.findIndex((r) => r.date === saved.date);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        }
        return [...prev, saved];
      });
    } catch {
      toast.error('Failed to save');
      load(); // revert
    }
  };

  return { records, loading, getRecord, updateRecord, reload: load };
};
