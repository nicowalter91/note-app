// Laden der Umgebungsvariablen aus der .env-Datei
require("dotenv").config();

// Konfiguration aus der config.json-Datei laden
const config = require("./config.json");
// Verbindung zur MongoDB-Datenbank über Mongoose
const mongoose = require("mongoose");
mongoose.connect(config.connectionString);

// Import von Modellen für Benutzer und Notizen
const User = require("./models/user.model");
const Note = require("./models/note.model");

// Express und Middleware einbinden
const express = require("express");
const cors = require("cors");
const app = express();

// JSON Web Token (JWT) und eine Hilfsfunktion für Authentifizierung
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

// Middleware zur Behandlung von JSON-Anfragen und CORS
app.use(express.json()); // Ermöglicht das Parsen von JSON-Daten
app.use(
    cors({
        origin: "*", // Erlaubt CORS für alle Ursprünge
    })
);

// Eine einfache GET-Route für die Startseite, die eine Nachricht zurückgibt
app.get("/", (req, res) => {
    res.json({ data: "hello"});
});

// BACKEND READY!!!

// Route zum Erstellen eines neuen Benutzerkontos
app.post("/create-account", async (req, res) => {
    console.log("Entering create account");

    // Benutzereingaben aus dem Body der Anfrage extrahieren
    const { fullName, email, password } = req.body;

    // Validierung der Eingabedaten
    if (!fullName) {
        return res.status(400).json({error: true, message: "Full Name is required"});
    };
    if (!email) {
        return res.status(400).json({error: true, message: "Email is required"});
    };
    if (!password) {
        return res.status(400).json({error: true, message: "Password is required"});
    };

    // Überprüfen, ob der Benutzer bereits existiert
    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists",
        });
    };

    // Neues Benutzerobjekt erstellen
    const user = new User({
        fullName,
        email,
        password,
    });

    // Benutzer in der Datenbank speichern
    await user.save();

    // JWT-Token für den neuen Benutzer erstellen
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m", // Gültigkeitsdauer des Tokens
    });

    // Erfolgsnachricht mit Benutzerinformationen und Token zurückgeben
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});

// Login-Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validierung der Eingaben
    if (!email) {
        return res.status(400).json({ message: "Email is required"});
    }
    if (!password) {
        return res.status(400).json({ message: "Password is required"});
    }

    // Überprüfen, ob der Benutzer existiert
    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    // Überprüfen, ob die Anmeldedaten korrekt sind
    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };

        // JWT-Token für den Benutzer erstellen
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        })
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
});

// Route zum Abrufen von Benutzerinformationen
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;

    // Überprüfen, ob der Benutzer in der Datenbank existiert
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401); // Wenn der Benutzer nicht gefunden wird, 401 Unauthorized zurückgeben
    }

    // Benutzerinformationen zurückgeben
    return res.json({
        user: {fullName: isUser.fullName, email: isUser.email, "_id": isUser._id, createdOn: isUser.createdOn},
        message: "",
    });
});

// Route zum Hinzufügen einer neuen Notiz
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    // Überprüfen, ob der Titel und Inhalt vorhanden sind
    if (!title) {
        return res.status(400).json({error: true, message: "Title is required" });
    }

    if (!content) {
        return res.status(400).json({error: true, message: "Content is required" });
    }

    try {
        // Neue Notiz erstellen und speichern
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        // Erfolgsnachricht zurückgeben
        return res.json({
            error: false,
            note, 
            message: "Note added successfully",
        });
        
    } catch (error) {
        // Fehlerbehandlung bei Serverfehlern
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Route zum Bearbeiten einer Notiz
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    // Überprüfen, ob Änderungen angegeben wurden
    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No changes provided"})
    }

    try {
        // Die Notiz aus der Datenbank abrufen und ändern
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Änderungen speichern
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        // Erfolgsnachricht zurückgeben
        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Route zum Abrufen aller Notizen eines Benutzers
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        // Notizen des Benutzers aus der Datenbank abrufen, sortiert nach "isPinned"
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        // Erfolgsnachricht zurückgeben
        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Route zum Löschen einer Notiz
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        // Die Notiz suchen, um sicherzustellen, dass sie existiert und dem Benutzer gehört
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found",
            })
        }

        // Notiz aus der Datenbank löschen
        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Route zum Aktualisieren des "isPinned"-Werts einer Notiz
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // "isPinned"-Wert aktualisieren
        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Route zur Suche nach Notizen
app.get("/search-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    // Überprüfen, ob eine Suchanfrage vorliegt
    if (!query) {
        return res 
        .status(400)
        .json({error: true, message: "Search query is required"});
    }

    try {
        // Notizen nach Titel oder Inhalt durchsuchen
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                {title: { $regex: new RegExp(query, "i")}},
                {content: { $regex: new RegExp(query, "i")}},
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully"
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Server starten und auf Port 8000 hören
app.listen(8000);

module.exports = app;
