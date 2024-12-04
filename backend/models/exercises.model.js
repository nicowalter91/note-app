const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema für eine Übung
const exerciseSchema = new Schema({

  title: { type: String, required: true },
  organisation: { type: String, required: true },
  durchfuehrung: { type: String, required: true, },
  coaching: { type: String, required: true, },
  variante: { type: String, },
  date: { type: Date, default: Date.now, },
  image: {type: String, default: '',},
  tags: {type: [String], default: [],}, 
  isPinnedExercise: { type: Boolean, default: false, },
  userId: { type: String, required: true },
  createdOn: { type: Date, default: new Date().getTime() },
});

// Erstelle das Modell aus dem Schema
module.exports = mongoose.model("Exercise", exerciseSchema);


