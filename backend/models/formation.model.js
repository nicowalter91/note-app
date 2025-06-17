const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const formationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  formation: {
    type: String,
    required: true, // e.g., "4-4-2", "4-3-3"
  },
  description: {
    type: String,
    default: "",
  },
  
  // Player positions on the field
  positions: [{
    id: { type: String, required: true }, // e.g., "gk", "lb", "cb1"
    name: { type: String, required: true }, // e.g., "TW", "LV", "IV"
    x: { type: Number, required: true }, // x coordinate (0-100)
    y: { type: Number, required: true }, // y coordinate (0-100)
    playerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Player',
      default: null 
    },
    playerName: { type: String }, // Cache player name for performance
    color: { type: String, default: 'blue' }, // Position color
    role: { type: String }, // e.g., "Playmaker", "Destroyer"
    instructions: { type: String } // Specific instructions for this position
  }],
  
  // Formation metadata
  style: {
    type: String,
    enum: ['offensive', 'defensive', 'balanced', 'counter'],
    default: 'balanced'
  },
  
  // Tactical instructions for the formation
  instructions: {
    attacking: {
      buildUp: { type: String },
      width: { type: String },
      tempo: { type: String }
    },
    defending: {
      line: { type: String },
      pressing: { type: String },
      compactness: { type: String }
    }
  },
  
  // Formation strengths and weaknesses
  analysis: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suitableAgainst: [{ type: String }],
    notSuitableAgainst: [{ type: String }]
  },
  
  // Usage statistics
  usage: {
    timesUsed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    cleanSheets: { type: Number, default: 0 }
  },
  
  // Associated matches where this formation was used
  matchesUsed: [{
    matchId: { type: Schema.Types.ObjectId, ref: 'Event' },
    result: { type: String }, // "W", "D", "L"
    performance: { type: String }, // "excellent", "good", "average", "poor"
    notes: { type: String },
    opponentFormation: { type: String }
  }],
  
  // Alternative players for each position (substitutions/rotations)
  alternativePlayers: [{
    positionId: { type: String },
    players: [{
      playerId: { type: Schema.Types.ObjectId, ref: 'Player' },
      suitability: { type: Number, min: 1, max: 10, default: 5 } // How well the player fits
    }]
  }],
  
  // Template or custom formation
  isTemplate: {
    type: Boolean,
    default: false
  },
  
  // If based on a template
  templateFormation: {
    type: String
  },
  
  // Metadata
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  }
});

// Indexes for better query performance
formationSchema.index({ createdBy: 1, formation: 1 });
formationSchema.index({ name: 1, createdBy: 1 });
formationSchema.index({ 'usage.timesUsed': -1 });

module.exports = mongoose.model("Formation", formationSchema);
