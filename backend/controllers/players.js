const Player = require('../models/player.model');

// Spieler hinzufügen
const addPlayer = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        console.log('Authenticated user:', req.user);
        
        const { name, position, number, birthdate, height, weight, notes, image } = req.body;
        const { user } = req.user;

        // Überprüfen, ob notwendige Daten vorhanden sind
        if (!name) {
            return res.status(400).json({ message: 'Name ist erforderlich' });
        }
        if (!position) {
            return res.status(400).json({ message: 'Position ist erforderlich' });
        }

        // Neuen Spieler erstellen
        const newPlayer = await Player.create({
            name,
            position,
            number,
            birthdate,
            height,
            weight,
            image,
            notes,
            userId: user._id, // Hier fügen wir die userId hinzu
            statistics: {
                goals: 0,
                assists: 0,
                yellowCards: 0,
                redCards: 0,
                matchesPlayed: 0
            },
            performanceMetrics: {
                technicalSkills: 5,
                tacticalUnderstanding: 5,
                physicalFitness: 5,
                mentalStrength: 5,
                teamwork: 5
            }
        });

        return res.status(201).json({
            message: 'Spieler erfolgreich hinzugefügt',
            player: newPlayer
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Interner Serverfehler',
            error: error.message
        });
    }
};

// Spieler bearbeiten
const editPlayer = async (req, res) => {
    try {
        const { playerId } = req.params;
        const { name, position, number, birthdate, height, weight, notes, statistics, image, performanceMetrics } = req.body;

        // Spieler finden
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Spieler nicht gefunden' });
        }

        // Aktualisierung der Spielerdaten
        player.name = name || player.name;
        player.position = position || player.position;
        player.number = number !== undefined ? number : player.number;
        player.birthdate = birthdate || player.birthdate;
        player.height = height !== undefined ? height : player.height;
        player.weight = weight !== undefined ? weight : player.weight;
        player.notes = notes !== undefined ? notes : player.notes;
        player.image = image !== undefined ? image : player.image;
        
        // Aktualisiere Statistiken, falls vorhanden
        if (statistics) {
          player.statistics = {
            ...player.statistics,
            ...statistics
          };
        }
        
        // Aktualisiere Performance-Metriken, falls vorhanden
        if (performanceMetrics) {
          player.performanceMetrics = {
            ...player.performanceMetrics,
            ...performanceMetrics
          };
        }
        
        // Speichern der Änderungen
        await player.save();

        return res.json({
            message: 'Spieler erfolgreich aktualisiert',
            player
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Interner Serverfehler',
            error: error.message
        });
    }
};

// Spieler löschen
const deletePlayer = async (req, res) => {
    try {
        const { playerId } = req.params;

        // Spieler finden und löschen
        const result = await Player.findByIdAndDelete(playerId);

        if (!result) {
            return res.status(404).json({ message: 'Spieler nicht gefunden' });
        }

        return res.json({
            message: 'Spieler erfolgreich gelöscht',
            playerId
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Interner Serverfehler',
            error: error.message
        });
    }
};

// Alle Spieler eines Benutzers abrufen
const getAllPlayers = async (req, res) => {
  try {
    const { user } = req.user;
      // Alle Spieler finden
    const players = await Player.find({})
                                .sort({ name: 1 }); // Sortieren nach Namen aufsteigend
    
    return res.json({ 
      players, 
      count: players.length 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Interner Serverfehler", 
      error: error.message 
    });
  }
};

// Einen bestimmten Spieler abrufen
const getPlayer = async (req, res) => {
  try {
    const { user } = req.user;
    const { playerId } = req.params;

    // Überprüfen, ob ID gültig ist
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: "Ungültige Spieler-ID" });
    }

    // Spieler finden
    const player = await Player.findOne({ 
      _id: playerId, 
      userId: user._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: "Spieler nicht gefunden" });
    }
    
    return res.json({ player });
  } catch (error) {
    return res.status(500).json({ 
      message: "Interner Serverfehler", 
      error: error.message 
    });
  }
};

// Anwesenheit für einen Spieler aktualisieren
const updateAttendance = async (req, res) => {
    try {
        const { playerId } = req.params;
        const { date, status, note } = req.body;

        if (!date || !status) {
            return res.status(400).json({ message: 'Datum und Status sind erforderlich' });
        }

        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Spieler nicht gefunden' });
        }

        const attendanceData = { date, status, note };
        await Player.updateAttendance(playerId, attendanceData);

        return res.status(200).json({ message: 'Anwesenheit erfolgreich aktualisiert' });
    } catch (error) {
        return res.status(500).json({ message: 'Interner Serverfehler', error: error.message });
    }
};

