const Player = require('../models/player.model');

// Spieler erstellen
const createPlayer = async (req, res) => {
  const { name, position } = req.body;

  if (!name || !position) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
  }

  try {
    const newPlayer = new Player({ name, position });
    await newPlayer.save();
    res.status(201).json({ message: 'Spieler erfolgreich erstellt.', player: newPlayer });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen des Spielers.', error });
  }
};

// Spieler abrufen
const getPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Spieler.', error });
  }
};

// Spieler löschen
const deletePlayer = async (req, res) => {
  const { id } = req.params;

  try {
    await Player.findByIdAndDelete(id);
    res.status(200).json({ message: 'Spieler erfolgreich gelöscht.' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Spielers.', error });
  }
};

module.exports = { createPlayer, getPlayers, deletePlayer };
