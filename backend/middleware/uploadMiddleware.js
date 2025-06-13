const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Stellen Sie sicher, dass das Upload-Verzeichnis existiert
const uploadDir = path.join(__dirname, '../uploads/profileImages');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurieren des Speichers für Multer
const storage = multer.diskStorage({
  // Zielverzeichnis für Uploads
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  // Dateiname für die hochgeladene Datei
  filename: function (req, file, cb) {
    // Erzeuge einen eindeutigen Dateinamen mit Zeitstempel
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Behalte die Dateiendung bei
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

// Filter für Dateitypen (nur Bilder erlauben)
const fileFilter = (req, file, cb) => {
  // Akzeptiere nur Bilder
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Nur Bilddateien sind erlaubt!'), false);
  }
};

// Multer-Upload-Instanz erstellen
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // Maximale Dateigröße: 5MB
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;
