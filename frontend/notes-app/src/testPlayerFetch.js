// Einfaches Testskript zum Abrufen eines Spielers von der API
const testPlayerFetch = async () => {
  try {
    // Beispiel-ID (muss durch eine gültige ID ersetzt werden)
    const playerId = '1'; // Hier eine gültige ID eintragen
    
    // API-Anfrage
    const response = await fetch(`http://localhost:8000/players/${playerId}`);
    const data = await response.json();
    
    console.log('API-Antwort:', data);
    
    // Struktur der Antwort prüfen
    if (data.success && data.player) {
      console.log('Spieler gefunden:', data.player);
    } else {
      console.log('Spieler nicht gefunden oder falsches Antwortformat');
    }
  } catch (error) {
    console.error('Fehler bei der API-Anfrage:', error);
  }
};

// Test ausführen
testPlayerFetch();
