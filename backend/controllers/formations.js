const Formation = require("../models/formation.model");
const Player = require("../models/player.model");
const Event = require("../models/event.model");

// Predefined formation templates
const formationTemplates = {
  '4-4-2': {
    name: '4-4-2 Standard',
    description: 'Klassische Formation mit zwei Stürmern',
    style: 'balanced',
    positions: [
      { id: 'gk', name: 'TW', x: 50, y: 90, color: 'yellow' },
      { id: 'lb', name: 'LV', x: 20, y: 70, color: 'blue' },
      { id: 'cb1', name: 'IV', x: 35, y: 75, color: 'blue' },
      { id: 'cb2', name: 'IV', x: 65, y: 75, color: 'blue' },
      { id: 'rb', name: 'RV', x: 80, y: 70, color: 'blue' },
      { id: 'lm', name: 'LM', x: 20, y: 45, color: 'green' },
      { id: 'cm1', name: 'ZM', x: 35, y: 40, color: 'green' },
      { id: 'cm2', name: 'ZM', x: 65, y: 40, color: 'green' },
      { id: 'rm', name: 'RM', x: 80, y: 45, color: 'green' },
      { id: 'st1', name: 'ST', x: 40, y: 20, color: 'red' },
      { id: 'st2', name: 'ST', x: 60, y: 20, color: 'red' }
    ]
  },
  '4-3-3': {
    name: '4-3-3 Offensiv',
    description: 'Offensive Formation mit drei Stürmern',
    style: 'offensive',
    positions: [
      { id: 'gk', name: 'TW', x: 50, y: 90, color: 'yellow' },
      { id: 'lb', name: 'LV', x: 20, y: 70, color: 'blue' },
      { id: 'cb1', name: 'IV', x: 35, y: 75, color: 'blue' },
      { id: 'cb2', name: 'IV', x: 65, y: 75, color: 'blue' },
      { id: 'rb', name: 'RV', x: 80, y: 70, color: 'blue' },
      { id: 'dm', name: 'DM', x: 50, y: 55, color: 'green' },
      { id: 'cm1', name: 'ZM', x: 35, y: 40, color: 'green' },
      { id: 'cm2', name: 'ZM', x: 65, y: 40, color: 'green' },
      { id: 'lw', name: 'LF', x: 20, y: 20, color: 'red' },
      { id: 'st', name: 'ST', x: 50, y: 15, color: 'red' },
      { id: 'rw', name: 'RF', x: 80, y: 20, color: 'red' }
    ]
  },
  '3-5-2': {
    name: '3-5-2 Mittelfeld',
    description: 'Starkes Mittelfeld mit drei Innenverteidigern',
    style: 'balanced',
    positions: [
      { id: 'gk', name: 'TW', x: 50, y: 90, color: 'yellow' },
      { id: 'cb1', name: 'IV', x: 30, y: 75, color: 'blue' },
      { id: 'cb2', name: 'IV', x: 50, y: 80, color: 'blue' },
      { id: 'cb3', name: 'IV', x: 70, y: 75, color: 'blue' },
      { id: 'lwb', name: 'LWB', x: 10, y: 50, color: 'green' },
      { id: 'cm1', name: 'ZM', x: 30, y: 45, color: 'green' },
      { id: 'cm2', name: 'ZM', x: 50, y: 40, color: 'green' },
      { id: 'cm3', name: 'ZM', x: 70, y: 45, color: 'green' },
      { id: 'rwb', name: 'RWB', x: 90, y: 50, color: 'green' },
      { id: 'st1', name: 'ST', x: 40, y: 20, color: 'red' },
      { id: 'st2', name: 'ST', x: 60, y: 20, color: 'red' }
    ]
  },
  '5-3-2': {
    name: '5-3-2 Defensiv',
    description: 'Defensive Formation mit fünf Verteidigern',
    style: 'defensive',
    positions: [
      { id: 'gk', name: 'TW', x: 50, y: 90, color: 'yellow' },
      { id: 'lb', name: 'LV', x: 15, y: 70, color: 'blue' },
      { id: 'cb1', name: 'IV', x: 30, y: 75, color: 'blue' },
      { id: 'cb2', name: 'IV', x: 50, y: 80, color: 'blue' },
      { id: 'cb3', name: 'IV', x: 70, y: 75, color: 'blue' },
      { id: 'rb', name: 'RV', x: 85, y: 70, color: 'blue' },
      { id: 'cm1', name: 'ZM', x: 35, y: 45, color: 'green' },
      { id: 'cm2', name: 'ZM', x: 50, y: 40, color: 'green' },
      { id: 'cm3', name: 'ZM', x: 65, y: 45, color: 'green' },
      { id: 'st1', name: 'ST', x: 40, y: 25, color: 'red' },
      { id: 'st2', name: 'ST', x: 60, y: 25, color: 'red' }
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1 Flexibel',
    description: 'Moderne flexible Formation',
    style: 'balanced',
    positions: [
      { id: 'gk', name: 'TW', x: 50, y: 90, color: 'yellow' },
      { id: 'lb', name: 'LV', x: 20, y: 70, color: 'blue' },
      { id: 'cb1', name: 'IV', x: 35, y: 75, color: 'blue' },
      { id: 'cb2', name: 'IV', x: 65, y: 75, color: 'blue' },
      { id: 'rb', name: 'RV', x: 80, y: 70, color: 'blue' },
      { id: 'dm1', name: 'DM', x: 40, y: 55, color: 'green' },
      { id: 'dm2', name: 'DM', x: 60, y: 55, color: 'green' },
      { id: 'lam', name: 'LAM', x: 25, y: 35, color: 'green' },
      { id: 'cam', name: 'ZAM', x: 50, y: 30, color: 'green' },
      { id: 'ram', name: 'RAM', x: 75, y: 35, color: 'green' },
      { id: 'st', name: 'ST', x: 50, y: 15, color: 'red' }
    ]
  }
};

// Add a new formation
const addFormation = async (req, res) => {
  const { 
    name, 
    formation, 
    description,
    positions,
    style,
    instructions,
    analysis
  } = req.body;
  
  const { user } = req.user;

  if (!name) {
    return res.status(400).json({ error: true, message: "Name ist erforderlich" });
  }

  if (!formation) {
    return res.status(400).json({ error: true, message: "Formation ist erforderlich" });
  }

  if (!positions || !Array.isArray(positions) || positions.length === 0) {
    return res.status(400).json({ error: true, message: "Positionen sind erforderlich" });
  }

  try {
    const newFormation = new Formation({
      name,
      formation,
      description: description || "",
      positions: positions.map(pos => ({
        ...pos,
        playerId: pos.playerId || null,
        playerName: pos.playerName || ""
      })),
      style: style || "balanced",
      instructions: instructions || {},
      analysis: analysis || {},
      createdBy: user._id,
      createdOn: new Date(),
      updatedOn: new Date()
    });

    await newFormation.save();

    return res.json({
      error: false,
      formation: newFormation,
      message: "Formation erfolgreich erstellt"
    });
  } catch (error) {
    console.error("Error adding formation:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Edit an existing formation
const editFormation = async (req, res) => {
  const formationId = req.params.formationId;
  const { 
    name, 
    formation, 
    description,
    positions,
    style,
    instructions,
    analysis
  } = req.body;
  
  const { user } = req.user;

  if (!name) {
    return res.status(400).json({ error: true, message: "Name ist erforderlich" });
  }

  try {
    const existingFormation = await Formation.findOne({ _id: formationId, createdBy: user._id });

    if (!existingFormation) {
      return res.status(404).json({ error: true, message: "Formation nicht gefunden" });
    }

    existingFormation.name = name;
    existingFormation.formation = formation || existingFormation.formation;
    existingFormation.description = description || "";
    existingFormation.positions = positions || existingFormation.positions;
    existingFormation.style = style || existingFormation.style;
    existingFormation.instructions = instructions || {};
    existingFormation.analysis = analysis || {};
    existingFormation.updatedOn = new Date();

    await existingFormation.save();

    return res.json({
      error: false,
      formation: existingFormation,
      message: "Formation erfolgreich aktualisiert"
    });
  } catch (error) {
    console.error("Error editing formation:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Get all formations for a user
const getAllFormations = async (req, res) => {
  const { user } = req.user;
  const { includeTemplates } = req.query;

  try {
    const formations = await Formation.find({ createdBy: user._id })
      .populate('positions.playerId', 'name position')
      .sort({ updatedOn: -1 });

    // Optionally include predefined templates
    let allFormations = formations;
    if (includeTemplates === 'true') {
      const templatesWithMetadata = Object.entries(formationTemplates).map(([key, template]) => ({
        _id: key,
        ...template,
        formation: key,
        isTemplate: true,
        createdBy: 'template',
        createdOn: new Date(),
        updatedOn: new Date(),
        usage: {
          timesUsed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          cleanSheets: 0
        }
      }));
      
      allFormations = [...templatesWithMetadata, ...formations];
    }

    return res.json({
      error: false,
      formations: allFormations,
      message: "Formationen erfolgreich abgerufen"
    });
  } catch (error) {
    console.error("Error getting formations:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Get a single formation
const getFormation = async (req, res) => {
  const formationId = req.params.formationId;
  const { user } = req.user;

  try {
    // Check if it's a template
    if (formationTemplates[formationId]) {
      const template = formationTemplates[formationId];
      return res.json({
        error: false,
        formation: {
          _id: formationId,
          ...template,
          formation: formationId,
          isTemplate: true,
          createdBy: 'template',
          createdOn: new Date(),
          updatedOn: new Date(),
          usage: {
            timesUsed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            cleanSheets: 0
          }
        },
        message: "Formation erfolgreich abgerufen"
      });
    }

    const formation = await Formation.findOne({ _id: formationId, createdBy: user._id })
      .populate('positions.playerId', 'name position jerseyNumber')
      .populate('alternativePlayers.players.playerId', 'name position');

    if (!formation) {
      return res.status(404).json({ error: true, message: "Formation nicht gefunden" });
    }

    return res.json({
      error: false,
      formation,
      message: "Formation erfolgreich abgerufen"
    });
  } catch (error) {
    console.error("Error getting formation:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Delete a formation
const deleteFormation = async (req, res) => {
  const formationId = req.params.formationId;
  const { user } = req.user;

  try {
    const formation = await Formation.findOne({ _id: formationId, createdBy: user._id });

    if (!formation) {
      return res.status(404).json({ error: true, message: "Formation nicht gefunden" });
    }

    await Formation.deleteOne({ _id: formationId });

    return res.json({
      error: false,
      message: "Formation erfolgreich gelöscht"
    });
  } catch (error) {
    console.error("Error deleting formation:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Create formation from template
const createFromTemplate = async (req, res) => {
  const { templateFormation, customizations } = req.body;
  const { user } = req.user;

  try {
    const template = formationTemplates[templateFormation];
    
    if (!template) {
      return res.status(404).json({ error: true, message: "Formation-Template nicht gefunden" });
    }

    const formation = new Formation({
      ...template,
      ...customizations,
      formation: templateFormation,
      templateFormation: templateFormation,
      isTemplate: false,
      createdBy: user._id,
      createdOn: new Date(),
      updatedOn: new Date()
    });

    await formation.save();

    return res.json({
      error: false,
      formation,
      message: "Formation aus Vorlage erfolgreich erstellt"
    });
  } catch (error) {
    console.error("Error creating formation from template:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Update formation usage statistics
const updateFormationUsage = async (req, res) => {
  const formationId = req.params.formationId;
  const { matchId, result, performance, notes, goalsFor, goalsAgainst, opponentFormation } = req.body;
  const { user } = req.user;

  try {
    const formation = await Formation.findOne({ _id: formationId, createdBy: user._id });

    if (!formation) {
      return res.status(404).json({ error: true, message: "Formation nicht gefunden" });
    }

    // Update usage statistics
    formation.usage.timesUsed += 1;
    formation.usage.goalsFor += goalsFor || 0;
    formation.usage.goalsAgainst += goalsAgainst || 0;
    
    if (result === 'W') formation.usage.wins += 1;
    else if (result === 'D') formation.usage.draws += 1;
    else if (result === 'L') formation.usage.losses += 1;

    if (goalsAgainst === 0) formation.usage.cleanSheets += 1;

    // Add to matches used
    formation.matchesUsed.push({
      matchId,
      result,
      performance,
      notes,
      opponentFormation
    });

    await formation.save();

    return res.json({
      error: false,
      formation,
      message: "Formation-Nutzung erfolgreich aktualisiert"
    });
  } catch (error) {
    console.error("Error updating formation usage:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Get formation templates
const getFormationTemplates = async (req, res) => {
  try {
    const templates = Object.entries(formationTemplates).map(([key, template]) => ({
      _id: key,
      ...template,
      formation: key,
      isTemplate: true
    }));

    return res.json({
      error: false,
      templates,
      message: "Formation-Templates erfolgreich abgerufen"
    });
  } catch (error) {
    console.error("Error getting formation templates:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

module.exports = {
  addFormation,
  editFormation,
  getAllFormations,
  getFormation,
  deleteFormation,
  createFromTemplate,
  updateFormationUsage,
  getFormationTemplates
};
