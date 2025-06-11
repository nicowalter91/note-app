const mongoose = require('mongoose');
const Player = require('../models/player.model');

// Verbindung zur Datenbank
console.log('Verbinde zur Datenbank...');
mongoose.connect('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Datenbankverbindung erfolgreich');
  createTestPlayers();
}).catch(err => {
  console.error('Datenbankverbindungsfehler:', err);
  process.exit(1);
});

const players = [
  {
    name: 'Max Müller',
    position: 'Sturm',
    number: 9,
    birthdate: '1998-03-15',
    height: 185,
    weight: 80,
    notes: 'Starker Abschluss, gute Kopfballspiele',
    statistics: {
      gamesPlayed: 12,
      goals: 8,
      assists: 3,
      yellowCards: 2,
      redCards: 0
    },
    performanceMetrics: {
      technicalSkills: 8,
      tacticalUnderstanding: 7,
      physicalFitness: 8,
      mentalStrength: 7,
      teamwork: 8
    }
  },
  {
    name: 'Jan Schmidt',
    position: 'Mittelfeld',
    number: 8,
    birthdate: '1999-06-22',
    height: 178,
    weight: 72,
    notes: 'Technisch sehr versiert, gute Übersicht',
    statistics: {
      gamesPlayed: 15,
      goals: 4,
      assists: 9,
      yellowCards: 3,
      redCards: 0
    },
    performanceMetrics: {
      technicalSkills: 9,
      tacticalUnderstanding: 9,
      physicalFitness: 7,
      mentalStrength: 8,
      teamwork: 9
    }
  },
  {
    name: 'Tim Weber',
    position: 'Verteidigung',
    number: 4,
    birthdate: '1997-11-30',
    height: 188,
    weight: 85,
    notes: 'Stark im Zweikampf, gutes Stellungsspiel',
    statistics: {
      gamesPlayed: 14,
      goals: 1,
      assists: 2,
      yellowCards: 4,
      redCards: 1
    },
    performanceMetrics: {
      technicalSkills: 6,
      tacticalUnderstanding: 8,
      physicalFitness: 8,
      mentalStrength: 9,
      teamwork: 8
    }
  },
  {
    name: 'Felix Klein',
    position: 'Torwart',
    number: 1,
    birthdate: '1996-08-10',
    height: 192,
    weight: 88,
    notes: 'Hervorragende Reflexe, gute Strafraumbeherrschung',
    statistics: {
      gamesPlayed: 16,
      goals: 0,
      assists: 1,
      yellowCards: 1,
      redCards: 0
    },
    performanceMetrics: {
      technicalSkills: 7,
      tacticalUnderstanding: 8,
      physicalFitness: 7,
      mentalStrength: 9,
      teamwork: 7
    }
  },
  {
    name: 'Leon Wagner',
    position: 'Mittelfeld',
    number: 10,
    birthdate: '2000-01-05',
    height: 175,
    weight: 70,
    notes: 'Schnell und wendig, guter Dribbler',
    statistics: {
      gamesPlayed: 13,
      goals: 6,
      assists: 7,
      yellowCards: 2,
      redCards: 0
    },
    performanceMetrics: {
      technicalSkills: 9,
      tacticalUnderstanding: 7,
      physicalFitness: 9,
      mentalStrength: 6,
      teamwork: 7
    }
  },
  {
    name: 'Marco Bauer',
    position: 'Verteidigung',
    number: 5,
    birthdate: '1998-12-03',
    height: 183,
    weight: 78,
    notes: 'Zuverlässiger Verteidiger mit gutem Aufbauspiel',
    statistics: {
      gamesPlayed: 11,
      goals: 2,
      assists: 3,
      yellowCards: 3,
      redCards: 0
    },
    performanceMetrics: {
      technicalSkills: 7,
      tacticalUnderstanding: 8,
      physicalFitness: 7,
      mentalStrength: 8,
      teamwork: 9
    }
  }
];

async function createTestPlayers() {
  try {
    console.log('Starte Erstellung der Testspieler...');
    
    // Lösche alle bestehenden Spieler
    const deleteResult = await Player.deleteMany({});
    console.log(`${deleteResult.deletedCount} bestehende Spieler gelöscht`);

    // Erstelle neue Testspieler
    for (const playerData of players) {
      const player = new Player(playerData);
      await player.save();
      console.log(`Spieler ${playerData.name} erfolgreich hinzugefügt`);
    }

    console.log('Alle Testspieler erfolgreich erstellt');
    process.exit(0);
  } catch (error) {
    console.error('Fehler beim Erstellen der Testspieler:', error);
    process.exit(1);
  }
}

// Entferne den direkten Aufruf hier
