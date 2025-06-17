const Tactic = require("../models/tactic.model");
const Event = require("../models/event.model");

// Predefined tactic templates
const tacticTemplates = [
  {
    id: 'pressing',
    name: 'Gegenpressing',
    category: 'Defensiv',
    description: 'Sofortiges Pressing nach Ballverlust',
    color: 'red',
    icon: 'FaUsers',
    keyPoints: [
      'Schnelle Anlaufwege nach Ballverlust',
      'Kompakte Mannschaftsformation',
      'Aggressive Zweikampfführung',
      'Kurze Passwege blockieren'
    ],
    formation: '4-2-3-1',
    instructions: {
      attacking: {
        buildUp: 'Kurze Pässe, schnelle Kombinationen',
        finalThird: 'Direktes Spiel, schnelle Abschlüsse',
        crossing: 'Wenig Flanken, eher zentrale Angriffe',
        shooting: 'Erste Torchance nutzen'
      },
      defending: {
        pressing: 'Hohes, aggressives Pressing',
        defensive_line: 'Hohe Linie, kompakt stehen',
        marking: 'Manndeckung bei wichtigen Spielern',
        tackle: 'Früh stören, aggressiv in Zweikämpfe'
      },
      transitions: {
        counter_attack: 'Sofort nach vorne, schnelle Umschaltung',
        defensive_transition: 'Sofortiges Pressing nach Ballverlust'
      }
    },
    matchContext: {
      againstStrongerTeam: true,
      againstWeakerTeam: false,
      whenWinning: false,
      whenLosing: true,
      atHome: true,
      away: true
    },
    isTemplate: true
  },
  {
    id: 'counter',
    name: 'Konterangriff',
    category: 'Offensiv',
    description: 'Schnelle Umschaltung nach Ballgewinn',
    color: 'green',
    icon: 'FaArrowRight',
    keyPoints: [
      'Direktes Spiel in die Tiefe',
      'Schnelle Flügelspieler nutzen',
      'Vertikale Passwege suchen',
      'Überzahlsituationen schaffen'
    ],
    formation: '4-5-1',
    instructions: {
      attacking: {
        buildUp: 'Langer Ball oder schneller Kombinationspass',
        finalThird: 'Überzahl ausspielen, Tempo hoch halten',
        crossing: 'Schnelle Flanken von den Flügeln',
        shooting: 'Erste gute Gelegenheit nutzen'
      },
      defending: {
        pressing: 'Mittleres Pressing, Kompaktheit',
        defensive_line: 'Mittlere bis tiefe Linie',
        marking: 'Raumdeckung, zentrale Verstärkung',
        tackle: 'Sicherheit vor Aggressivität'
      },
      transitions: {
        counter_attack: 'Explosive Umschaltung, vertikales Spiel',
        defensive_transition: 'Schnell zurückfallen, Räume schließen'
      }
    },
    matchContext: {
      againstStrongerTeam: true,
      againstWeakerTeam: false,
      whenWinning: true,
      whenLosing: false,
      atHome: false,
      away: true
    },
    isTemplate: true
  },
  {
    id: 'possession',
    name: 'Ballbesitzspiel',
    category: 'Aufbau',
    description: 'Kontrollierter Spielaufbau mit viel Ballbesitz',
    color: 'blue',
    icon: 'FaCircle',
    keyPoints: [
      'Kurze, sichere Pässe',
      'Geduld im Spielaufbau',
      'Breite Staffelung',
      'Rückpass als Option'
    ],
    formation: '4-3-3',
    instructions: {
      attacking: {
        buildUp: 'Geduldiger Aufbau, viele Anspielstationen',
        finalThird: 'Kreatives Spiel, Überläuferstellen',
        crossing: 'Nur bei guten Gelegenheiten',
        shooting: 'Gute Position abwarten'
      },
      defending: {
        pressing: 'Koordiniertes Pressing, nicht zu früh',
        defensive_line: 'Mittlere Linie, Abseitsfalle',
        marking: 'Raumdeckung mit Mannorientierung',
        tackle: 'Geduldig, saubere Zweikämpfe'
      },
      transitions: {
        counter_attack: 'Kontrolle behalten, sicherer Aufbau',
        defensive_transition: 'Sofort nachrücken, Ball zurückgewinnen'
      }
    },
    matchContext: {
      againstStrongerTeam: false,
      againstWeakerTeam: true,
      whenWinning: true,
      whenLosing: false,
      atHome: true,
      away: false
    },
    isTemplate: true
  }
];

