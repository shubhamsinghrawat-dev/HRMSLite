import { HiExclamationCircle, HiChevronDown } from 'react-icons/hi';

export default function Select({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  icon: Icon,
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
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icon className={`w-5 h-5 ${error ? 'text-rose-400' : 'text-zinc-400'}`} />
          </div>
        )}
        <select
          className={`
            w-full px-3 py-2 bg-white border rounded-md appearance-none
            transition-colors duration-150
            focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
            hover:border-zinc-300
            ${Icon ? 'pl-10' : ''}
            ${error
              ? 'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-zinc-200'
            }
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <HiChevronDown className="w-5 h-5 text-zinc-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1.5">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
