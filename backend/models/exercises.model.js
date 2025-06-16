const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema für eine Übung
const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Der Titel ist erforderlich
  },
  organisation: {
    type: String,
    required: true, // Die Organisation ist erforderlich
  },
  durchfuehrung: {
    type: String,
    required: true, // Die Durchführung ist erforderlich
  },
  coaching: {
    type: String,
    required: true, // Das Coaching ist erforderlich
  },
  variante: {
    type: String,
    required: true, // Die Variante ist erforderlich
  },
  date: {
    type: Date,
    default: Date.now, // Wenn kein Datum angegeben wird, wird das aktuelle Datum verwendet
  },
  image: {
    type: String,
    default: '', // Optionales Bild, Standardwert ist ein leerer String
  },  drawing: {
    type: String,
    default: '', // Optionale Zeichnung, Standardwert ist ein leerer String
  },
  drawingImage: {
    type: String,
    default: '', // Path to the drawing image file
  },
  drawingData: {
    type: String,
    default: '', // JSON string containing all drawing element data
  },
  tags: {
    type: [String], // Array von Tags
    default: [], // Standardmäßig ein leeres Array
  },
  category: {
    type: String,
    default: 'Allgemein', // Standardkategorie
    enum: [
      'Allgemein',
      'Technik', 
      'Taktik',
      'Kondition',
      'Koordination',
      'Torwart',
      'Aufwärmen',
      'Abschluss',
      'Passspiel',
      'Verteidigung',
      'Angriff',
      'Standards',
      'Spielformen'
    ]
  },
  isPinned: {
    type: Boolean,
    default: false, // Standardwert ist false, Übung ist nicht angepinnt
  },
  userId: {
    type: String,
    required: true, // Benutzer-ID ist erforderlich
  }
});

// Erstelle das Modell aus dem Schema
const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
