import api from './api';

export const fetchAttendance = (month) =>
  api.get('/attendance', { params: { month } }).then((r) => r.data);

export const saveAttendance = (payload) =>
  api.post('/attendance', payload).then((r) => r.data);

export const deleteAttendance = (date) =>
  api.delete(`/attendance/${date}`).then((r) => r.data);

export const fetchStats = () =>
  api.get('/attendance/stats').then((r) => r.data);

export const predictAttendance = (payload) =>
  api.post('/predict', payload).then((r) => r.data);

export const simulateAttendance = (payload) =>
  api.post('/predict/simulate', payload).then((r) => r.data);
