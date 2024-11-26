// Importiert das Mongoose-Modul, um mit MongoDB zu interagieren.
const mongoose = require("mongoose");

// Ruft das Schema-Objekt von Mongoose ab, um ein Datenmodell zu definieren.
const Schema = mongoose.Schema;

// Definiert ein Schema für Notizen, die in der Datenbank gespeichert werden sollen.
const noteSchema = new Schema({
    // Titel der Notiz: Pflichtfeld vom Typ String.
    title: { type: String, required: true },

    // Inhalt der Notiz: Pflichtfeld vom Typ String.
    content: { type: String, required: true },

    // Tags: Ein Array von Strings, um die Notiz zu kategorisieren. Standardmäßig leer.
    tags: { type: [String], default: [] },

    // Gibt an, ob die Notiz angepinnt (hervorgehoben) ist: Boolean, Standardwert ist false.
    isPinned: { type: Boolean, default: false },

    // ID des Benutzers, der die Notiz erstellt hat: Pflichtfeld vom Typ String.
    userId: { type: String, required: true },

    // Erstellungsdatum der Notiz: Datumsfeld mit dem Standardwert der aktuellen Zeit.
    createdOn: { type: Date, default: new Date().getTime() },
});

// Exportiert das Mongoose-Modell "Note", das auf dem definierten Schema basiert.
// Dieses Modell wird verwendet, um CRUD-Operationen auf der "Note"-Kollektion in der MongoDB-Datenbank auszuführen.
module.exports = mongoose.model("Note", noteSchema);