// Add a new tactic
const addTactic = async (req, res) => {
  const { 
    name, 
    category, 
    description, 
    color,
    icon,
    keyPoints,
    formation,
    instructions,
    playerRoles,
    matchContext,
    diagramData,
    templateId
  } = req.body;
  
  const { user } = req.user;

  if (!name) {
    return res.status(400).json({ error: true, message: "Name ist erforderlich" });
  }

  if (!category || !['Offensiv', 'Defensiv', 'Aufbau', 'Standard'].includes(category)) {
    return res.status(400).json({ error: true, message: "Gültige Kategorie ist erforderlich" });
  }

  try {
    const tactic = new Tactic({
      name,
      category,
      description: description || "",
      color: color || "blue",
      icon: icon || "FaUsers",
      keyPoints: keyPoints || [],
      formation: formation || "4-4-2",
      instructions: instructions || {},
      playerRoles: playerRoles || [],
      matchContext: matchContext || {},
      diagramData: diagramData || {},
      templateId: templateId || null,
      createdBy: user._id,
      createdOn: new Date(),
      updatedOn: new Date()
    });

    await tactic.save();

    return res.json({
      error: false,
      tactic,
      message: "Taktik erfolgreich erstellt"
    });
  } catch (error) {
    console.error("Error adding tactic:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Edit an existing tactic
const editTactic = async (req, res) => {
  const tacticId = req.params.tacticId;
  const { 
    name, 
    category, 
    description, 
    color,
    icon,
    keyPoints,
    formation,
    instructions,
    playerRoles,
    matchContext,
    diagramData
  } = req.body;
  
  const { user } = req.user;

  if (!name) {
    return res.status(400).json({ error: true, message: "Name ist erforderlich" });
  }

  try {
    const tactic = await Tactic.findOne({ _id: tacticId, createdBy: user._id });

    if (!tactic) {
      return res.status(404).json({ error: true, message: "Taktik nicht gefunden" });
    }

    tactic.name = name;
    tactic.category = category;
    tactic.description = description || "";
    tactic.color = color || "blue";
    tactic.icon = icon || "FaUsers";
    tactic.keyPoints = keyPoints || [];
    tactic.formation = formation || "4-4-2";
    tactic.instructions = instructions || {};
    tactic.playerRoles = playerRoles || [];
    tactic.matchContext = matchContext || {};
    tactic.diagramData = diagramData || {};
    tactic.updatedOn = new Date();

    await tactic.save();

    return res.json({
      error: false,
      tactic,
      message: "Taktik erfolgreich aktualisiert"
    });
  } catch (error) {
    console.error("Error editing tactic:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Get all tactics for a user
const getAllTactics = async (req, res) => {
  const { user } = req.user;
  const { category, includeTemplates } = req.query;

  try {
    let query = { createdBy: user._id };
    
    if (category && ['Offensiv', 'Defensiv', 'Aufbau', 'Standard'].includes(category)) {
      query.category = category;
    }

    const tactics = await Tactic.find(query).sort({ updatedOn: -1 });
    
    // Optionally include predefined templates
    let allTactics = tactics;
    if (includeTemplates === 'true') {
      const templatesWithMetadata = tacticTemplates.map(template => ({
        ...template,
        _id: template.id,
        createdBy: 'template',
        createdOn: new Date(),
        updatedOn: new Date(),
        usage: {
          timesUsed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0
        }
      }));
      
      allTactics = [...templatesWithMetadata, ...tactics];
    }

    return res.json({
      error: false,
      tactics: allTactics,
      message: "Taktiken erfolgreich abgerufen"
    });
  } catch (error) {
    console.error("Error getting tactics:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Get a single tactic
const getTactic = async (req, res) => {
  const tacticId = req.params.tacticId;
  const { user } = req.user;

  try {
    // Check if it's a template
    if (tacticTemplates.find(t => t.id === tacticId)) {
      const template = tacticTemplates.find(t => t.id === tacticId);
      return res.json({
        error: false,
        tactic: {
          ...template,
          _id: template.id,
          createdBy: 'template',
          createdOn: new Date(),
          updatedOn: new Date(),
          usage: {
            timesUsed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0
          }
        },
        message: "Taktik erfolgreich abgerufen"
      });
    }

    const tactic = await Tactic.findOne({ _id: tacticId, createdBy: user._id });

    if (!tactic) {
      return res.status(404).json({ error: true, message: "Taktik nicht gefunden" });
    }

    return res.json({
      error: false,
      tactic,
      message: "Taktik erfolgreich abgerufen"
    });
  } catch (error) {
    console.error("Error getting tactic:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Delete a tactic
const deleteTactic = async (req, res) => {
  const tacticId = req.params.tacticId;
  const { user } = req.user;

  try {
    const tactic = await Tactic.findOne({ _id: tacticId, createdBy: user._id });

    if (!tactic) {
      return res.status(404).json({ error: true, message: "Taktik nicht gefunden" });
    }

    await Tactic.deleteOne({ _id: tacticId });

    return res.json({
      error: false,
      message: "Taktik erfolgreich gelöscht"
    });
  } catch (error) {
    console.error("Error deleting tactic:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Create tactic from template
const createFromTemplate = async (req, res) => {
  const { templateId, customizations } = req.body;
  const { user } = req.user;

  try {
    const template = tacticTemplates.find(t => t.id === templateId);
    
    if (!template) {
      return res.status(404).json({ error: true, message: "Template nicht gefunden" });
    }

    const tactic = new Tactic({
      ...template,
      ...customizations,
      templateId: templateId,
      isTemplate: false,
      createdBy: user._id,
      createdOn: new Date(),
      updatedOn: new Date()
    });

    // Remove the template id field
    delete tactic.id;

    await tactic.save();

    return res.json({
      error: false,
      tactic,
      message: "Taktik aus Vorlage erfolgreich erstellt"
    });
  } catch (error) {
    console.error("Error creating tactic from template:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Update tactic usage statistics
const updateTacticUsage = async (req, res) => {
  const tacticId = req.params.tacticId;
  const { matchId, result, performance, notes } = req.body;
  const { user } = req.user;

  try {
    const tactic = await Tactic.findOne({ _id: tacticId, createdBy: user._id });

    if (!tactic) {
      return res.status(404).json({ error: true, message: "Taktik nicht gefunden" });
    }

    // Update usage statistics
    tactic.usage.timesUsed += 1;
    
    if (result === 'W') tactic.usage.wins += 1;
    else if (result === 'D') tactic.usage.draws += 1;
    else if (result === 'L') tactic.usage.losses += 1;

    // Add to matches used
    tactic.matchesUsed.push({
      matchId,
      result,
      performance,
      notes
    });

    await tactic.save();

    return res.json({
      error: false,
      tactic,
      message: "Taktik-Nutzung erfolgreich aktualisiert"
    });
  } catch (error) {
    console.error("Error updating tactic usage:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

module.exports = {
  addTactic,
  editTactic,
  getAllTactics,
  getTactic,
  deleteTactic,
  createFromTemplate,
  updateTacticUsage
};
