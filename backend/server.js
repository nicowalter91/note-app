// *** Konfigurations- und Initialisierungsblock ***
require("dotenv").config();
const config = require("./config.json");

const { getUser, loginUser, createUser } = require("./controllers/user");
const { addNote, editNote, getNotes, deleteNote, isPinned, searchNote } = require("./controllers/notes");
const { addPlayer, editPlayer, getPlayers, getPlayer, deletePlayer } = require("./controllers/players");
const { uploadProfileImage, getProfileImage, deleteProfileImage } = require("./controllers/playerProfileImage");
const upload = require("./middleware/uploadMiddleware");
const path = require("path");


// Verbindung zur MongoDB-Datenbank herstellen
const connectDB = require("./config/db");
connectDB();



// Import von Datenbankmodellen
const User = require("./models/user.model");
const Note = require("./models/note.model");
const Task = require("./models/task.model");
const Exercises = require("./models/exercises.model");
const Player = require("./models/player.model");

// Express und Middleware einrichten
const express = require("express");
const cors = require("cors");
const { authenticateToken } = require("./utilities");

const app = express();

// *** Middleware-Setup ***
app.use(express.json()); // Parsing von JSON-Anfragen

// Konfiguriere CORS für lokale Entwicklung und Netzwerkzugriff
app.use(cors({
  origin: '*', // Erlaubt alle Ursprünge
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Statische Dateien (Uploads) bereitstellen
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// *** Spieler-Routen ***
// Route zum Hinzufügen eines neuen Spielers
app.post("/players", async (req, res) => {
  addPlayer(req, res);
});

// Route zum Bearbeiten eines Spielers
app.put("/players/:id", async (req, res) => {
  editPlayer(req, res);
});

// Route zum Abrufen aller Spieler
app.get("/players", async (req, res) => {
  getPlayers(req, res);
});

// Route zum Abrufen eines einzelnen Spielers
app.get("/players/:id", async (req, res) => {
  getPlayer(req, res);
});

// Route zum Löschen eines Spielers
app.delete("/players/:id", async (req, res) => {
  deletePlayer(req, res);
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

// *** Profilbild-Routen ***
// Route zum Hochladen eines Profilbilds
app.post("/players/:id/profile-image", upload.single('profileImage'), async (req, res) => {
  uploadProfileImage(req, res);
});

// Route zum Abrufen eines Profilbilds
app.get("/players/:id/profile-image", async (req, res) => {
  getProfileImage(req, res);
});

// Route zum Löschen eines Profilbilds
app.delete("/players/:id/profile-image", async (req, res) => {
  deleteProfileImage(req, res);
});

// *** Task-Routen ***
const taskRoutes = require('./routes/tasks');
app.use(taskRoutes);

// *** Server starten ***
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Server accessible on local network via http://<your-local-ip>:${PORT}`);
});

module.exports = app;
