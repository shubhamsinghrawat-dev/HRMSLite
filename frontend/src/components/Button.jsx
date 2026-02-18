import { HiOutlineRefresh } from 'react-icons/hi';

const variants = {
  primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm hover:shadow',
  secondary: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 hover:border-zinc-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow',
  outline: 'border border-violet-600 text-violet-600 hover:bg-violet-50 hover:border-violet-700',
  ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-md font-medium
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        inline-flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <HiOutlineRefresh className="animate-spin h-4 w-4" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
}
