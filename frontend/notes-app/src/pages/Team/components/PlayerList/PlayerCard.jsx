import React from 'react';
import { FaUser, FaRunning, FaMedal, FaChartLine } from 'react-icons/fa';

const PlayerCard = ({ player, onView, onEdit }) => {
  const getStatusColor = () => {
    if (player.injuries?.some(i => i.status === 'Akut')) return 'bg-red-100 text-red-800';
    if (player.injuries?.some(i => i.status === 'In Behandlung')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = () => {
    if (player.injuries?.some(i => i.status === 'Akut')) return 'Verletzt';
    if (player.injuries?.some(i => i.status === 'In Behandlung')) return 'In Behandlung';
    return 'Verfügbar';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Spieler Avatar/Bild */}
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {player.image ? (
            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <FaUser className="text-gray-400 text-2xl" />
          )}
        </div>

        {/* Spieler Informationen */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{player.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-600">{player.position}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded-full">
                  #{player.number || '-'}
                </span>
              </div>
            </div>
            
            {/* Status Badge */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Performance Indikatoren */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex items-center space-x-1">
              <FaRunning className="text-blue-500" />
              <span className="text-sm text-gray-600">{player.statistics?.gamesPlayed || 0} Spiele</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaMedal className="text-blue-500" />
              <span className="text-sm text-gray-600">{player.statistics?.goals || 0} Tore</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaChartLine className="text-blue-500" />
              <span className="text-sm text-gray-600">{player.performanceMetrics?.technicalSkills || 0}/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aktions-Buttons */}
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
        <button
          onClick={() => onView(player)}
          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          Details
        </button>
        <button
          onClick={() => onEdit(player)}
          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
        >
          Bearbeiten
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
