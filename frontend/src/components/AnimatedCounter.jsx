import { motion, useMotionValue, useTransform, animate, useMotionValueEvent } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedCounter = ({ value, duration = 2, suffix = '' }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(() => Math.round(value ?? 0));

  useEffect(() => {
    const controls = animate(count, value, { duration });
    return controls.stop;
  }, [count, value, duration]);

  useMotionValueEvent(rounded, 'change', (latest) => {
    setDisplayValue(latest);
  });

  return (
    <motion.span>
      {displayValue}
      {suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
