import React, { useState } from 'react';
import { FaUser, FaRunning, FaMedal, FaChartLine, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const PlayerCard = ({ player, onView, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
          {player.image ? (
            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <FaUser className="text-gray-400 text-2xl" />
          )}
        </div>

        {/* Spieler Informationen */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{player.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-600">{player.position}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded-full">
                  #{player.number || '-'}
                </span>
              </div>
            </div>
            
            {/* Status Badge */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()} flex-shrink-0`}>
              {getStatusText()}
            </span>
          </div>

          {/* Performance Indikatoren */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex items-center space-x-1">
              <FaRunning className="text-blue-500 flex-shrink-0" size={14} />
              <span className="text-sm text-gray-600 truncate">{player.statistics?.gamesPlayed || 0} Spiele</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaMedal className="text-blue-500 flex-shrink-0" size={14} />
              <span className="text-sm text-gray-600 truncate">{player.statistics?.goals || 0} Tore</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaChartLine className="text-blue-500 flex-shrink-0" size={14} />
              <span className="text-sm text-gray-600 truncate">{player.performanceMetrics?.technicalSkills || 0}/10</span>
            </div>
          </div>
        </div>
      </div>      {/* Aktions-Buttons */}
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
        <button
          onClick={() => onView(player)}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="Details anzeigen"
        >
          <FaEye size={14} />
          <span className="hidden sm:inline">Details</span>
        </button>
        <button
          onClick={() => onEdit(player)}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
          title="Spieler bearbeiten"
        >
          <FaEdit size={14} />
          <span className="hidden sm:inline">Bearbeiten</span>
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Spieler löschen"
        >
          <FaTrash size={14} />
          <span className="hidden sm:inline">Löschen</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Spieler löschen
            </h3>
            <p className="text-gray-600 mb-6">
              Möchten Sie {player.name} wirklich aus dem Team entfernen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  onDelete(player);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
