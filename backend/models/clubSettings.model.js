const mongoose = require('mongoose');

const clubSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String, // URL or base64 data
    default: null
  },
  primaryColor: {
    type: String,
    default: '#3b82f6'
  },
  secondaryColor: {
    type: String,
    default: '#10b981'
  },
  founded: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Index für bessere Performance
clubSettingsSchema.index({ userId: 1 });

module.exports = mongoose.model('ClubSettings', clubSettingsSchema);
