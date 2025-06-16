// Test für die Vollständigkeit der Spielerdaten-Erfassung und -Speicherung
// Dieses Skript prüft, ob alle Felder des Player-Modells korrekt erfasst und gespeichert werden können

const testPlayerData = {
  // Basis-Daten
  name: "Test Spieler",
  position: "ST",
  age: 20,
  number: 10,
  status: "Available",
  dob: "01.01.2004",
  height: 180,
  weight: 75,
  
  // Physische Attribute
  physicalAttributes: {
    speed: 85,
    strength: 78,
    agility: 82,
    endurance: 80,
    fitness: 88
  },
  
  // Skills (alle verfügbaren Skills aus dem Schema)
  skills: {
    // Torwart-Skills
    goalkeeping: 90,
    reflexes: 88,
    handling: 85,
    
    // Verteidiger-Skills
    tackling: 75,
    marking: 78,
    
    // Allgemeine Skills
    passing: 82,
    positioning: 85,
    heading: 80,
    
    // Mittelfeld-Skills
    vision: 85,
    dribbling: 88,
    
    // Stürmer-Skills
    shooting: 90,
    finishing: 87,
    
    // Weitere Skills
    communication: 80,
    leadership: 82,
    decisionMaking: 85
  },
  
  // Statistiken
  stats: {
    games: 25,
    goals: 18,
    assists: 12,
    yellowCards: 3,
    redCards: 0,
    minutesPlayed: 2250,
    cleanSheets: 0,
    saves: 0,
    savesPercentage: 0
  },
  
  // Verletzungen
  injuries: [
    {
      type: "Muskelverletzung",
      date: "15.03.2024",
      duration: "3 Wochen",
      status: "Erholt"
    },
    {
      type: "Zerrung",
      date: "20.05.2024",
      duration: "1 Woche",
      status: "Erholt"
    }
  ],
  
  // Entwicklung
  development: {
    goals: [
      "Verbesserung der Kopfballstärke",
      "Entwicklung der schwächeren linken Seite",
      "Steigerung der Passsicherheit"
    ],
    recentProgress: [
      {
        skill: "Shooting",
        change: 5,
        date: "01.06.2024"
      },
      {
        skill: "Positioning",
        change: 3,
        date: "15.05.2024"
      }
    ]
  },
  
  // Persönliche Informationen
  personalInfo: {
    email: "test.spieler@example.com",
    phone: "+49 123 456789",
    emergencyContact: "Max Mustermann (Vater): +49 987 654321",
    school: "Gymnasium Musterstadt",
    preferredFoot: "Rechts"
  },
  
  // Training
  training: {
    attendance: 95,
    recentPerformance: [88, 92, 85, 90, 87],
    specialProgram: "Torschuss-Training, Mittwochs 16:00"
  },
  
  // Dokumente
  documents: [
    {
      name: "Sportärztliche Untersuchung",
      date: "01.03.2024",
      type: "medical"
    },
    {
      name: "Spielervertrag",
      date: "01.08.2023",
      type: "contract"
    },
    {
      name: "Passfoto",
      date: "15.02.2024",
      type: "identification"
    }
  ],
  
  // Notizen
  notes: [
    {
      author: "Trainer Schmidt",
      date: "10.06.2024",
      text: "Zeigt hervorragende Fortschritte im Abschluss. Sollte mehr Verantwortung im Spiel übernehmen."
    },
    {
      author: "Co-Trainer Mueller",
      date: "05.06.2024",
      text: "Sehr diszipliniert im Training. Gutes Vorbild für jüngere Spieler."
    }
  ],
  
  // Teamrolle
  teamRole: {
    leadership: "Team Captain",
    preferredPartners: ["Max Mustermann", "John Doe", "Jane Smith"],
    chemistry: "Hervorragend mit der Offensive, gute Kommunikation mit dem Mittelfeld"
  }
};

