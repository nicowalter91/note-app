const Exercise = require("../models/exercises.model");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer-Konfiguration für Exercise-Bilder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/exercises');
    // Erstelle den Ordner falls er nicht existiert
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'exercise-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadExerciseImage = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Nur Bilddateien prüfen
    if (file.fieldname === 'image' || file.fieldname === 'drawing') {
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        return cb(new Error('Nur Bilddateien (JPEG, JPG, PNG, GIF) sind erlaubt!'));
      }
    }
    // Andere Felder ignorieren
    cb(null, false);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Wrapper function for addExercise with file upload
const addExercise = (req, res) => {
  uploadExerciseImage.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: true, message: err.message });
    }
    addExerciseHandler(req, res);
  });
};

// Übung hinzufügen Handler
const addExerciseHandler = async (req, res) => {
  console.log('=== addExerciseHandler called ===');
  console.log('req.body:', req.body);
  console.log('req.user:', req.user);
  console.log('req.file:', req.file);
    const { title, organisation, durchfuehrung, coaching, variante, tags, category } = req.body;
  const userId = req.user.user._id;

  console.log('Extracted data:', { title, organisation, durchfuehrung, coaching, variante, tags, category, userId });

  if (!title) {
    return res.status(400).json({ error: true, message: "Titel ist erforderlich" });
  }

  if (!organisation) {
    return res.status(400).json({ error: true, message: "Organisation ist erforderlich" });
  }

  if (!durchfuehrung) {
    return res.status(400).json({ error: true, message: "Durchführung ist erforderlich" });
  }

  if (!coaching) {
    return res.status(400).json({ error: true, message: "Coaching ist erforderlich" });
  }

  if (!variante) {
    return res.status(400).json({ error: true, message: "Variante ist erforderlich" });
  }

  try {    const exercise = new Exercise({
      title,
      organisation,
      durchfuehrung,
      coaching,
      variante,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category: category || 'Allgemein',
      userId: userId,
      image: req.file ? req.file.filename : '',
    });

    console.log('Exercise object before save:', exercise);
    await exercise.save();
    console.log('Exercise saved successfully:', exercise);

    return res.json({
      error: false,
      exercise,
      message: "Übung erfolgreich hinzugefügt",
    });
  } catch (error) {
    console.error("Error in addExercise:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Server-Fehler",
    });
  }
};

// Wrapper function for editExercise with file upload  
const editExercise = (req, res) => {
  uploadExerciseImage.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: true, message: err.message });
    }
    editExerciseHandler(req, res);
  });
};

// Übung bearbeiten Handler
const editExerciseHandler = async (req, res) => {
  const exerciseId = req.params.exerciseId;  const { title, organisation, durchfuehrung, coaching, variante, tags, category } = req.body;
  const userId = req.user.user._id;

  if (!title && !organisation && !durchfuehrung && !coaching && !variante && !tags && !category) {
    return res.status(400).json({ error: true, message: "Keine Änderungen angegeben" });
  }

  try {
    const exercise = await Exercise.findOne({ _id: exerciseId, userId: userId });

    if (!exercise) {
      return res.status(404).json({ error: true, message: "Übung nicht gefunden" });
    }    if (title) exercise.title = title;
    if (organisation) exercise.organisation = organisation;
    if (durchfuehrung) exercise.durchfuehrung = durchfuehrung;
    if (coaching) exercise.coaching = coaching;
    if (variante) exercise.variante = variante;
    if (tags) exercise.tags = tags.split(',').map(tag => tag.trim());
    if (category) exercise.category = category;
    if (req.file) {
      // Lösche das alte Bild falls vorhanden
      if (exercise.image) {
        const oldImagePath = path.join(__dirname, '../uploads/exercises', exercise.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      exercise.image = req.file.filename;
    }

    await exercise.save();

    return res.json({
      error: false,
      exercise,
      message: "Übung erfolgreich aktualisiert",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Interner Server-Fehler",
    });
  }
};

// Alle Übungen abrufen
const getAllExercises = async (req, res) => {
  console.log('getAllExercises called');
  console.log('req.user:', req.user);
  const userId = req.user.user._id;
  console.log('Using userId:', userId);

  try {
    const exercises = await Exercise.find({ userId: userId }).sort({ isPinned: -1, date: -1 });
    console.log('Found exercises:', exercises.length);
    console.log('Exercises:', exercises);return res.json({
      error: false,
      exercises,
      message: "Alle Übungen erfolgreich abgerufen",
    });
  } catch (error) {
    console.error("Error in getAllExercises:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Server-Fehler",
    });
  }
};

// Übung löschen
const deleteExercise = async (req, res) => {
  const exerciseId = req.params.exerciseId;
  const userId = req.user.user._id;

  try {
    const exercise = await Exercise.findOne({ _id: exerciseId, userId: userId });

    if (!exercise) {
      return res.status(404).json({ error: true, message: "Übung nicht gefunden" });
    }

    // Lösche das Bild falls vorhanden
    if (exercise.image) {
      const imagePath = path.join(__dirname, '../uploads/exercises', exercise.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Exercise.deleteOne({ _id: exerciseId, userId: userId });

    return res.json({
      error: false,
      success: true,
      message: "Übung erfolgreich gelöscht",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Interner Server-Fehler",
    });
  }
};

// Übung Pin-Status aktualisieren
const updateExercisePinned = async (req, res) => {
  const exerciseId = req.params.exerciseId;
  const { isPinned } = req.body;
  const userId = req.user.user._id;

  try {
    const exercise = await Exercise.findOne({ _id: exerciseId, userId: userId });

    if (!exercise) {
      return res.status(404).json({ error: true, message: "Übung nicht gefunden" });
    }

    exercise.isPinned = isPinned;

    await exercise.save();

    return res.json({
      error: false,
      exercise,
      message: "Übung erfolgreich aktualisiert",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Interner Server-Fehler",
    });
  }
};

// Übungen suchen
const searchExercises = async (req, res) => {
  const { query } = req.query;
  const userId = req.user.user._id;

  if (!query) {
    return res.status(400).json({ error: true, message: "Suchbegriff ist erforderlich" });
  }

  try {    const matchingExercises = await Exercise.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { organisation: { $regex: query, $options: "i" } },
        { durchfuehrung: { $regex: query, $options: "i" } },
        { coaching: { $regex: query, $options: "i" } },
        { variante: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    });

    return res.json({
      error: false,
      exercises: matchingExercises,
      message: "Übungen erfolgreich gefunden",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Interner Server-Fehler",
    });
  }
};

module.exports = {
  addExercise,
  editExercise,
  getAllExercises,
  deleteExercise,
  updateExercisePinned,
  searchExercises,
};
