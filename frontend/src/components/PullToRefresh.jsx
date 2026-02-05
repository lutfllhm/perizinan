import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

/**
 * Pull to Refresh Component
 * Native-like pull to refresh untuk mobile
 */
const PullToRefresh = ({ onRefresh, children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 80], [0, 1]);
  const rotate = useTransform(y, [0, 80], [0, 360]);

  const handleDragEnd = async (event, info) => {
    if (info.offset.y > 80 && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  return (
    <div className="relative">
      {/* Pull Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute top-0 left-0 right-0 flex justify-center py-4 pointer-events-none"
      >
        <motion.div
          style={{ rotate }}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          <FiRefreshCw size={24} />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        style={{ y }}
        onDragEnd={handleDragEnd}
        className={isRefreshing ? 'pointer-events-none' : ''}
      >
        {children}
      </motion.div>

      {/* Refreshing Overlay */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 flex justify-center py-4">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <FiRefreshCw size={20} />
            </motion.div>
            <span className="text-sm font-semibold">Memuat ulang...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PullToRefresh;
