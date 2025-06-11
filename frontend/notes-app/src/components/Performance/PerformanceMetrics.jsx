import React from 'react';

const PerformanceMetrics = ({ metrics }) => {
  return (
    <div className="space-y-4">
      {Object.entries(metrics || {}).map(([key, value]) => (
        <div key={key}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </span>
            <span className="text-sm text-gray-700">{value}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(value || 0) * 10}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceMetrics;
