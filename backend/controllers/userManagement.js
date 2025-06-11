const User = require('../models/user.model');

// Benutzer erstellen
const createUser = async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich.' });
  }

  try {
    const newUser = new User({ name, email, role });
    await newUser.save();
    res.status(201).json({ message: 'Benutzer erfolgreich erstellt.', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen des Benutzers.', error });
  }
};

// Benutzer abrufen
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Benutzer.', error });
  }
};

// Benutzer löschen
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Benutzer erfolgreich gelöscht.' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Benutzers.', error });
  }
};

module.exports = { createUser, getUsers, deleteUser };
