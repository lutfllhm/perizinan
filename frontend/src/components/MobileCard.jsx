import React from 'react';
import { motion } from 'framer-motion';

/**
 * Mobile-optimized card component untuk menggantikan table rows di mobile
 */
const MobileCard = ({ children, onClick, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`rounded-2xl p-4 mb-3 border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] active:shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * Row component untuk MobileCard
 */
export const MobileCardRow = ({ label, value, className = '' }) => {
  return (
    <div className={`flex justify-between items-center py-2 ${className}`}>
      <span className="text-sm text-slate-300 font-medium">{label}</span>
      <span className="text-sm text-white font-semibold">{value}</span>
    </div>
  );
};

/**
 * Badge component untuk status
 */
export const MobileCardBadge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-white/10 text-slate-200 border border-white/10',
    success: 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/20',
    warning: 'bg-amber-500/15 text-amber-200 border border-amber-400/20',
    danger: 'bg-rose-500/15 text-rose-200 border border-rose-400/20',
    info: 'bg-sky-500/15 text-sky-200 border border-sky-400/20',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};

/**
 * Actions component untuk buttons
 */
export const MobileCardActions = ({ children }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
      {children}
    </div>
  );
};

export default MobileCard;
