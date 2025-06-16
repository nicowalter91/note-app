const Player = require('../models/player.model');

// Funktion zum Hinzufügen eines neuen Spielers
const addPlayer = async (req, res) => {
  try {
    const playerData = req.body;
    const { user } = req.user; // Aus dem Token
    
    // Neuen Spieler erstellen mit userId
    const newPlayer = new Player({
      ...playerData,
      userId: user._id
    });
    
    // Speichern des Spielers in der Datenbank
    const savedPlayer = await newPlayer.save();
    
    res.status(201).json({
      success: true,
      message: "Spieler erfolgreich hinzugefügt",
      player: savedPlayer
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen eines Spielers:", error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Hinzufügen des Spielers",
      error: error.message
    });
  }
};

// Funktion zum Bearbeiten eines bestehenden Spielers
const editPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const playerData = req.body;
    const { user } = req.user; // Aus dem Token
    
    // Aktualisiere den Spieler nur wenn er dem Benutzer gehört
    const updatedPlayer = await Player.findOneAndUpdate(
      { _id: id, userId: user._id },
      playerData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPlayer) {
      return res.status(404).json({
        success: false,
        message: "Spieler nicht gefunden"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Spieler erfolgreich aktualisiert",
      player: updatedPlayer
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren eines Spielers:", error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Aktualisieren des Spielers",
      error: error.message
    });
  }
};

// Funktion zum Abrufen aller Spieler
const getPlayers = async (req, res) => {
  try {
    const { user } = req.user; // Aus dem Token
    
    // Alle Spieler für den angemeldeten Benutzer abrufen
    // Auch Spieler ohne userId (Legacy-Daten) anzeigen
    const players = await Player.find({
      $or: [
        { userId: user._id },
        { userId: { $exists: false } },
        { userId: null }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: players.length,
      players
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Spieler:", error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Abrufen der Spieler",
      error: error.message
    });
  }
};

// Funktion zum Abrufen eines einzelnen Spielers
const getPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.user; // Aus dem Token
    
    // Spieler nach ID abrufen, nur wenn er dem Benutzer gehört
    const player = await Player.findOne({ _id: id, userId: user._id });
    
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Spieler nicht gefunden"
      });
    }
    
    res.status(200).json({
      success: true,
      player
    });
  } catch (error) {
    console.error("Fehler beim Abrufen des Spielers:", error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Abrufen des Spielers",
      error: error.message
    });
  }
};

// Funktion zum Löschen eines Spielers
const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.user; // Aus dem Token
    
    // Spieler löschen, nur wenn er dem Benutzer gehört
    const deletedPlayer = await Player.findOneAndDelete({ _id: id, userId: user._id });
    
    if (!deletedPlayer) {
      return res.status(404).json({
        success: false,
        message: "Spieler nicht gefunden"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Spieler erfolgreich gelöscht"
    });
  } catch (error) {
    console.error("Fehler beim Löschen des Spielers:", error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Löschen des Spielers",
      error: error.message
    });
  }
};

// Export der Funktionen
module.exports = {
  addPlayer,
  editPlayer,
  getPlayers,
  getPlayer,
  deletePlayer
};
