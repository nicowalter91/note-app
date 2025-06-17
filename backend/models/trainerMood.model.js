const mongoose = require('mongoose');

const trainerMoodSchema = new mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Pre-Training Mood
  preTraining: {
    mood: {
      type: Number,
      min: 1,
      max: 10,
      default: null
    },
    energy: {
      type: Number,
      min: 1,
      max: 10,
      default: null
    },
    stress: {
      type: Number,
      min: 1,
      max: 10,
      default: null
    },
    motivation: {
      type: Number,
      min: 1,
      max: 10,
      default: null
    },
    notes: {
      type: String,
      default: ''
    }
  },
  
  // Post-Training Mood
  postTraining: {
    mood: {
      type: Number,
      min: 1,
      max: 10,
      default: null
    },
    energy: {
      type: Number,
      min: 1,
      max: 10,
      default: null
    },
    satisfaction: {
      type: Number,
      min: 1,
      max: 10,
      default: null
    },
    notes: {
      type: String,
      default: ''
    }
  },
  
  // Training Assessment
  trainingQuality: {
    type: Number,
    min: 1,
    max: 10,
    default: null
  },
  playerResponse: {
    type: Number,
    min: 1,
    max: 10,
    default: null
  },
  
  // Reflection
  challengesToday: [{
    type: String
  }],
  wins: [{
    type: String
  }],
  learnings: {
    type: String,
    default: ''
  },
  
  // Sleep & Health
  sleepQuality: {
    type: Number,
    min: 1,
    max: 10,
    default: null
  },
  sleepHours: {
    type: Number,
    default: null
  },
  
  // Quick Tags
  tags: [{
    type: String,
    enum: [
      'great-day', 'tough-day', 'breakthrough', 'frustrating', 
      'energetic', 'tired', 'motivated', 'stressed', 
      'team-focused', 'tactical-success', 'communication-good', 
      'player-issues', 'personal-growth', 'need-break'
    ]
  }],
  
  // Weather (affects mood)
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'cold', 'hot'],
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better performance
trainerMoodSchema.index({ trainerId: 1, date: -1 });
trainerMoodSchema.index({ trainerId: 1, 'tags': 1 });

// Method to calculate daily mood average
trainerMoodSchema.methods.getDailyMoodAverage = function() {
  const scores = [];
  
  if (this.preTraining.mood) scores.push(this.preTraining.mood);
  if (this.postTraining.mood) scores.push(this.postTraining.mood);
  
  return scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : null;
};

// Method to get mood trend
trainerMoodSchema.statics.getMoodTrend = async function(trainerId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await this.find({
    trainerId,
    date: { $gte: startDate }
  }).sort({ date: 1 });
};

module.exports = mongoose.model('TrainerMood', trainerMoodSchema);
