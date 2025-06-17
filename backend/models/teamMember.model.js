const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the main club/team owner
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the invited user (null if not yet registered)
    default: null
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true,
    enum: ['assistant', 'caretaker', 'physiotherapist', 'analyst'],
    default: 'assistant'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'declined'],
    default: 'pending'
  },
  permissions: {
    canViewPlayers: {
      type: Boolean,
      default: true
    },
    canEditPlayers: {
      type: Boolean,
      default: false
    },
    canViewTraining: {
      type: Boolean,
      default: true
    },
    canEditTraining: {
      type: Boolean,
      default: false
    },
    canViewStatistics: {
      type: Boolean,
      default: true
    },
    canViewFinances: {
      type: Boolean,
      default: false
    }
  },
  invitedAt: {
    type: Date,
    default: Date.now
  },
  joinedAt: {
    type: Date,
    default: null
  },  inviteToken: {
    type: String,
    required: false, // Nicht mehr required, da es nach Annahme gelöscht wird
    unique: true,
    sparse: true // Erlaubt null/undefined Werte für unique constraint
  },
  inviteExpiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

// Index für bessere Performance
teamMemberSchema.index({ clubId: 1 });
teamMemberSchema.index({ email: 1 });
teamMemberSchema.index({ inviteToken: 1 });
teamMemberSchema.index({ inviteExpiresAt: 1 });

// Methode um Standard-Permissions basierend auf Rolle zu setzen
teamMemberSchema.methods.setDefaultPermissions = function() {
  switch (this.role) {
    case 'assistant': // Co-Trainer
      this.permissions = {
        canViewPlayers: true,
        canEditPlayers: true,
        canViewTraining: true,
        canEditTraining: true,
        canViewStatistics: true,
        canViewFinances: false
      };
      break;
    case 'caretaker': // Betreuer
      this.permissions = {
        canViewPlayers: true,
        canEditPlayers: false,
        canViewTraining: true,
        canEditTraining: false,
        canViewStatistics: true,
        canViewFinances: true
      };
      break;
    case 'physiotherapist': // Physiotherapeut
      this.permissions = {
        canViewPlayers: true,
        canEditPlayers: true, // Für Verletzungen
        canViewTraining: true,
        canEditTraining: false,
        canViewStatistics: true,
        canViewFinances: false
      };
      break;
    case 'analyst': // Analyst
      this.permissions = {
        canViewPlayers: true,
        canEditPlayers: false,
        canViewTraining: true,
        canEditTraining: false,
        canViewStatistics: true,
        canViewFinances: false
      };
      break;
    default:
      this.permissions = {
        canViewPlayers: true,
        canEditPlayers: false,
        canViewTraining: true,
        canEditTraining: false,
        canViewStatistics: false,
        canViewFinances: false
      };
  }
};

// Pre-save Hook um Standard-Permissions zu setzen
teamMemberSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('role')) {
    this.setDefaultPermissions();
  }
  next();
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);
