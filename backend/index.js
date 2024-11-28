// *** Konfigurations- und Initialisierungsblock ***

// Laden der Umgebungsvariablen aus der .env-Datei
require("dotenv").config();

// Laden der Konfiguration aus config.json
const config = require("./config.json");

// Verbindung zur MongoDB-Datenbank herstellen
const mongoose = require("mongoose");
console.log("DB is running.")
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
    const { fullName, email, password } = req.body;

    // Validierung der Eingabedaten
    if (!fullName) return res.status(400).json({ error: true, message: "Full Name is required" });
    if (!email) return res.status(400).json({ error: true, message: "Email is required" });
    if (!password) return res.status(400).json({ error: true, message: "Password is required" });

    // Überprüfen, ob der Benutzer existiert
    const isUser = await User.findOne({ email });
    if (isUser) return res.json({ error: true, message: "User already exists" });

    // Benutzer erstellen und speichern
    const user = new User({ fullName, email, password });
    await user.save();

    // JWT-Token generieren
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });
    return res.json({ error: false, user, accessToken, message: "Registration Successful" });
});

// Login-Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    try {
        const userInfo = await User.findOne({ email });
        if (!userInfo) return res.status(400).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, userInfo.password);
        if (!isPasswordValid) return res.status(400).json({ error: true, message: "Invalid Credentials" });

        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });

        return res.json({ error: false, message: "Login Successful", email, accessToken });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Route zum Abrufen von Benutzerinformationen
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) return res.sendStatus(401);
    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn,
        },
        message: "",
    });
});

// *** Notizverwaltungsrouten ***

// Route zum Hinzufügen einer neuen Notiz
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) return res.status(400).json({ error: true, message: "Title is required" });
    if (!content) return res.status(400).json({ error: true, message: "Content is required" });

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
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Route zum Bearbeiten einer Notiz
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) return res.status(404).json({ error: true, message: "Note not found" });

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();
        return res.json({ error: false, note, message: "Note updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Route zum Abrufen aller Notizen eines Benutzers
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({ error: false, notes, message: "All notes retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Route zum Löschen einer Notiz
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) return res.status(404).json({ error: true, message: "Note not found" });

        await Note.deleteOne({ _id: noteId, userId: user._id });
        return res.json({ error: false, message: "Note deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Route zum Aktualisieren des "isPinned"-Werts
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) return res.status(404).json({ error: true, message: "Note not found" });

        note.isPinned = isPinned;
        await note.save();
        return res.json({ error: false, note, message: "Note updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Route zur Suche nach Notizen
app.get("/search-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) return res.status(400).json({ error: true, message: "Search query is required" });

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });
        return res.json({ error: false, notes: matchingNotes, message: "Notes matching query retrieved" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// *** Server starten ***
app.listen(8000, () => console.log("Server running on port 8000"));

module.exports = app;