// Funktion zum Testen der API-Endpunkte
const testPlayerDataStorage = async () => {
  try {
    console.log('=== TEST: Spielerdaten-Erfassung und -Speicherung ===');
    
    // 1. Test: Neuen Spieler erstellen
    console.log('\n1. Erstelle neuen Spieler...');
    const createResponse = await fetch('http://localhost:8000/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPlayerData)
    });
    
    const createResult = await createResponse.json();
    console.log('Ergebnis Erstellen:', createResult);
    
    if (!createResult.success) {
      throw new Error('Fehler beim Erstellen des Spielers: ' + createResult.message);
    }
    
    const playerId = createResult.player._id;
    console.log(`Spieler erfolgreich erstellt mit ID: ${playerId}`);
    
    // 2. Test: Spieler abrufen und Daten vergleichen
    console.log('\n2. Lade Spieler aus Datenbank...');
    const fetchResponse = await fetch(`http://localhost:8000/players/${playerId}`);
    const fetchResult = await fetchResponse.json();
    
    if (!fetchResult.success) {
      throw new Error('Fehler beim Abrufen des Spielers: ' + fetchResult.message);
    }
    
    console.log('Geladener Spieler:', fetchResult.player);
    
    // 3. Test: Datenintegrität prüfen
    console.log('\n3. Prüfe Datenintegrität...');
    const savedPlayer = fetchResult.player;
    
    // Prüfe wichtige Felder
    const checks = [
      { field: 'name', expected: testPlayerData.name, actual: savedPlayer.name },
      { field: 'position', expected: testPlayerData.position, actual: savedPlayer.position },
      { field: 'age', expected: testPlayerData.age, actual: savedPlayer.age },
      { field: 'physicalAttributes.speed', expected: testPlayerData.physicalAttributes.speed, actual: savedPlayer.physicalAttributes?.speed },
      { field: 'skills.shooting', expected: testPlayerData.skills.shooting, actual: savedPlayer.skills?.shooting },
      { field: 'stats.goals', expected: testPlayerData.stats.goals, actual: savedPlayer.stats?.goals },
      { field: 'personalInfo.email', expected: testPlayerData.personalInfo.email, actual: savedPlayer.personalInfo?.email },
      { field: 'injuries.length', expected: testPlayerData.injuries.length, actual: savedPlayer.injuries?.length },
      { field: 'development.goals.length', expected: testPlayerData.development.goals.length, actual: savedPlayer.development?.goals?.length },
      { field: 'notes.length', expected: testPlayerData.notes.length, actual: savedPlayer.notes?.length }
    ];
    
    let failedChecks = 0;
    checks.forEach(check => {
      if (check.expected !== check.actual) {
        console.log(`❌ ${check.field}: Erwartet ${check.expected}, erhalten ${check.actual}`);
        failedChecks++;
      } else {
        console.log(`✅ ${check.field}: OK`);
      }
    });
    
    // 4. Test: Spieler aktualisieren
    console.log('\n4. Aktualisiere Spielerdaten...');
    const updatedData = {
      ...testPlayerData,
      age: 21,
      stats: {
        ...testPlayerData.stats,
        goals: 20
      }
    };
    
    const updateResponse = await fetch(`http://localhost:8000/players/${playerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData)
    });
    
    const updateResult = await updateResponse.json();
    console.log('Update-Ergebnis:', updateResult);
    
    // 5. Test: Aktualisierte Daten prüfen
    console.log('\n5. Prüfe aktualisierte Daten...');
    const fetchUpdatedResponse = await fetch(`http://localhost:8000/players/${playerId}`);
    const fetchUpdatedResult = await fetchUpdatedResponse.json();
    const updatedPlayer = fetchUpdatedResult.player;
    
    console.log(`Alter aktualisiert: ${updatedPlayer.age === 21 ? '✅' : '❌'} (${updatedPlayer.age})`);
    console.log(`Tore aktualisiert: ${updatedPlayer.stats?.goals === 20 ? '✅' : '❌'} (${updatedPlayer.stats?.goals})`);
    
    // 6. Test cleanup - Spieler löschen
    console.log('\n6. Cleanup - Lösche Testspieler...');
    const deleteResponse = await fetch(`http://localhost:8000/players/${playerId}`, {
      method: 'DELETE'
    });
    const deleteResult = await deleteResponse.json();
    console.log('Löschen erfolgreich:', deleteResult.success ? '✅' : '❌');
    
    console.log('\n=== TEST ABGESCHLOSSEN ===');
    console.log(`Fehlgeschlagene Checks: ${failedChecks}`);
    console.log(failedChecks === 0 ? '✅ Alle Tests erfolgreich!' : '❌ Einige Tests fehlgeschlagen!');
    
  } catch (error) {
    console.error('❌ Testfehler:', error);
  }
};

// Test ausführen
console.log('Starte Test der Spielerdaten-Erfassung...');
testPlayerDataStorage();
