const Club = require('../models/club.model');
const multer = require('multer');
const path = require('path');

// Multer Konfiguration für Datei-Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Nur Bilder sind erlaubt! (.png, .jpg, .jpeg)');
        }
    }
}).single('logo');

// Club Settings speichern oder updaten
exports.saveClubSettings = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err });
            }

            const clubData = {
                name: req.body.name,
                team: req.body.team,
                address: req.body.address,
                city: req.body.city,
                zipCode: req.body.zipCode,
                primaryColor: req.body.primaryColor,
                secondaryColor: req.body.secondaryColor,
                createdBy: req.user._id
            };

            if (req.file) {
                clubData.logo = req.file.path;
            }

            // Prüfen ob bereits Einstellungen existieren
            let club = await Club.findOne({ createdBy: req.user._id });

            if (club) {
                // Update existierende Einstellungen
                club = await Club.findOneAndUpdate(
                    { createdBy: req.user._id },
                    clubData,
                    { new: true }
                );
            } else {
                // Neue Einstellungen erstellen
                club = await Club.create(clubData);
            }

            res.status(200).json(club);
        });
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Speichern der Einstellungen", error: error.message });
    }
};

// Club Settings abrufen
exports.getClubSettings = async (req, res) => {
    try {
        const club = await Club.findOne({ createdBy: req.user._id });
        if (!club) {
            return res.status(404).json({ message: "Keine Einstellungen gefunden" });
        }
        res.status(200).json(club);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen der Einstellungen", error: error.message });
    }
};
