const Event = require('../models/event.model');

// Event erstellen
const createEvent = async (req, res) => {
  console.log('Creating event with data:', req.body);
  console.log('User from token:', req.user);
  try {
    const { title, description, type, date, time, location, participants } = req.body;
    const { user } = req.user;

    if (!title || !type || !date || !time || !location) {
      console.log('Validation failed:', { title, type, date, time, location });
      return res.status(400).json({ message: 'Alle Pflichtfelder müssen ausgefüllt sein.' });
    }

    const newEvent = new Event({
      title,
      description,
      type,
      date,
      time,
      location,
      participants: participants || [],
      createdBy: user._id
    });

    await newEvent.save();
    return res.status(201).json({ message: 'Event erfolgreich erstellt', event: newEvent });
  } catch (error) {
    return res.status(500).json({ message: 'Fehler beim Erstellen des Events', error: error.message });
  }
};

// Events abrufen
const getEvents = async (req, res) => {
  try {
    const { user } = req.user;
    const { type, status, startDate, endDate } = req.query;

    let query = { createdBy: user._id };
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const events = await Event.find(query)
      .populate('participants', 'name position number')
      .sort({ date: 1, time: 1 });

    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: 'Fehler beim Abrufen der Events', error: error.message });
  }
};

// Event aktualisieren
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, type, date, time, location, participants, status } = req.body;
    const { user } = req.user;

    const event = await Event.findOne({ _id: eventId, createdBy: user._id });
    
    if (!event) {
      return res.status(404).json({ message: 'Event nicht gefunden' });
    }

    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (type) event.type = type;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;
    if (participants) event.participants = participants;
    if (status) event.status = status;

    await event.save();
    return res.json({ message: 'Event erfolgreich aktualisiert', event });
  } catch (error) {
    return res.status(500).json({ message: 'Fehler beim Aktualisieren des Events', error: error.message });
  }
};

// Event löschen
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { user } = req.user;

    const event = await Event.findOne({ _id: eventId, createdBy: user._id });
    
    if (!event) {
      return res.status(404).json({ message: 'Event nicht gefunden' });
    }

    await event.deleteOne();
    return res.json({ message: 'Event erfolgreich gelöscht' });
  } catch (error) {
    return res.status(500).json({ message: 'Fehler beim Löschen des Events', error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
};
