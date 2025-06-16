const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['game', 'training', 'event'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 90, // in minutes
  },
  location: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  
  // Game-specific fields
  gameData: {
    opponent: { type: String },
    isHome: { type: Boolean, default: true },
    competition: { type: String },
    importance: { 
      type: String, 
      enum: ['low', 'medium', 'high'], 
      default: 'medium' 
    },
    preparation: {
      arrival: { type: String },
      warmup: { type: String },
      briefing: { type: String }
    },
    result: {
      homeScore: { type: Number },
      awayScore: { type: Number },
      notes: { type: String }
    }
  },
  
  // Training-specific fields
  trainingData: {
    intensity: { 
      type: String, 
      enum: ['low', 'medium', 'high'], 
      default: 'medium' 
    },
    weatherConditions: { 
      type: String, 
      enum: ['indoor', 'outdoor'], 
      default: 'outdoor' 
    },
    ageGroup: { type: String, default: 'U17+' },
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'], 
      default: 'medium' 
    },
    focusAreas: [{ type: String }],
    requiredEquipment: { type: String },
    goalkeepersNeeded: { type: Boolean, default: false },
    coachingNotes: { type: String },
    trainingObjectives: { type: String },
    exercises: [{
      exerciseId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Exercise' 
      },
      title: { type: String },
      category: { type: String },
      duration: { type: Number, default: 15 },
      order: { type: Number, default: 0 }
    }]
  },
  
  // Event-specific fields
  eventData: {
    participants: [{ type: String }],
    specialInstructions: { type: String }
  },
  
  // Player attendance tracking
  playerAttendance: [{
    playerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Player',
      required: true 
    },
    status: { 
      type: String, 
      enum: ['present', 'absent', 'unknown'], 
      default: 'unknown' 
    }
  }],
  
  // Recurring event fields
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrenceId: {
    type: String, // Groups recurring events together
  },
  
  // Metadata
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date().getTime(),
  },
  updatedOn: {
    type: Date,
    default: new Date().getTime(),
  }
});

// Indexes for better query performance
eventSchema.index({ date: 1, type: 1 });
eventSchema.index({ createdBy: 1, date: 1 });

module.exports = mongoose.model("Event", eventSchema);
