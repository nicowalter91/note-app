import React from 'react';

const DevelopmentGoal = ({ goal, onProgressUpdate }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
          <p className="text-sm text-gray-500">{goal.description}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            goal.status === 'Abgeschlossen'
              ? 'bg-green-100 text-green-800'
              : goal.status === 'In Bearbeitung'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {goal.status}
        </span>
      </div>
      <div className="mt-2">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Fortschritt</span>
          <span>{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>
      {goal.targetDate && (
        <div className="mt-2 text-sm text-gray-500">
          Zieldatum: {new Date(goal.targetDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default DevelopmentGoal;
