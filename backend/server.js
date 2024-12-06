require("dotenv").config();
const config = require("./config.json");
const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { authenticateToken } = require("./utilities");

// ** Datenbankverbindung **
const connectDB = require("./config/db");
connectDB();

// ** Controller-Importe **
const { 
    addExercise, 
    editExercise, 
    getExercises, 
    deleteExercise, 
    searchExercise, 
    isPinnedExercise 
} = require("./controllers/exercises");

const { 
    addNote, 
    editNote, 
    getNotes, 
    deleteNote, 
    isPinned, 
    searchNote 
} = require("./controllers/notes");

const { 
    getUser, 
    loginUser, 
    createUser 
} = require("./controllers/user");

// ** Express-Setup **
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static("uploads"));

// ** Multer-Konfiguration **
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "./uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"));
    }
  }
});

// ** Statische Route für Bildzugriff **
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ** Benutzerverwaltungsrouten **
app.post("/create-account", createUser);
app.post("/login", loginUser);
app.get("/get-user", authenticateToken, getUser);

// ** Notizverwaltungsrouten **
app.post("/add-note", authenticateToken, addNote);
app.put("/edit-note/:noteId", authenticateToken, editNote);
app.get("/get-all-notes", authenticateToken, getNotes);
app.delete("/delete-note/:noteId", authenticateToken, deleteNote);
app.put("/update-note-pinned/:noteId", authenticateToken, isPinned);
app.get("/search-notes", authenticateToken, searchNote);

// ** Übungsverwaltungsrouten **
app.post("/add-exercise", authenticateToken, upload.single("image"), addExercise);
app.put("/edit-exercise/:exerciseId", authenticateToken, upload.single("image"), editExercise);
app.get("/get-all-exercises", authenticateToken, getExercises);
app.delete("/delete-exercise/:exerciseId", authenticateToken, deleteExercise);
app.put("/update-exercise-pinned/:exerciseId", authenticateToken, isPinnedExercise);
app.get("/search-exercise", authenticateToken, searchExercise);

// ** Starten des Servers **
app.listen(8000, () => console.log("Server running on port 8000"));

module.exports = app;
