const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema für eine Übung
const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Der Titel ist erforderlich
  },
  content: {
    type: String,
    required: true, // Der Inhalt ist ebenfalls erforderlich
  },
  date: {
    type: Date,
    default: Date.now, // Wenn kein Datum angegeben wird, wird das aktuelle Datum verwendet
  },
  image: {
    type: String,
    default: '', // Optionales Bild, Standardwert ist ein leerer String
  },
  tags: {
    type: [String], // Array von Tags
    default: [], // Standardmäßig ein leeres Array
  },
  isPinned: {
    type: Boolean,
    default: false, // Standardwert ist false, Übung ist nicht angepinnt
  }
});

// Erstelle das Modell aus dem Schema
const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
