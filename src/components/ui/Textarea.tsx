import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border-2 border-gray-700/50 bg-gradient-to-b from-gray-900 to-gray-800 px-3 py-2.5 text-sm text-gray-100 font-medium ring-offset-gray-950 placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-yellow-400/50 focus-visible:ring-2 focus-visible:ring-yellow-400/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all shadow-inner',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';