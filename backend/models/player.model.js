const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema für physische Attribute
const physicalAttributesSchema = new mongoose.Schema({
  speed: { type: Number, default: 50 },
  strength: { type: Number, default: 50 },
  agility: { type: Number, default: 50 },
  endurance: { type: Number, default: 50 },
  fitness: { type: Number, default: 50 }
}, { _id: false });

// Schema für Skills
const skillsSchema = new mongoose.Schema({
  // Torwart-Skills
  goalkeeping: { type: Number },
  reflexes: { type: Number },
  handling: { type: Number },
  
  // Verteidiger-Skills
  tackling: { type: Number },
  marking: { type: Number },
  
  // Allgemeine Skills
  passing: { type: Number },
  positioning: { type: Number },
  heading: { type: Number },
  
  // Mittelfeld-Skills
  vision: { type: Number },
  dribbling: { type: Number },
  
  // Stürmer-Skills
  shooting: { type: Number },
  finishing: { type: Number },
  
  // Weitere Skills
  communication: { type: Number },
  leadership: { type: Number },
  decisionMaking: { type: Number }
}, { _id: false });

// Schema für Statistiken
const statsSchema = new mongoose.Schema({
  games: { type: Number, default: 0 },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
  minutesPlayed: { type: Number, default: 0 },
  cleanSheets: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  savesPercentage: { type: Number, default: 0 }
}, { _id: false });

// Schema für Verletzungen
const injurySchema = new mongoose.Schema({
  type: { type: String, required: true },
  date: { type: String, required: true },
  duration: { type: String, required: true },
  status: { type: String, required: true }
});

// Schema für Fortschritte
const progressSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  change: { type: Number, required: true },
  date: { type: String, required: true }
});

// Schema für Entwicklung
const developmentSchema = new mongoose.Schema({
  goals: { type: [String], default: [] },
  recentProgress: { type: [progressSchema], default: [] }
}, { _id: false });

// Schema für persönliche Informationen
const personalInfoSchema = new mongoose.Schema({
  email: { type: String },
  phone: { type: String },
  emergencyContact: { type: String },
  school: { type: String },
  preferredFoot: { type: String }
}, { _id: false });

// Schema für Training
const trainingSchema = new mongoose.Schema({
  attendance: { type: Number, default: 0 },
  recentPerformance: { type: [Number], default: [] },
  specialProgram: { type: String }
}, { _id: false });

// Schema für Dokumente
const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, required: true }
});

// Schema für Notizen
const noteSchema = new mongoose.Schema({
  author: { type: String, 
            enum: [ 'Trainer', 'Assistenztrainer', 'Sportlicher Leiter', 'Beteuer' ],
            required: true },
  date: { type: String, required: true },
  text: { type: String, required: true }
});

// Schema für Teamrolle
const teamRoleSchema = new mongoose.Schema({
  leadership: { type: String },
  preferredPartners: { type: [String], default: [] },
  chemistry: { type: String }
}, { _id: false });

// Hauptschema für Spieler
const playerSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // Optional für Migration
  name: { type: String, required: true },
  position: { type: String },
  age: { type: Number },
  number: { type: Number},
  status: { type: String, default: 'Available' },
  dob: { type: String },
  height: { type: Number },
  weight: { type: Number },
  profileImage: { type: String, default: '' }, // Pfad zum Profilbild
  physicalAttributes: { type: physicalAttributesSchema, default: () => ({}) },
  skills: { type: skillsSchema, default: () => ({}) },
  stats: { type: statsSchema, default: () => ({}) },
  injuries: { type: [injurySchema], default: [] },
  development: { type: developmentSchema, default: () => ({}) },
  personalInfo: { type: personalInfoSchema, default: () => ({}) },
  training: { type: trainingSchema, default: () => ({}) },
  documents: { type: [documentSchema], default: [] },
  notes: { type: [noteSchema], default: [] },
  teamRole: { type: teamRoleSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt vor dem Speichern
playerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
