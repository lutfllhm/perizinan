import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

/**
 * Swipeable Card Component
 * Untuk delete/archive dengan swipe gesture
 */
const SwipeableCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  leftAction = { icon: '🗑️', color: 'bg-red-500', label: 'Hapus' },
  rightAction = { icon: '✓', color: 'bg-green-500', label: 'Setuju' },
  threshold = 100 
}) => {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const leftBg = useTransform(x, [-threshold, 0], [1, 0]);
  const rightBg = useTransform(x, [0, threshold], [0, 1]);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    
    if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
    } else if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
    }
  };

  // Simplified drag configuration
  const dragTransition = { duration: 0.2, ease: "easeOut" };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Left Action Background */}
      {onSwipeLeft && (
        <motion.div
          style={{ opacity: leftBg }}
          className={`absolute inset-0 ${leftAction.color} flex items-center justify-end px-6`}
        >
          <div className="text-white text-center">
            <div className="text-3xl mb-1">{leftAction.icon}</div>
            <div className="text-sm font-semibold">{leftAction.label}</div>
          </div>
        </motion.div>
      )}

      {/* Right Action Background */}
      {onSwipeRight && (
        <motion.div
          style={{ opacity: rightBg }}
          className={`absolute inset-0 ${rightAction.color} flex items-center justify-start px-6`}
        >
          <div className="text-white text-center">
            <div className="text-3xl mb-1">{rightAction.icon}</div>
            <div className="text-sm font-semibold">{rightAction.label}</div>
          </div>
        </motion.div>
      )}

      {/* Card Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        dragTransition={dragTransition}
        style={{ x }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className={`relative bg-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SwipeableCard;
