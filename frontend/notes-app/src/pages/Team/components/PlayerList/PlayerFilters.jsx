import React from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';

const PlayerFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Suchfeld */}
        <div className="relative">
          <input
            type="text"
            placeholder="Spieler suchen..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Position Filter */}
        <div>
          <select
            value={filters.position}
            onChange={(e) => onFilterChange('position', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Alle Positionen</option>
            <option value="Torwart">Torwart</option>
            <option value="Verteidigung">Verteidigung</option>
            <option value="Mittelfeld">Mittelfeld</option>
            <option value="Sturm">Sturm</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Alle Status</option>
            <option value="available">Verfügbar</option>
            <option value="injured">Verletzt</option>
            <option value="treatment">In Behandlung</option>
          </select>
        </div>

        {/* Sortierung */}
        <div>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Name</option>
            <option value="number">Rückennummer</option>
            <option value="performance">Leistung</option>
            <option value="games">Spieleinsätze</option>
          </select>
        </div>
      </div>

      {/* Aktive Filter Anzeige */}
      <div className="flex flex-wrap gap-2 mt-4">
        {Object.entries(filters).map(([key, value]) => {
          if (value && key !== 'sort') {
            return (
              <span
                key={key}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
              >
                <span>{value}</span>
                <button
                  onClick={() => onFilterChange(key, '')}
                  className="ml-2 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default PlayerFilters;
