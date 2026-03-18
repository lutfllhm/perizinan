import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNavigation = ({ items, variant = 'light' }) => {
  const location = useLocation();

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const styles =
    variant === 'dark'
      ? {
          wrap:
            'md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/55 backdrop-blur-2xl border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.45)]',
          active: 'text-white',
          inactive: 'text-slate-400',
          indicator: 'bg-violet-300',
        }
      : {
          wrap: 'md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40',
          active: 'text-blue-600',
          inactive: 'text-gray-500',
          indicator: 'bg-blue-600',
        };

  return (
    <div className={styles.wrap}>
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex-1 flex flex-col items-center justify-center h-full relative"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center ${
                  active ? styles.active : styles.inactive
                }`}
              >
                <Icon size={22} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </motion.div>

              {/* Active Indicator */}
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 ${styles.indicator} rounded-b-full`}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
