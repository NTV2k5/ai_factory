import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '../../App';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'teal' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}, ref) => {
  const baseStyles = "font-bold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm",
    secondary: "bg-muted hover:bg-muted/80 text-foreground border border-border",
    outline: "bg-background border border-border hover:bg-muted text-foreground",
    ghost: "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm",
    teal: "bg-teal-600 hover:bg-teal-700 text-white shadow-sm",
    purple: "bg-purple-600 hover:bg-purple-700 text-white shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-xs",
    lg: "px-5 py-3 text-sm",
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
});

Button.displayName = 'Button';
