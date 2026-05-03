// Dynamic Button Component
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-purple/50';

  const variants = {
    primary:
      'bg-primary-purple hover:bg-accent-purple text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]',
    secondary:
      'bg-card-bg hover:bg-gray-800 text-white border border-white/10 hover:border-white/30',
    ghost:
      'bg-transparent hover:bg-white/5 text-text-secondary hover:text-white border border-transparent hover:border-white/10',
    danger:
      'bg-error/10 hover:bg-error/20 text-error border border-error/30 hover:border-error/60',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
