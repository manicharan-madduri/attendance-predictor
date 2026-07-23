import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Month {label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.fill, fontWeight: 500, fontSize: 12 }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function MonthlyBarChart({ data }) {
  const chartData = data.map((m) => ({
    month: m.month.slice(5),
    Conducted: m.conducted,
    Attended: m.attended,
  }));

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base">Monthly Attendance</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-violet-200 dark:bg-violet-900/60 inline-block" />Conducted</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-violet-600 inline-block" />Attended</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barSize={12} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)', radius: 8 }} />
          <Bar dataKey="Conducted" fill="#c4b5fd" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Attended" fill="#7c3aed" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
