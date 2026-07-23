export default function StatCard({ label, value, icon: Icon, gradient, sub }) {
  return (
    <div className="stat-card bg-white dark:bg-[#111118] border-gray-200 dark:border-[#ffffff26] group cursor-default">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient || 'from-violet-500 to-indigo-500'} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={22} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