// Stärken und Schwächen aktualisieren
const updateStrengthsAndWeaknesses = async (req, res) => {
  try {
    const { user } = req.user;
    const { playerId } = req.params;
    const { strengths, weaknesses } = req.body;

    // Überprüfen, ob ID gültig ist
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: "Ungültige Spieler-ID" });
    }

    // Spieler finden
    const player = await Player.findOne({ 
      _id: playerId, 
      userId: user._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: "Spieler nicht gefunden" });
    }

    // Stärken und Schwächen aktualisieren
    if (strengths !== undefined) player.strengths = strengths;
    if (weaknesses !== undefined) player.weaknesses = weaknesses;

    // Speichern der Änderungen
    await player.save();

    return res.json({
      message: "Stärken und Schwächen erfolgreich aktualisiert",
      player
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Interner Serverfehler", 
      error: error.message 
    });
  }
};

// Entwicklungsziele hinzufügen
const addDevelopmentGoal = async (req, res) => {
  try {
    const { user } = req.user;
    const { playerId } = req.params;
    const { title, description, startDate, targetDate, status, progress, notes } = req.body;

    // Überprüfen, ob ID gültig ist
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: "Ungültige Spieler-ID" });
    }

    // Überprüfen, ob erforderliche Daten vorhanden sind
    if (!title) {
      return res.status(400).json({ message: "Titel ist erforderlich" });
    }

    // Spieler finden
    const player = await Player.findOne({ 
      _id: playerId, 
      userId: user._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: "Spieler nicht gefunden" });
    }

    // Neues Entwicklungsziel hinzufügen
    player.developmentGoals.push({
      title,
      description: description || "",
      startDate: startDate ? new Date(startDate) : new Date(),
      targetDate: targetDate ? new Date(targetDate) : null,
      status: status || "Offen",
      progress: progress || 0,
      notes: notes || ""
    });

    // Speichern der Änderungen
    await player.save();

    return res.json({
      message: "Entwicklungsziel erfolgreich hinzugefügt",
      player
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Interner Serverfehler", 
      error: error.message 
    });
  }
};

// Entwicklungsziel aktualisieren
const updateDevelopmentGoal = async (req, res) => {
  try {
    const { user } = req.user;
    const { playerId, goalId } = req.params;
    const { title, description, startDate, targetDate, status, progress, notes } = req.body;

    // Überprüfen, ob IDs gültig sind
    if (!mongoose.Types.ObjectId.isValid(playerId) || !mongoose.Types.ObjectId.isValid(goalId)) {
      return res.status(400).json({ message: "Ungültige ID" });
    }

    // Spieler finden
    const player = await Player.findOne({ 
      _id: playerId, 
      userId: user._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: "Spieler nicht gefunden" });
    }

    // Entwicklungsziel finden und aktualisieren
    const goal = player.developmentGoals.id(goalId);
    if (!goal) {
      return res.status(404).json({ message: "Entwicklungsziel nicht gefunden" });
    }

    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (startDate) goal.startDate = new Date(startDate);
    if (targetDate) goal.targetDate = new Date(targetDate);
    if (status) goal.status = status;
    if (progress !== undefined) goal.progress = progress;
    if (notes !== undefined) goal.notes = notes;

    // Speichern der Änderungen
    await player.save();

    return res.json({
      message: "Entwicklungsziel erfolgreich aktualisiert",
      player
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Interner Serverfehler", 
      error: error.message 
    });
  }
};

// Entwicklungsziel löschen
const deleteDevelopmentGoal = async (req, res) => {
  try {
    const { user } = req.user;
    const { playerId, goalId } = req.params;

    // Überprüfen, ob IDs gültig sind
    if (!mongoose.Types.ObjectId.isValid(playerId) || !mongoose.Types.ObjectId.isValid(goalId)) {
      return res.status(400).json({ message: "Ungültige ID" });
    }

    // Spieler finden
    const player = await Player.findOne({ 
      _id: playerId, 
      userId: user._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: "Spieler nicht gefunden" });
    }

    // Entwicklungsziel entfernen
    player.developmentGoals.pull(goalId);

    // Speichern der Änderungen
    await player.save();

    return res.json({
      message: "Entwicklungsziel erfolgreich gelöscht",
      player
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Interner Serverfehler", 
      error: error.message 
    });
  }
};

// Verletzung hinzufügen
const addInjury = async (req, res) => {
  try {
    const { user } = req.user;
    const { playerId } = req.params;
    const { type, description, startDate, endDate, status, treatmentPlan, rehabilitationProgress, notes } = req.body;

    // Überprüfen, ob ID gültig ist
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: "Ungültige Spieler-ID" });
    }

    // Überprüfen, ob erforderliche Daten vorhanden sind
    if (!type || !description) {
      return res.status(400).json({ message: "Verletzungstyp und Beschreibung sind erforderlich" });
    }

    // Spieler finden
    const player = await Player.findOne({ 
      _id: playerId, 
      userId: user._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: "Spieler nicht gefunden" });
    }

    // Neue Verletzung hinzufügen
    player.injuries.push({
      type,
      description,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      status: status || "Akut",
      treatmentPlan: treatmentPlan || "",
      rehabilitationProgress: rehabilitationProgress || 0,
      notes: notes || ""
    });

    // Speichern der Änderungen
    await player.save();

    return res.json({
      message: "Verletzung erfolgreich hinzugefügt",
      player
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Interner Serverfehler", 
      error: error.message 
    });
  }
};

