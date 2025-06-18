const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Erstelle Upload-Verzeichnis für Videos
const videoUploadDir = path.join(__dirname, '../uploads/videos');
if (!fs.existsSync(videoUploadDir)) {
  fs.mkdirSync(videoUploadDir, { recursive: true });
}

// Konfiguration für Video-Uploads
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videoUploadDir);
  },
  filename: function (req, file, cb) {
    // Eindeutiger Dateiname mit Zeitstempel
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'video-' + uniqueSuffix + ext);
  }
});

// Filter für Video-Dateitypen
const videoFileFilter = (req, file, cb) => {
  // Akzeptierte Video-MIME-Types
  const allowedTypes = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/quicktime',
    'video/x-msvideo',
    'video/mkv',
    'video/x-matroska',
    'video/webm'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Nur Videodateien sind erlaubt! (MP4, AVI, MOV, MKV, WebM)'), false);
  }
};

// Multer-Instanz für Videos
const videoUpload = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    // Maximale Dateigröße: 500MB
    fileSize: 500 * 1024 * 1024
  }
});

// Error handling middleware
const handleVideoUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Video ist zu groß. Maximale Größe: 500MB'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unerwartetes Dateifeld'
      });
    }
  }
  
  if (err.message.includes('Nur Videodateien')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Upload-Fehler',
    error: err.message
  });
};

module.exports = {
  videoUpload,
  handleVideoUploadError
};
