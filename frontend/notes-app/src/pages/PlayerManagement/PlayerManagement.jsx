import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState({ name: '', position: '' });

  const handleAddPlayer = () => {
    setPlayers([...players, newPlayer]);
    setNewPlayer({ name: '', position: '' });
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Spielerverwaltung</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Neuen Spieler hinzufügen</h2>
          <input
            type="text"
            placeholder="Name"
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          />
          <input
            type="text"
            placeholder="Position"
            value={newPlayer.position}
            onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          />
          <button
            onClick={handleAddPlayer}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Spieler hinzufügen
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700">Spielerliste</h2>
          <ul className="mt-4">
            {players.map((player, index) => (
              <li key={index} className="bg-white shadow-md rounded-md p-4 mb-2">
                <p className="text-gray-800 font-medium">{player.name}</p>
                <p className="text-gray-600">Position: {player.position}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PlayerManagement;
