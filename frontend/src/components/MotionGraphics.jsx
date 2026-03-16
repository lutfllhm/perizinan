import { motion } from 'framer-motion';

const MotionGraphics = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated Lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Animated Path 1 */}
        <motion.path
          d="M 0 100 Q 250 50 500 100 T 1000 100"
          stroke="url(#lineGradient1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 1 }
          }}
        />

        {/* Animated Path 2 */}
        <motion.path
          d="M 1920 200 Q 1500 150 1000 200 T 0 200"
          stroke="url(#lineGradient2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
            opacity: { duration: 1, delay: 1.5 }
          }}
        />

        {/* Animated Circles */}
        {[...Array(5)].map((_, i) => (
          <motion.circle
            key={i}
            cx={200 + i * 300}
            cy={300 + Math.sin(i) * 100}
            r="3"
            fill="#3b82f6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4
            }}
          />
        ))}
      </svg>

      {/* Geometric Patterns */}
      <div className="absolute top-20 right-20">
        <motion.div
          className="w-32 h-32 border-2 border-blue-500/20 rounded-lg"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="absolute bottom-40 left-20">
        <motion.div
          className="w-24 h-24 border-2 border-purple-500/20"
          style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
          animate={{
            rotate: [0, -360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating Dots Grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-4 p-8">
        {[...Array(96)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-blue-400/20 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.05
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MotionGraphics;
