import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const GlitchText = ({ text, className = '' }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main text */}
      <motion.span
        className="relative z-10"
        animate={isGlitching ? {
          x: [0, -2, 2, -2, 0],
          y: [0, 2, -2, 2, 0]
        } : {}}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.span>

      {/* Glitch layer 1 - Red */}
      {isGlitching && (
        <motion.span
          className="absolute top-0 left-0 text-red-500 opacity-70 z-0"
          initial={{ x: 0, y: 0 }}
          animate={{ x: -3, y: 1 }}
          transition={{ duration: 0.1 }}
        >
          {text}
        </motion.span>
      )}

      {/* Glitch layer 2 - Blue */}
      {isGlitching && (
        <motion.span
          className="absolute top-0 left-0 text-blue-500 opacity-70 z-0"
          initial={{ x: 0, y: 0 }}
          animate={{ x: 3, y: -1 }}
          transition={{ duration: 0.1 }}
        >
          {text}
        </motion.span>
      )}

      {/* Glitch layer 3 - Green */}
      {isGlitching && (
        <motion.span
          className="absolute top-0 left-0 text-green-500 opacity-50 z-0"
          initial={{ x: 0, y: 0 }}
          animate={{ x: 2, y: 2 }}
          transition={{ duration: 0.1 }}
        >
          {text}
        </motion.span>
      )}
    </div>
  );
};

export default GlitchText;
