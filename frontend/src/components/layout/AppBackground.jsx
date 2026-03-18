import React from 'react';

export default function AppBackground({ children, variant = 'default' }) {
  const variants = {
    default:
      'bg-[radial-gradient(1200px_circle_at_10%_10%,rgba(99,102,241,0.25),transparent_55%),radial-gradient(900px_circle_at_90%_20%,rgba(236,72,153,0.18),transparent_55%),radial-gradient(900px_circle_at_50%_90%,rgba(14,165,233,0.12),transparent_60%)]',
    auth:
      'bg-[radial-gradient(1200px_circle_at_0%_0%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(168,85,247,0.25),transparent_55%),radial-gradient(900px_circle_at_30%_95%,rgba(6,182,212,0.12),transparent_60%)]',
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
      <div className={`fixed inset-0 ${variants[variant] || variants.default}`} />
      <div
        className="fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/55 to-slate-950" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

