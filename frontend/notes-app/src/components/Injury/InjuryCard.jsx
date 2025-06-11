import React from 'react';

const InjuryCard = ({ injury }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-medium text-gray-900">{injury.type}</h4>
          <p className="text-sm text-gray-500">{injury.description}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            injury.status === 'Geheilt'
              ? 'bg-green-100 text-green-800'
              : injury.status === 'In Behandlung'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {injury.status}
        </span>
      </div>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Start:</span>
          <span className="text-gray-900">
            {new Date(injury.startDate).toLocaleDateString()}
          </span>
        </div>
        {injury.endDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ende:</span>
            <span className="text-gray-900">
              {new Date(injury.endDate).toLocaleDateString()}
            </span>
          </div>
        )}
        {injury.treatmentPlan && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Behandlungsplan: </span>
            {injury.treatmentPlan}
          </div>
        )}
        {injury.rehabilitationProgress !== undefined && (
          <div>
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Rehabilitationsfortschritt</span>
              <span>{injury.rehabilitationProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${injury.rehabilitationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InjuryCard;
