const path = require('path');
const fs = require('fs');
const Player = require('../models/player.model');

// Funktion zum Hochladen eines Profilbilds
const uploadProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prüfen, ob eine Datei hochgeladen wurde
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Keine Datei hochgeladen"
      });
    }
    
    // Spieler finden
    const player = await Player.findById(id);
    
    if (!player) {
      // Lösche die hochgeladene Datei, wenn der Spieler nicht existiert
      fs.unlinkSync(req.file.path);
      
      return res.status(404).json({
        success: false,
        message: "Spieler nicht gefunden"
      });
    }
    
    // Lösche das alte Profilbild, wenn es existiert
    if (player.profileImage) {
      const oldImagePath = path.join(__dirname, '..', player.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Relativer Pfad zum Bild (für die Datenbank)
    const relativePath = '/uploads/profileImages/' + req.file.filename;
    
    // Aktualisiere den Spieler mit dem neuen Profilbildpfad
    player.profileImage = relativePath;
    await player.save();
    
    res.status(200).json({
      success: true,
      message: "Profilbild erfolgreich hochgeladen",
      profileImage: relativePath,
      player: player
    });
  } catch (error) {
    console.error("Fehler beim Hochladen des Profilbilds:", error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Hochladen des Profilbilds",
      error: error.message
    });
  }
};

// Funktion zum Abrufen eines Profilbilds
const getProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Spieler finden
    const player = await Player.findById(id);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Spieler nicht gefunden"
      });
    }
    
    if (!player.profileImage) {
      return res.status(404).json({
        success: false,
        message: "Kein Profilbild für diesen Spieler vorhanden"
      });
    }
    
    const imagePath = path.join(__dirname, '..', player.profileImage);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: "Bilddatei nicht gefunden"
      });
    }
    
    res.sendFile(imagePath);
  } catch (error) {
    console.error("Fehler beim Abrufen des Profilbilds:", error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Abrufen des Profilbilds",
      error: error.message
    });
  }
};

// Funktion zum Löschen eines Profilbilds
const deleteProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Spieler finden
    const player = await Player.findById(id);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Spieler nicht gefunden"
      });
    }
    
    if (!player.profileImage) {
      return res.status(400).json({
        success: false,
        message: "Kein Profilbild zum Löschen vorhanden"
      });
    }
    
    // Lösche die Bilddatei
    const imagePath = path.join(__dirname, '..', player.profileImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // Entferne den Bildpfad vom Spieler
    player.profileImage = '';
    await player.save();
    
    res.status(200).json({
      success: true,
      message: "Profilbild erfolgreich gelöscht",
      player: player
    });
  } catch (error) {
    console.error("Fehler beim Löschen des Profilbilds:", error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Löschen des Profilbilds",
      error: error.message
    });
  }
};

module.exports = {
  uploadProfileImage,
  getProfileImage,
  deleteProfileImage
};
