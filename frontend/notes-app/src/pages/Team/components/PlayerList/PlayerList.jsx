import React, { useState } from 'react';
import PlayerCard from './PlayerCard';
import PlayerFilters from './PlayerFilters';
import { FaPlus } from 'react-icons/fa';

const PlayerList = ({ players, onAddPlayer, onViewPlayer, onEditPlayer }) => {
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
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map(player => (
          <PlayerCard
            key={player._id}
            player={player}
            onView={onViewPlayer}
            onEdit={onEditPlayer}
          />
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Keine Spieler gefunden</p>
        </div>
      )}
    </div>
  );
};

export default PlayerList;
