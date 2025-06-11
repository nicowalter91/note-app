const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true, enum: ['Spiel', 'Training', 'Event'] },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['geplant', 'abgeschlossen', 'abgesagt'], default: 'geplant' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