// Verletzung aktualisieren
const updateInjury = async (req, res) => {
  try {
    const { user } = req.user;
    const { playerId, injuryId } = req.params;
    const { type, description, startDate, endDate, status, treatmentPlan, rehabilitationProgress, notes } = req.body;

    // Überprüfen, ob IDs gültig sind
    if (!mongoose.Types.ObjectId.isValid(playerId) || !mongoose.Types.ObjectId.isValid(injuryId)) {
      return res.status(400).json({ message: "Ungültige ID" });
    }

    // Spieler finden
    const player = await Player.findOne({ 
      _id: playerId, 
      userId: user._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: "Spieler nicht gefunden" });
    }

    // Verletzung finden und aktualisieren
    const injury = player.injuries.id(injuryId);
    if (!injury) {
      return res.status(404).json({ message: "Verletzung nicht gefunden" });
    }

    if (type) injury.type = type;
    if (description) injury.description = description;
    if (startDate) injury.startDate = new Date(startDate);
    if (endDate) injury.endDate = new Date(endDate);
    if (status) injury.status = status;
    if (treatmentPlan !== undefined) injury.treatmentPlan = treatmentPlan;
    if (rehabilitationProgress !== undefined) injury.rehabilitationProgress = rehabilitationProgress;
    if (notes !== undefined) injury.notes = notes;

    // Speichern der Änderungen
    await player.save();

    return res.json({
      message: "Verletzung erfolgreich aktualisiert",
      player
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Interner Serverfehler", 
      error: error.message 
    });
  }
};

// Verletzung löschen
const deleteInjury = async (req, res) => {
  try {
    const { user } = req.user;
    const { playerId, injuryId } = req.params;

    // Überprüfen, ob IDs gültig sind
    if (!mongoose.Types.ObjectId.isValid(playerId) || !mongoose.Types.ObjectId.isValid(injuryId)) {
      return res.status(400).json({ message: "Ungültige ID" });
    }

    // Spieler finden
    const player = await Player.findOne({ 
      _id: playerId, 
      userId: user._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: "Spieler nicht gefunden" });
    }

    // Verletzung entfernen
    player.injuries.pull(injuryId);

    // Speichern der Änderungen
    await player.save();

    return res.json({
      message: "Verletzung erfolgreich gelöscht",
      player
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Interner Serverfehler", 
      error: error.message 
    });
  }
};

// Performance-Metriken aktualisieren
const updatePerformanceMetrics = async (req, res) => {
  try {
    const { user } = req.user;
    const { playerId } = req.params;
    const { technicalSkills, tacticalUnderstanding, physicalFitness, mentalStrength, teamwork } = req.body;

    // Überprüfen, ob ID gültig ist
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ message: "Ungültige Spieler-ID" });
    }

    // Spieler finden
    const player = await Player.findOne({ 
      _id: playerId, 
      userId: user._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: "Spieler nicht gefunden" });
    }

    // Performance-Metriken aktualisieren
    if (!player.performanceMetrics) {
      player.performanceMetrics = {};
    }
    
    if (technicalSkills !== undefined) player.performanceMetrics.technicalSkills = technicalSkills;
    if (tacticalUnderstanding !== undefined) player.performanceMetrics.tacticalUnderstanding = tacticalUnderstanding;
    if (physicalFitness !== undefined) player.performanceMetrics.physicalFitness = physicalFitness;
    if (mentalStrength !== undefined) player.performanceMetrics.mentalStrength = mentalStrength;
    if (teamwork !== undefined) player.performanceMetrics.teamwork = teamwork;

    // Speichern der Änderungen
    await player.save();

    return res.json({
      message: "Performance-Metriken erfolgreich aktualisiert",
      player
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Interner Serverfehler", 
      error: error.message 
    });
  }
};

// Profilbild aktualisieren
const updateProfileImage = async (req, res) => {
    try {
        const { playerId } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'Kein Bild hochgeladen' });
        }

        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Spieler nicht gefunden' });
        }

        // Update image path
        player.image = `/uploads/${req.file.filename}`;
        await player.save();

        res.status(200).json({
            message: 'Profilbild erfolgreich aktualisiert',
            player
        });
    } catch (error) {
        console.error('Error in updateProfileImage:', error);
        res.status(500).json({
            message: 'Fehler beim Aktualisieren des Profilbilds',
            error: error.message
        });
    }
};

module.exports = {
  addPlayer,
  editPlayer,
  deletePlayer,
  getAllPlayers,
  getPlayer,
  updateAttendance,
  updateStrengthsAndWeaknesses,
  addDevelopmentGoal,
  updateDevelopmentGoal,
  deleteDevelopmentGoal,
  addInjury,
  updateInjury,
  deleteInjury,
  updatePerformanceMetrics,
  updateProfileImage
};