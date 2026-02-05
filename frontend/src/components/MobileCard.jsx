import React from 'react';
import { motion } from 'framer-motion';

/**
 * Mobile-optimized card component untuk menggantikan table rows di mobile
 */
const MobileCard = ({ children, onClick, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md p-4 mb-3 border border-gray-200 active:shadow-lg transition-shadow ${
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
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <span className="text-sm text-gray-900 font-semibold">{value}</span>
    </div>
  );
};

/**
 * Badge component untuk status
 */
export const MobileCardBadge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
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
    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
      {children}
    </div>
  );
};

export default MobileCard;
