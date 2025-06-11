const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const injurySchema = new Schema({
    type: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ['Akut', 'In Behandlung', 'Geheilt'], default: 'Akut' },
    treatmentPlan: String,
    rehabilitationProgress: { type: Number, min: 0, max: 100, default: 0 },
    notes: String
}, { timestamps: true });

const developmentGoalSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    startDate: { type: Date, default: Date.now },
    targetDate: Date,
    status: { type: String, enum: ['Offen', 'In Bearbeitung', 'Abgeschlossen'], default: 'Offen' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    notes: String
}, { timestamps: true });

const attendanceSchema = new Schema({
    date: { type: Date, required: true },
    status: { type: String, enum: ['Anwesend', 'Abwesend', 'Entschuldigt'], required: true },
    note: String
});

const playerSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },    position: { 
        type: String, 
        required: true, 
        enum: ['Torwart', 'Verteidigung', 'Mittelfeld', 'Sturm']
    },
    number: { type: Number, min: 1, max: 99 },
    birthdate: Date,
    height: { type: Number, min: 0 }, // in cm
    weight: { type: Number, min: 0 }, // in kg
    image: String,
    notes: String,
    injuries: [injurySchema],
    developmentGoals: [developmentGoalSchema],
    attendance: [attendanceSchema],
    strengths: [String],
    weaknesses: [String],
    statistics: {
        gamesPlayed: { type: Number, default: 0 },
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 }
    },
    performanceMetrics: {
        technicalSkills: { type: Number, min: 0, max: 10 },
        tacticalUnderstanding: { type: Number, min: 0, max: 10 },
        physicalFitness: { type: Number, min: 0, max: 10 },
        mentalStrength: { type: Number, min: 0, max: 10 },
        teamwork: { type: Number, min: 0, max: 10 }
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuals
playerSchema.virtual('age').get(function() {
    if (!this.birthdate) return null;
    const today = new Date();
    const birthdate = new Date(this.birthdate);
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
});

// Static method to update attendance
playerSchema.statics.updateAttendance = async function(playerId, attendanceData) {
    return this.findByIdAndUpdate(
        playerId,
        { $push: { attendance: attendanceData } },
        { new: true, runValidators: true }
    );
};

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
