const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statisticsSchema = new Schema({
  // Match statistics
  matchStats: {
    played: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    drawn: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    cleanSheets: { type: Number, default: 0 },
    biggestWin: { type: String, default: "" },
    biggestLoss: { type: String, default: "" }
  },

  // Training statistics
  trainingStats: {
    sessionsPlanned: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 }, // in minutes
    averageAttendance: { type: Number, default: 0 },
    focusAreasCount: {
      technique: { type: Number, default: 0 },
      tactics: { type: Number, default: 0 },
      fitness: { type: Number, default: 0 },
      mentality: { type: Number, default: 0 }
    }
  },

  // Player statistics
  playerStats: {
    totalPlayers: { type: Number, default: 0 },
    averageAge: { type: Number, default: 0 },
    positionDistribution: {
      goalkeeper: { type: Number, default: 0 },
      defender: { type: Number, default: 0 },
      midfielder: { type: Number, default: 0 },
      forward: { type: Number, default: 0 }
    },
    topScorers: [{
      playerId: { type: Schema.Types.ObjectId, ref: 'Player' },
      name: { type: String },
      goals: { type: Number, default: 0 }
    }],
    topAssisters: [{
      playerId: { type: Schema.Types.ObjectId, ref: 'Player' },
      name: { type: String },
      assists: { type: Number, default: 0 }
    }],
    mostAppearances: [{
      playerId: { type: Schema.Types.ObjectId, ref: 'Player' },
      name: { type: String },
      appearances: { type: Number, default: 0 }
    }]
  },

  // Time period for these statistics
  period: {
    type: { 
      type: String, 
      enum: ['month', 'season', 'year', 'all'], 
      default: 'season' 
    },
    year: { type: Number },
    month: { type: Number },
    season: { type: String }
  },

  // Performance trends (weekly/monthly data)
  performanceData: [{
    period: { type: String }, // e.g., "2024-W1", "2024-01"
    matches: {
      won: { type: Number, default: 0 },
      drawn: { type: Number, default: 0 },
      lost: { type: Number, default: 0 }
    },
    goals: {
      scored: { type: Number, default: 0 },
      conceded: { type: Number, default: 0 }
    }
  }],

  // Metadata
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  calculatedOn: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
statisticsSchema.index({ teamId: 1, 'period.type': 1, 'period.year': 1 });
statisticsSchema.index({ createdBy: 1, lastUpdated: -1 });

module.exports = mongoose.model("Statistics", statisticsSchema);
