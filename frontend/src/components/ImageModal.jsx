import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZoomIn, FiZoomOut, FiDownload } from 'react-icons/fi';

const ImageModal = ({ src, alt, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative max-w-7xl max-h-[90vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoom(Math.min(zoom + 0.25, 3))}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
              title="Zoom In"
            >
              <FiZoomIn className="text-gray-800" size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoom(Math.max(zoom - 0.25, 0.5))}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
              title="Zoom Out"
            >
              <FiZoomOut className="text-gray-800" size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
              title="Download"
            >
              <FiDownload className="text-gray-800" size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-3 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition"
              title="Close"
            >
              <FiX className="text-white" size={20} />
            </motion.button>
          </div>

          {/* Image Container */}
          <div className="flex items-center justify-center overflow-auto max-h-[90vh]">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
              </div>
            )}
            <motion.img
              src={src}
              alt={alt}
              style={{ transform: `scale(${zoom})` }}
              className="max-w-full h-auto rounded-lg shadow-2xl transition-transform duration-300"
              onLoad={() => setLoading(false)}
              onError={(e) => {
                setLoading(false);
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGambar tidak dapat dimuat%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* Zoom Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm font-semibold text-gray-800">{Math.round(zoom * 100)}%</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
