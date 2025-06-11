require("dotenv").config();
const config = require("./config.json");
const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser');
const { authenticateToken } = require("./utilities");
const { validateRequest } = require("./middleware/validation");
const { errorHandler, notFoundHandler } = require('./middleware/error');

// Rate Limiter Konfiguration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 100, // Limit jede IP auf 100 Requests pro Fenster
    message: 'Zu viele Anfragen von dieser IP, bitte versuchen Sie es später erneut.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// CORS Konfiguration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    optionsSuccessStatus: 200,
    maxAge: 24 * 60 * 60 // Pre-flight requests werden 24 Stunden gecached
};

// ** Datenbankverbindung **
const { connectDB, getConnectionStatus } = require("./config/database");
const { connectTempDB, getTempConnectionStatus } = require("./config/tempDatabase");

// Initialisiere Datenbankverbindung mit Fallback
const initializeDatabase = async () => {
    try {
        console.log('🔄 Versuche primäre Datenbankverbindung...');
        await connectDB();
        console.log('✅ Primäre Datenbankverbindung erfolgreich initialisiert');
        
        // Optional: Verbindungsstatus loggen
        const status = getConnectionStatus();
        console.log('📊 Datenbankstatus:', status);
    } catch (error) {
        console.warn('⚠️  Primäre Datenbankverbindung fehlgeschlagen:', error.message);
        console.log('🔄 Versuche alternative Datenbankverbindung...');
        
        try {
            await connectTempDB();
            console.log('✅ Alternative Datenbankverbindung erfolgreich initialisiert');
            
            const status = getTempConnectionStatus();
            console.log('📊 Alternative Datenbankstatus:', status);
        } catch (tempError) {
            console.error('❌ Alle Datenbankverbindungsversuche fehlgeschlagen');
            console.error('Primär:', error.message);
            console.error('Alternativ:', tempError.message);
            process.exit(1);
        }
    }
};

// Starte Datenbankverbindung
initializeDatabase();

// ** Controller-Importe **
const {
    addExercise, 
    editExercise, 
    getExercises, 
    deleteExercise, 
    searchExercises, 
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
    addPlayer,
    editPlayer,
    deletePlayer,
    getAllPlayers,
    getPlayer,
    updateAttendance,
    updateStrengthsAndWeaknesses,
    addDevelopmentGoal,
    updateDevelopmentGoal,
    deleteDevelopmentGoal,
    addInjury,
    updateInjury,
    deleteInjury,
    updatePerformanceMetrics
} = require("./controllers/players");

const { getUser, loginUser, createUser } = require("./controllers/user");
const { handleRefreshToken, clearRefreshToken } = require("./middleware/refreshToken");

const {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent
} = require("./controllers/events");

// Express-App initialisieren
const app = express();

// Sicherheits-Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
}));
app.use(limiter);
app.use(cookieParser());

// Standard-Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    const fileTypes = /jpeg|jpg|png|pdf/; // Added PDF for receipts
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Nur Bilder und PDF-Dateien sind erlaubt!"));
  }
});

// Routes importieren
const transactionsRoutes = require("./routes/transactions");
const clubRoutes = require("./routes/club");
const { updateProfileImage } = require("./controllers/players");

// ** Benutzerverwaltungsrouten **
app.post("/create-account", createUser);
app.post("/api/user/register", validateRequest('createUser'), createUser);
app.post("/login", loginUser);
app.post("/api/user/login", validateRequest('loginUser'), loginUser);
app.get("/get-user", authenticateToken, getUser);
app.get("/api/user", authenticateToken, getUser);
app.post("/api/refresh", handleRefreshToken);
app.post("/api/logout", clearRefreshToken);

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
app.get("/search-exercises", authenticateToken, searchExercises);

// ** Spielerverwaltungsrouten **
app.post("/add-player", authenticateToken, (req, res, next) => {
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
}, addPlayer);
app.put("/edit-player/:playerId", authenticateToken, editPlayer);
app.get("/get-all-players", authenticateToken, getAllPlayers);
app.get("/get-player/:playerId", authenticateToken, getPlayer);
app.delete("/delete-player/:playerId", authenticateToken, deletePlayer);
app.put("/update-attendance/:playerId", authenticateToken, updateAttendance);
app.put("/update-strengths/:playerId", authenticateToken, updateStrengthsAndWeaknesses);
app.post("/add-development-goal/:playerId", authenticateToken, addDevelopmentGoal);
app.put("/update-development-goal/:playerId/:goalId", authenticateToken, updateDevelopmentGoal);
app.delete("/delete-development-goal/:playerId/:goalId", authenticateToken, deleteDevelopmentGoal);
app.post("/add-injury/:playerId", authenticateToken, addInjury);
app.put("/update-injury/:playerId/:injuryId", authenticateToken, updateInjury);
app.delete("/delete-injury/:playerId/:injuryId", authenticateToken, deleteInjury);
app.put("/update-performance/:playerId", authenticateToken, updatePerformanceMetrics);
app.put("/update-profile-image/:playerId", authenticateToken, updateProfileImage);

// Club Routes
app.use('/', clubRoutes);

// Transaction Routes
app.use('/transactions', transactionsRoutes);

// Database Routes
const databaseRoutes = require('./routes/database');
app.use('/api/database', databaseRoutes);

// ** Event-Management Routen **
app.post("/events", authenticateToken, createEvent);
app.get("/events", authenticateToken, getEvents);
app.put("/events/:eventId", authenticateToken, updateEvent);
app.delete("/events/:eventId", authenticateToken, deleteEvent);

// Fehlerbehandlung
app.use(notFoundHandler);
app.use(errorHandler);

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

module.exports = app;
