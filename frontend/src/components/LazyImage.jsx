import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiImage } from 'react-icons/fi';

const LazyImage = ({ src, alt, className, onClick, thumbnail = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Skeleton Loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer">
          <div className="flex items-center justify-center h-full">
            <FiImage className="text-gray-400 text-4xl" />
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center p-4">
            <FiImage className="text-gray-400 text-4xl mx-auto mb-2" />
            <p className="text-sm text-gray-500">Gambar tidak dapat dimuat</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          onClick={onClick}
          loading="lazy"
        />
      )}

      {/* Hover Overlay for Thumbnails */}
      {thumbnail && isLoaded && !hasError && onClick && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
          onClick={onClick}
        >
          <div className="text-white text-center">
            <FiImage className="text-3xl mx-auto mb-2" />
            <p className="text-sm font-semibold">Klik untuk memperbesar</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LazyImage;
