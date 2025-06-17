const ClubSettings = require('../models/clubSettings.model');

// Get club settings
const getClubSettings = async (req, res) => {
  try {
    const { user } = req.user;
    
    let settings = await ClubSettings.findOne({ userId: user._id });
    
    // Wenn keine Einstellungen existieren, Standard-Einstellungen erstellen
    if (!settings) {
      settings = new ClubSettings({
        userId: user._id,
        name: `${user.fullName}'s Team`,
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981'
      });
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Vereinseinstellungen:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Vereinseinstellungen',
      error: error.message
    });
  }
};

// Update club settings
const updateClubSettings = async (req, res) => {
  try {
    const { user } = req.user;
    const updateData = req.body;
    
    // Validierung der Farben (hex format)
    if (updateData.primaryColor && !/^#[0-9A-F]{6}$/i.test(updateData.primaryColor)) {
      return res.status(400).json({
        success: false,
        message: 'Ungültiges Primärfarben-Format'
      });
    }
    
    if (updateData.secondaryColor && !/^#[0-9A-F]{6}$/i.test(updateData.secondaryColor)) {
      return res.status(400).json({
        success: false,
        message: 'Ungültiges Sekundärfarben-Format'
      });
    }
    
    // Gründungsjahr validieren
    if (updateData.founded) {
      const currentYear = new Date().getFullYear();
      if (updateData.founded < 1800 || updateData.founded > currentYear) {
        return res.status(400).json({
          success: false,
          message: 'Ungültiges Gründungsjahr'
        });
      }
    }
    
    const settings = await ClubSettings.findOneAndUpdate(
      { userId: user._id },
      updateData,
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Vereinseinstellungen erfolgreich aktualisiert',
      settings
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Vereinseinstellungen:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Aktualisieren der Vereinseinstellungen',
      error: error.message
    });
  }
};

// Upload club logo
const uploadClubLogo = async (req, res) => {
  try {
    const { user } = req.user;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Keine Datei hochgeladen'
      });
    }
    
    // Hier würde normalerweise das Bild verarbeitet und gespeichert werden
    // Für jetzt nehmen wir an, dass das Bild bereits verarbeitet wurde
    const logoUrl = `/uploads/logos/${req.file.filename}`;
    
    const settings = await ClubSettings.findOneAndUpdate(
      { userId: user._id },
      { logo: logoUrl },
      { 
        new: true, 
        upsert: true 
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Logo erfolgreich hochgeladen',
      logoUrl,
      settings
    });
  } catch (error) {
    console.error('Fehler beim Hochladen des Logos:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Hochladen des Logos',
      error: error.message
    });
  }
};

module.exports = {
  getClubSettings,
  updateClubSettings,
  uploadClubLogo
};
