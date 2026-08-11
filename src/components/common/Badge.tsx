import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'approved' | 'in-review' | 'draft' | 'design' | 'code' | 'spec' | 'ba' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'draft', className, size = 'md' }: BadgeProps) {
  const baseStyles = "font-bold rounded-lg border whitespace-nowrap inline-flex items-center gap-1.5 font-mono";

  const variants = {
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    'in-review': "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    design: "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    code: "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    spec: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    ba: "bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200",
    error: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200",
    info: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
