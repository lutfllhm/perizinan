import React from 'react';
import { cn } from './cn';

export default function Input({ className, leftIcon: LeftIcon, right, ...props }) {
  return (
    <div className={cn('relative', className)}>
      {LeftIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <LeftIcon className="h-4 w-4" />
        </div>
      )}
      <input
        className={cn(
          'h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-500',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl',
          'transition-all duration-200',
          'focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20 focus:outline-none',
          LeftIcon ? 'pl-10' : '',
          right ? 'pr-10' : ''
        )}
        {...props}
      />
      {right && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{right}</div>}
    </div>
  );
}

