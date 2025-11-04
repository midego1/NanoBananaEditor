import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed select-none',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-b from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 active:from-yellow-500 active:to-yellow-600 focus-visible:ring-yellow-400 shadow-lg shadow-yellow-400/20 hover:shadow-xl hover:shadow-yellow-400/30 hover:-translate-y-0.5 active:translate-y-0 border border-yellow-600/20',
        secondary: 'bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 hover:from-gray-700 hover:to-gray-800 active:from-gray-900 active:to-gray-950 focus-visible:ring-gray-600 border border-gray-700/50 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
        outline: 'border-2 border-gray-700/80 bg-transparent text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 hover:border-gray-600 active:bg-gray-800 backdrop-blur-sm shadow-sm hover:shadow-md',
        ghost: 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-100 active:bg-gray-800',
        destructive: 'bg-gradient-to-b from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 focus-visible:ring-red-500 shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 border border-red-800/20',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';