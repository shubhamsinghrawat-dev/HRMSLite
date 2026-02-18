import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

export default function Card({ title, value, icon: Icon, color = 'teal', subtitle, trend, trendUp }) {
  const colorStyles = {
    teal: {
      border: 'border-l-violet-600',
      text: 'text-violet-600',
    },
    green: {
      border: 'border-l-emerald-600',
      text: 'text-emerald-600',
    },
    red: {
      border: 'border-l-red-500',
      text: 'text-red-500',
    },
    yellow: {
      border: 'border-l-amber-500',
      text: 'text-amber-500',
    },
    blue: {
      border: 'border-l-blue-600',
      text: 'text-blue-600',
    },
    indigo: {
      border: 'border-l-violet-600',
      text: 'text-violet-600',
    },
  };

  const styles = colorStyles[color] || colorStyles.teal;

  return (
    <div className={`bg-white rounded-lg border-l-[3px] ${styles.border} p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-zinc-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {trendUp ? <HiArrowUp className="w-3 h-3" /> : <HiArrowDown className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
        <div className="p-2">
          {Icon && <Icon className={`w-5 h-5 ${styles.text}`} />}
        </div>
      </div>
    </div>
  );
}
