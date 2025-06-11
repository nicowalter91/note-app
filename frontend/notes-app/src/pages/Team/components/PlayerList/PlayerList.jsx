import React, { useState } from 'react';
import PlayerCard from './PlayerCard';
import PlayerFilters from './PlayerFilters';
import { FaPlus } from 'react-icons/fa';

const PlayerList = ({ players, onAddPlayer, onViewPlayer, onEditPlayer, onDeletePlayer }) => {
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    status: '',
    sort: 'name'
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filterPlayers = () => {
    return players
      .filter(player => {
        const matchesSearch = !filters.search || 
          player.name.toLowerCase().includes(filters.search.toLowerCase());
        
        const matchesPosition = !filters.position || 
          player.position === filters.position;
        
        const matchesStatus = !filters.status || 
          (filters.status === 'injured' && player.injuries?.some(i => i.status === 'Akut')) ||
          (filters.status === 'treatment' && player.injuries?.some(i => i.status === 'In Behandlung')) ||
          (filters.status === 'available' && (!player.injuries || player.injuries.every(i => i.status === 'Geheilt')));

        return matchesSearch && matchesPosition && matchesStatus;
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'number':
            return (a.number || 99) - (b.number || 99);
          case 'performance':
            return (b.performanceMetrics?.technicalSkills || 0) - (a.performanceMetrics?.technicalSkills || 0);
          case 'games':
            return (b.statistics?.gamesPlayed || 0) - (a.statistics?.gamesPlayed || 0);
          default:
            return a.name.localeCompare(b.name);
        }
      });
  };

  const filteredPlayers = filterPlayers();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Spielerkader</h2>
        <button
          onClick={onAddPlayer}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Spieler hinzufügen
        </button>
      </div>

      <PlayerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map(player => (
          <PlayerCard
            key={player._id}
            player={player}
            onView={onViewPlayer}
            onEdit={onEditPlayer}
            onDelete={onDeletePlayer}
          />
        ))}
      </div>{filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {players.length === 0 ? 'Noch keine Spieler vorhanden' : 'Keine Spieler gefunden'}
          </h3>
          <p className="text-gray-500 mb-6">
            {players.length === 0 
              ? 'Fügen Sie Ihren ersten Spieler hinzu, um zu beginnen.'
              : 'Versuchen Sie, Ihre Suchkriterien anzupassen.'
            }
          </p>
          {players.length === 0 && (
            <button
              onClick={onAddPlayer}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Ersten Spieler hinzufügen
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerList;
