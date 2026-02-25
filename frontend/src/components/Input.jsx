import { HiExclamationCircle } from 'react-icons/hi';

export default function Input({
  label,
  error,
  type = 'text',
  className = '',
  icon: Icon,
  helper,
  required,
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`w-5 h-5 ${error ? 'text-rose-400' : 'text-zinc-400'}`} />
          </div>
        )}
        <input
          type={type}
          className={`
            w-full px-3 py-2 bg-white border rounded-md
            transition-colors duration-150
            placeholder:text-zinc-400
            focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
            hover:border-zinc-300
            ${Icon ? 'pl-10' : ''}
            ${error
              ? 'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-zinc-200'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1.5">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="mt-1.5 text-sm text-zinc-500">{helper}</p>
      )}
    </div>
  );
}
