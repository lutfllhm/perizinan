import { motion } from 'framer-motion';

const MorphingBlob = ({ color = 'blue', size = 400, position = 'top-left' }) => {
  const positions = {
    'top-left': 'top-20 left-20',
    'top-right': 'top-20 right-20',
    'bottom-left': 'bottom-20 left-20',
    'bottom-right': 'bottom-20 right-20',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  const colors = {
    blue: 'bg-blue-500/30',
    purple: 'bg-purple-500/30',
    pink: 'bg-pink-500/30',
    cyan: 'bg-cyan-500/30'
  };

  return (
    <motion.div
      className={`absolute ${positions[position]} ${colors[color]} blur-3xl rounded-full pointer-events-none`}
      style={{
        width: size,
        height: size
      }}
      animate={{
        scale: [1, 1.2, 0.8, 1.1, 1],
        rotate: [0, 90, 180, 270, 360],
        borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", 
                       "70% 30% 30% 70% / 70% 70% 30% 30%",
                       "50% 50% 50% 50% / 50% 50% 50% 50%",
                       "30% 70% 70% 30% / 70% 30% 30% 70%",
                       "30% 70% 70% 30% / 30% 30% 70% 70%"]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export default MorphingBlob;
