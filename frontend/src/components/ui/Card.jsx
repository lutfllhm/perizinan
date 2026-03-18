import React from 'react';
import { cn } from './cn';

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

