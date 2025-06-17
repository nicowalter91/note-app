const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tacticSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Offensiv', 'Defensiv', 'Aufbau', 'Standard'],
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "blue",
  },
  icon: {
    type: String,
    default: "FaUsers",
  },
  
  // Key tactical points
  keyPoints: [{
    type: String
  }],
  
  // Formation this tactic works with
  formation: {
    type: String,
    default: "4-4-2"
  },
  
  // Detailed tactical instructions
  instructions: {
    attacking: {
      buildUp: { type: String },
      finalThird: { type: String },
      crossing: { type: String },
      shooting: { type: String }
    },
    defending: {
      pressing: { type: String },
      defensive_line: { type: String },
      marking: { type: String },
      tackle: { type: String }
    },
    transitions: {
      counter_attack: { type: String },
      defensive_transition: { type: String }
    }
  },
  
  // Player roles and responsibilities
  playerRoles: [{
    position: { type: String }, // e.g., "LB", "CM", "ST"
    role: { type: String }, // e.g., "Playmaker", "Box-to-Box"
    instructions: { type: String },
    focus: [{ type: String }] // e.g., ["attacking", "creative"]
  }],
  
  // Match context where this tactic is effective
  matchContext: {
    againstStrongerTeam: { type: Boolean, default: false },
    againstWeakerTeam: { type: Boolean, default: false },
    whenWinning: { type: Boolean, default: false },
    whenLosing: { type: Boolean, default: false },
    atHome: { type: Boolean, default: true },
    away: { type: Boolean, default: true }
  },
  
  // Drawing/diagram data (for tactical boards)
  diagramData: {
    elements: [{ type: mongoose.Schema.Types.Mixed }], // Canvas elements
    formation_positions: [{ type: mongoose.Schema.Types.Mixed }]
  },
  
  // Usage statistics
  usage: {
    timesUsed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 }
  },
  
  // Associated matches where this tactic was used
  matchesUsed: [{
    matchId: { type: Schema.Types.ObjectId, ref: 'Event' },
    result: { type: String }, // "W", "D", "L"
    performance: { type: String }, // "excellent", "good", "average", "poor"
    notes: { type: String }
  }],
  
  // Template or custom tactic
  isTemplate: {
    type: Boolean,
    default: false
  },
  
  // If based on a template
  templateId: {
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
tacticSchema.index({ createdBy: 1, category: 1 });
tacticSchema.index({ name: 1, createdBy: 1 });
tacticSchema.index({ 'usage.timesUsed': -1 });

module.exports = mongoose.model("Tactic", tacticSchema);
