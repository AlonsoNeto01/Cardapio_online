import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

    const variants = {
      primary:
        'text-white hover:shadow-lg hover:shadow-green-500/20 focus-visible:ring-green-500 dark:text-gray-900',
      secondary:
        'bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 focus-visible:ring-[var(--primary)]',
      danger:
        'bg-[var(--accent-red)] text-white hover:opacity-90 focus-visible:ring-[var(--accent-red)]',
      ghost:
        'bg-transparent text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] focus-visible:ring-[var(--primary)]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-5 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
    };

    // Primary variant gets gradient
    const style = variant === 'primary' && !disabled
      ? { background: 'var(--gradient-cta)' }
      : {};

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={disabled}
        style={style}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
