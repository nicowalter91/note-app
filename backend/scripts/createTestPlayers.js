const axios = require('axios');

const players = [
  {
    name: 'Max Müller',
    position: 'Stürmer',
    number: '9',
    birthdate: '1998-03-15',
    height: '185',
    weight: '80',
    notes: 'Starker Abschluss, gute Kopfballspiele'
  },
  {
    name: 'Jan Schmidt',
    position: 'Mittelfeld',
    number: '8',
    birthdate: '1999-06-22',
    height: '178',
    weight: '72',
    notes: 'Technisch sehr versiert, gute Übersicht'
  },
  {
    name: 'Tim Weber',
    position: 'Verteidiger',
    number: '4',
    birthdate: '1997-11-30',
    height: '188',
    weight: '85',
    notes: 'Stark im Zweikampf, gutes Stellungsspiel'
  },
  {
    name: 'Felix Klein',
    position: 'Torwart',
    number: '1',
    birthdate: '1996-08-10',
    height: '192',
    weight: '88',
    notes: 'Hervorragende Reflexe, gute Strafraumbeherrschung'
  },
  {
    name: 'Leon Wagner',
    position: 'Mittelfeld',
    number: '10',
    birthdate: '2000-01-05',
    height: '175',
    weight: '70',
    notes: 'Schnell und wendig, guter Dribbler'
  }
];

async function createTestPlayers() {
  try {
    for (const player of players) {
      const response = await axios.post('http://localhost:8000/add-player', player);
      console.log(`Spieler ${player.name} erfolgreich hinzugefügt:`, response.data);
    }
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Testspieler:', error.message);
  }
}

createTestPlayers();
