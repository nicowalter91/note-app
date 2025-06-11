import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';

const Games = () => {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({ title: '', date: '', location: '' });

  const handleAddGame = () => {
    setGames([...games, newGame]);
    setNewGame({ title: '', date: '', location: '' });
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Spiele und Events</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Neues Spiel hinzufügen</h2>
          <input
            type="text"
            placeholder="Titel"
            value={newGame.title}
            onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          />
          <input
            type="date"
            value={newGame.date}
            onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          />
          <input
            type="text"
            placeholder="Ort"
            value={newGame.location}
            onChange={(e) => setNewGame({ ...newGame, location: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          />
          <button
            onClick={handleAddGame}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Spiel hinzufügen
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700">Spieleliste</h2>
          <ul className="mt-4">
            {games.map((game, index) => (
              <li key={index} className="bg-white shadow-md rounded-md p-4 mb-2">
                <p className="text-gray-800 font-medium">{game.title}</p>
                <p className="text-gray-600">Datum: {game.date}</p>
                <p className="text-gray-600">Ort: {game.location}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Games;
