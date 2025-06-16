const Event = require("../models/event.model");
const Player = require("../models/player.model");
const Exercise = require("../models/exercises.model");

// Add a new event
const addEvent = async (req, res) => {
  const { 
    title, 
    type, 
    date, 
    time, 
    duration, 
    location, 
    description,
    gameData,
    trainingData,
    eventData,
    playerAttendance 
  } = req.body;
  
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Titel ist erforderlich" });
  }

  if (!type || !['game', 'training', 'event'].includes(type)) {
    return res.status(400).json({ error: true, message: "Gültiger Typ ist erforderlich (game, training, event)" });
  }

  if (!date) {
    return res.status(400).json({ error: true, message: "Datum ist erforderlich" });
  }

  if (!time) {
    return res.status(400).json({ error: true, message: "Uhrzeit ist erforderlich" });
  }

  try {
    const event = new Event({
      title,
      type,
      date: new Date(date),
      time,
      duration: duration || 90,
      location: location || "",
      description: description || "",
      gameData: type === 'game' ? gameData : undefined,
      trainingData: type === 'training' ? trainingData : undefined,
      eventData: type === 'event' ? eventData : undefined,
      playerAttendance: playerAttendance || [],
      createdBy: user._id,
      createdOn: new Date(),
      updatedOn: new Date()
    });

    await event.save();

    return res.json({
      error: false,
      event,
      message: "Event erfolgreich erstellt"
    });
  } catch (error) {
    console.error("Error adding event:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Edit an existing event
const editEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const { 
    title, 
    type, 
    date, 
    time, 
    duration, 
    location, 
    description,
    gameData,
    trainingData,
    eventData,
    playerAttendance 
  } = req.body;
  
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Titel ist erforderlich" });
  }

  if (!type || !['game', 'training', 'event'].includes(type)) {
    return res.status(400).json({ error: true, message: "Gültiger Typ ist erforderlich (game, training, event)" });
  }

  try {
    const event = await Event.findOne({ _id: eventId, createdBy: user._id });

    if (!event) {
      return res.status(404).json({ error: true, message: "Event nicht gefunden" });
    }

    event.title = title;
    event.type = type;
    event.date = new Date(date);
    event.time = time;
    event.duration = duration || 90;
    event.location = location || "";
    event.description = description || "";
    event.gameData = type === 'game' ? gameData : undefined;
    event.trainingData = type === 'training' ? trainingData : undefined;
    event.eventData = type === 'event' ? eventData : undefined;
    event.playerAttendance = playerAttendance || [];
    event.updatedOn = new Date();

    await event.save();

    return res.json({
      error: false,
      event,
      message: "Event erfolgreich aktualisiert"
    });
  } catch (error) {
    console.error("Error editing event:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Get all events for a user
const getAllEvents = async (req, res) => {
  const { user } = req.user;
  const { startDate, endDate, type } = req.query;

  try {
    let query = { createdBy: user._id };
    
    // Add date range filter if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Add type filter if provided
    if (type && ['game', 'training', 'event'].includes(type)) {
      query.type = type;
    }

    const events = await Event.find(query)
      .populate('trainingData.exercises.exerciseId', 'title category')
      .populate('playerAttendance.playerId', 'name position')
      .sort({ date: 1, time: 1 });

    return res.json({
      error: false,
      events,
      message: "Events erfolgreich abgerufen"
    });
  } catch (error) {
    console.error("Error getting events:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Get a single event
const getEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const { user } = req.user;

  try {
    const event = await Event.findOne({ _id: eventId, createdBy: user._id })
      .populate('trainingData.exercises.exerciseId', 'title category organisation durchfuehrung coaching variante tags')
      .populate('playerAttendance.playerId', 'name position jerseyNumber');

    if (!event) {
      return res.status(404).json({ error: true, message: "Event nicht gefunden" });
    }

    return res.json({
      error: false,
      event,
      message: "Event erfolgreich abgerufen"
    });
  } catch (error) {
    console.error("Error getting event:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const { user } = req.user;

  try {
    const event = await Event.findOne({ _id: eventId, createdBy: user._id });

    if (!event) {
      return res.status(404).json({ error: true, message: "Event nicht gefunden" });
    }

    await Event.deleteOne({ _id: eventId, createdBy: user._id });

    return res.json({
      error: false,
      message: "Event erfolgreich gelöscht"
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Update player attendance for an event
const updatePlayerAttendance = async (req, res) => {
  const eventId = req.params.eventId;
  const { playerAttendance } = req.body;
  const { user } = req.user;

  try {
    const event = await Event.findOne({ _id: eventId, createdBy: user._id });

    if (!event) {
      return res.status(404).json({ error: true, message: "Event nicht gefunden" });
    }

    event.playerAttendance = playerAttendance;
    event.updatedOn = new Date();

    await event.save();

    return res.json({
      error: false,
      event,
      message: "Teilnahme erfolgreich aktualisiert"
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Get events statistics
const getEventStats = async (req, res) => {
  const { user } = req.user;
  const { year, month } = req.query;

  try {
    let startDate, endDate;
    
    if (year && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else if (year) {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    } else {
      // Current year if no parameters
      const currentYear = new Date().getFullYear();
      startDate = new Date(currentYear, 0, 1);
      endDate = new Date(currentYear, 11, 31);
    }

    const stats = await Event.aggregate([
      {
        $match: {
          createdBy: user._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    return res.json({
      error: false,
      stats,
      period: { startDate, endDate },
      message: "Statistiken erfolgreich abgerufen"
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Add recurring training sessions
const addRecurringTraining = async (req, res) => {
  const { 
    title, 
    time, 
    duration, 
    location, 
    description,
    trainingData,
    playerAttendance,
    recurrencePattern // { startDate, endDate, daysOfWeek, frequency }
  } = req.body;
  
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Titel ist erforderlich" });
  }

  if (!recurrencePattern || !recurrencePattern.startDate || !recurrencePattern.endDate) {
    return res.status(400).json({ error: true, message: "Gültiges Wiederholungsmuster ist erforderlich" });
  }

  if (!recurrencePattern.daysOfWeek || recurrencePattern.daysOfWeek.length === 0) {
    return res.status(400).json({ error: true, message: "Mindestens ein Wochentag muss ausgewählt werden" });
  }

  if (!time) {
    return res.status(400).json({ error: true, message: "Uhrzeit ist erforderlich" });
  }

  try {
    const startDate = new Date(recurrencePattern.startDate);
    const endDate = new Date(recurrencePattern.endDate);
    const daysOfWeek = recurrencePattern.daysOfWeek; // Array of day numbers (0 = Sunday, 1 = Monday, etc.)
    const frequency = recurrencePattern.frequency || 1; // Every X weeks
    
    const createdEvents = [];
    let currentDate = new Date(startDate);
    
    // Find the first occurrence of each selected day of week
    const trainingDates = [];
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      
      if (daysOfWeek.includes(dayOfWeek)) {
        trainingDates.push(new Date(currentDate));
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Filter dates based on frequency (every X weeks)
    if (frequency > 1) {
      const filteredDates = [];
      const groupedByWeek = {};
      
      trainingDates.forEach(date => {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Get start of week (Sunday)
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!groupedByWeek[weekKey]) {
          groupedByWeek[weekKey] = [];
        }
        groupedByWeek[weekKey].push(date);
      });
      
      const weekKeys = Object.keys(groupedByWeek).sort();
      for (let i = 0; i < weekKeys.length; i += frequency) {
        filteredDates.push(...groupedByWeek[weekKeys[i]]);
      }
      
      trainingDates.length = 0;
      trainingDates.push(...filteredDates);
    }

    // Create events for each calculated date
    for (const trainingDate of trainingDates) {
      const event = new Event({
        title,
        type: 'training',
        date: trainingDate,
        time,
        duration: duration || 90,
        location: location || "",
        description: description || "",
        trainingData: trainingData || {},
        playerAttendance: playerAttendance || [],
        createdBy: user._id,
        createdOn: new Date(),
        updatedOn: new Date(),
        isRecurring: true,
        recurrenceId: new Date().getTime().toString() // Group recurring events
      });

      await event.save();
      createdEvents.push(event);
    }

    return res.json({
      error: false,
      events: createdEvents,
      count: createdEvents.length,
      message: `${createdEvents.length} Trainingstermine erfolgreich erstellt`
    });
  } catch (error) {
    console.error("Error adding recurring training:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

module.exports = {
  addEvent,
  editEvent,
  getAllEvents,
  getEvent,
  deleteEvent,
  updatePlayerAttendance,
  getEventStats,
  addRecurringTraining
};
