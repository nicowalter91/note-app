// *** Konfigurations- und Initialisierungsblock ***

// Laden der Umgebungsvariablen aus der .env-Datei
require("dotenv").config();

const { getUser, loginUser, createUser } = require("./controllers/user");


// Laden der Konfiguration aus config.json
const config = require("./config.json");

// Verbindung zur MongoDB-Datenbank herstellen
const mongoose = require("mongoose");
console.log("DB is running.");
mongoose.connect(config.connectionString);

// Import von Datenbankmodellen
const User = require("./models/user.model");
const Note = require("./models/note.model");
const Exercises = require("./models/exercises.model");

// Express und Middleware einrichten
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const bcrypt = require("bcrypt");

const app = express();

// *** Middleware-Setup ***
app.use(express.json()); // Parsing von JSON-Anfragen
app.use(cors({ origin: "*" })); // CORS für alle Ursprünge erlauben

// *** Basisroute ***
app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// *** Benutzerverwaltungsrouten ***

// Route zum Erstellen eines neuen Benutzerkontos
app.post("/create-account", async (req, res) => {
    createUser(req, res);
});

// Login-Route
app.post("/login", async (req, res) => {
  loginUser(req, res);
});

// Route zum Abrufen von Benutzerinformationen
app.get("/get-user", authenticateToken, async (req, res) => {
  getUser(req, res);
});

// *** Notizverwaltungsrouten ***

// Route zum Hinzufügen einer neuen Notiz
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title)
    return res.status(400).json({ error: true, message: "Title is required" });
  if (!content)
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();
    return res.json({ error: false, note, message: "Note added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Route zum Bearbeiten einer Notiz
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found" });

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Route zum Abrufen aller Notizen eines Benutzers
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Route zum Löschen einer Notiz
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found" });

    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({ error: false, message: "Note deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Route zum Aktualisieren des "isPinned"-Werts
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found" });

    note.isPinned = isPinned;
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Route zur Suche nach Notizen
app.get("/search-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query)
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching query retrieved",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// *** Server starten ***
app.listen(8000, () => console.log("Server running on port 8000"));

module.exports = app;
