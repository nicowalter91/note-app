import React from 'react';

const StatisticsCard = ({ title, value, icon: Icon, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsCard;
