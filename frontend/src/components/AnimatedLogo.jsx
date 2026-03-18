import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedLogo({
  src = '/img/logo.png',
  alt = 'IWARE',
  size = 34,
  className = '',
}) {
  const px = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: px, height: px }}>
      {/* Glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full blur-xl"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(239,68,68,0.38), transparent 60%), radial-gradient(circle at 70% 70%, rgba(249,115,22,0.30), transparent 62%)',
        }}
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Gradient ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-3px] rounded-full"
        style={{
          background: 'conic-gradient(from 180deg, rgba(239,68,68,0.9), rgba(249,115,22,0.9), rgba(168,85,247,0.75), rgba(239,68,68,0.9))',
          filter: 'blur(0px)',
          opacity: 0.85,
          maskImage: 'radial-gradient(circle, transparent 58%, black 61%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 58%, black 61%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Logo chip */}
      <motion.div
        className="relative z-10 rounded-full border border-white/15 bg-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden flex items-center justify-center"
        style={{ width: px, height: px }}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={src}
          alt={alt}
          className="w-[70%] h-[70%] object-contain"
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Subtle sheen */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
          style={{
            background:
              'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 20%, transparent 42%)',
          }}
          animate={{ x: ['-60%', '140%'] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.4 }}
        />
      </motion.div>
    </div>
  );
}

