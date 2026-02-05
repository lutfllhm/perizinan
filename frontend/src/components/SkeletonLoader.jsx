import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden"
  >
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="bg-gray-200 h-12 w-12 rounded-xl"></div>
        <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="bg-gray-200 h-4 w-24 rounded"></div>
        <div className="bg-gray-200 h-10 w-16 rounded"></div>
      </div>
      <div className="bg-gray-200 h-4 w-32 rounded"></div>
    </div>
  </motion.div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {[...Array(6)].map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="bg-gray-200 h-4 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(6)].map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="bg-gray-200 h-4 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SkeletonForm = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white p-8 rounded-xl shadow-lg"
  >
    <div className="animate-pulse space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="bg-gray-200 h-4 w-24 rounded mb-2"></div>
          <div className="bg-gray-200 h-12 w-full rounded-lg"></div>
        </div>
      ))}
      <div className="bg-gray-200 h-12 w-full rounded-lg"></div>
    </div>
  </motion.div>
);

const SkeletonComponents = { SkeletonCard, SkeletonTable, SkeletonForm };
export default SkeletonComponents;
