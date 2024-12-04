// *** Konfigurations- und Initialisierungsblock ***
require("dotenv").config();
const config = require("./config.json");

const { getUser, loginUser, createUser } = require("./controllers/user");
const { addNote, editNote, getNotes, deleteNote, isPinned, searchNote } = require("./controllers/notes");
const { addExercise, editExercise, getExercises, deleteExercise, searchExercise, isPinnedExercise} = require("./controllers/exercises");



// Verbindung zur MongoDB-Datenbank herstellen
const connectDB = require("./config/db");
connectDB();



// Import von Datenbankmodellen
const User = require("./models/user.model");
const Note = require("./models/note.model");
const Exercises = require("./models/exercises.model");

// Express und Middleware einrichten
const express = require("express");
const cors = require("cors");
const { authenticateToken } = require("./utilities");

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
  addNote(req, res);
});

// Route zum Bearbeiten einer Notiz
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  editNote(req, res);
});

// Route zum Abrufen aller Notizen eines Benutzers
app.get("/get-all-notes", authenticateToken, async (req, res) => {
 getNotes(req,res);
});

// Route zum Löschen einer Notiz
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  deleteNote(req,res);
});

// Route zum Aktualisieren des "isPinned"-Werts
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  isPinned(req, res);
});

// Route zur Suche nach Notizen
app.get("/search-notes", authenticateToken, async (req, res) => {
  searchNote(req,res);
});

// *** Übungswaltungsrouten ***
app.post("/add-exercise", authenticateToken, async (req, res) => {
  addExercise(req, res);
});

app.put("/edit-exercise/:exerciseId", authenticateToken, async (req, res) => {
  editExercise(req, res); 
});

app.get("/get-all-exercises", authenticateToken, async (req, res) => {
  getExercises(req,res);
 });

app.delete("/delete-exercise/:exerciseId", authenticateToken, async (req, res) => {
  deleteExercise(req,res);
});

app.put("/update-exercise-pinned/:exerciseId", authenticateToken, async (req, res) => {
  isPinnedExercise(req, res);
});

app.get("/search-exercise", authenticateToken, async (req, res) => {
  searchExercise(req,res);
});

// *** Server starten ***
app.listen(8000, () => console.log("Server running on port 8000"));

module.exports = app;
