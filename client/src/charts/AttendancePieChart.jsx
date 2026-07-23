import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#8b5cf6', '#f43f5e', '#f59e0b'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '8px 12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{payload[0].name}</p>
        <p style={{ color: '#94a3b8', fontSize: 12 }}>{payload[0].value} periods</p>
      </div>
    );
  }
  return null;
};

export default function AttendancePieChart({ attended, missed, percentage }) {
  const data = [
    { name: 'Present', value: attended },
    { name: 'Absent', value: missed },
  ].filter((d) => d.value > 0);

  const isGood = percentage >= 75;
  const isRisk = percentage >= 65 && percentage < 75;

  const statusConfig = isGood
    ? { label: 'Good Standing', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' }
    : isRisk
    ? { label: 'At Risk', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' }
    : { label: 'Below Minimum', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' };

  const pctColor = isGood ? '#10b981' : isRisk ? '#f59e0b' : '#ef4444';

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base">Attendance Overview</h3>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          {statusConfig.label}
        </span>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={900}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-3xl font-black" style={{ color: pctColor }}>{percentage}%</p>
          <p className="text-xs text-gray-400 mt-0.5">attendance</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {d.name} <strong className="text-gray-800 dark:text-gray-100">{d.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
