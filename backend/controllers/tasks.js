const Task = require('../models/task.model');

// Aufgabe erstellen
const createTask = async (req, res) => {
  const { title, date, type } = req.body;

  if (!title || !date || !type) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
  }

  try {
    const newTask = new Task({ title, date, type });
    await newTask.save();
    res.status(201).json({ message: 'Aufgabe erfolgreich erstellt.', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen der Aufgabe.', error });
  }
};

// Aufgaben abrufen
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Aufgaben.', error });
  }
};

// Aufgabe löschen
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Aufgabe erfolgreich gelöscht.' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen der Aufgabe.', error });
  }
};

module.exports = { createTask, getTasks, deleteTask };
