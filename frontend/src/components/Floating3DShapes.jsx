import { motion } from 'framer-motion';
import { useMemo } from 'react';

const Floating3DShapes = ({ count = 10 }) => {
  const shapes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 40,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      rotateSpeed: Math.random() * 360 + 180,
      type: ['cube', 'sphere', 'pyramid'][Math.floor(Math.random() * 3)],
      color: ['blue', 'purple', 'pink', 'cyan'][Math.floor(Math.random() * 4)]
    }));
  }, [count]);

  const getShapeGradient = (color) => {
    const gradients = {
      blue: 'from-blue-400/20 to-blue-600/10',
      purple: 'from-purple-400/20 to-purple-600/10',
      pink: 'from-pink-400/20 to-pink-600/10',
      cyan: 'from-cyan-400/20 to-cyan-600/10'
    };
    return gradients[color];
  };

  const renderShape = (shape) => {
    switch (shape.type) {
      case 'cube':
        return (
          <div 
            className={`w-full h-full bg-gradient-to-br ${getShapeGradient(shape.color)} backdrop-blur-sm border border-white/10 rounded-lg`}
            style={{
              transform: 'rotateX(45deg) rotateY(45deg)',
              transformStyle: 'preserve-3d'
            }}
          />
        );
      case 'sphere':
        return (
          <div 
            className={`w-full h-full bg-gradient-to-br ${getShapeGradient(shape.color)} backdrop-blur-sm border border-white/10 rounded-full`}
          />
        );
      case 'pyramid':
        return (
          <div 
            className={`w-full h-full bg-gradient-to-br ${getShapeGradient(shape.color)} backdrop-blur-sm border border-white/10`}
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotateX(20deg)'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
            perspective: 1000
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            rotateZ: [0, shape.rotateSpeed, 0],
            rotateX: [0, 360, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut"
          }}
        >
          {renderShape(shape)}
        </motion.div>
      ))}
    </div>
  );
};

export default Floating3DShapes;
