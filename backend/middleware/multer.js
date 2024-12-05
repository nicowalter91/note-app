const multer = require('multer');
const path = require('path');

// Speicherort und Dateinamen festlegen
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ordner für die Speicherung
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Eindeutiger Dateiname
  },
});

// Filter für akzeptierte Dateitypen
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
