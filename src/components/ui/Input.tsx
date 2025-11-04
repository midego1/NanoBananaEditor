import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border-2 border-gray-700/50 bg-gradient-to-b from-gray-900 to-gray-800 px-3 py-2 text-sm text-gray-100 font-medium ring-offset-gray-950 file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-yellow-400/50 focus-visible:ring-2 focus-visible:ring-yellow-400/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-inner',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';