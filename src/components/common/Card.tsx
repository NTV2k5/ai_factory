import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../App';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn("bg-card border border-border rounded-2xl shadow-sm p-5 flex flex-col gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-b border-border pb-3 flex justify-between items-center", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-bold text-foreground flex items-center gap-2", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 text-xs", className)} {...props}>
      {children}
    </div>
  );
}
