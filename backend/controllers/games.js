const Game = require('../models/game.model');

// Spiel erstellen
const createGame = async (req, res) => {
  const { title, date, location } = req.body;

  if (!title || !date || !location) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
  }

  try {
    const newGame = new Game({ title, date, location });
    await newGame.save();
    res.status(201).json({ message: 'Spiel erfolgreich erstellt.', game: newGame });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen des Spiels.', error });
  }
};

// Spiele abrufen
const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Spiele.', error });
  }
};

// Spiel löschen
const deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    await Game.findByIdAndDelete(id);
    res.status(200).json({ message: 'Spiel erfolgreich gelöscht.' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Spiels.', error });
  }
};

module.exports = { createGame, getGames, deleteGame };
