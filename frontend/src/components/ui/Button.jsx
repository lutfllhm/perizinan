import React, { useCallback, useRef } from 'react';
import { cn } from './cn';

function createRipple(container, event) {
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = (event?.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
  const y = (event?.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

  const span = document.createElement('span');
  span.style.position = 'absolute';
  span.style.left = `${x}px`;
  span.style.top = `${y}px`;
  span.style.width = `${size}px`;
  span.style.height = `${size}px`;
  span.style.borderRadius = '9999px';
  span.style.background = 'rgba(255,255,255,0.35)';
  span.style.transform = 'scale(0)';
  span.style.opacity = '0.9';
  span.style.pointerEvents = 'none';
  span.style.transition = 'transform 500ms ease, opacity 700ms ease';
  span.style.mixBlendMode = 'overlay';

  container.appendChild(span);
  requestAnimationFrame(() => {
    span.style.transform = 'scale(1)';
    span.style.opacity = '0';
  });
  window.setTimeout(() => {
    span.remove();
  }, 750);
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  onClick,
  ...props
}) {
  const ref = useRef(null);

  const handleClick = useCallback(
    (e) => {
      if (!disabled) createRipple(ref.current, e);
      onClick?.(e);
    },
    [disabled, onClick]
  );

  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.25)] hover:brightness-110',
    secondary:
      'bg-white/10 text-white border border-white/15 hover:bg-white/15 hover:border-white/25',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    danger:
      'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_10px_30px_rgba(244,63,94,0.18)] hover:brightness-110',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm rounded-xl',
    md: 'h-11 px-4 text-sm rounded-xl',
    lg: 'h-12 px-5 text-base rounded-2xl',
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

