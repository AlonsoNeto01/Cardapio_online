import { cn } from '@/lib/utils';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] transition-all duration-200',
            'focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]',
            error && 'border-[var(--accent-red)] focus:border-[var(--accent-red)] focus:ring-[var(--accent-red-glow)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[var(--accent-red)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
