// Verbindung zur Datenbank herstellen
use('notesapp');

// Alle Collections anzeigen
show collections;

// Prüfen der clubs Collection
db.clubs.find().forEach(printjson);
