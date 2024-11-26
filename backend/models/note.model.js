const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Schema für eine Notiz, das jetzt auch eine Bild-URL unterstützt
const noteSchema = new Schema({
    title: { type: String, required: true },                // Titel der Notiz
    content: { type: String, required: true },              // Inhalt der Notiz
    tags: { type: [String], default: [] },                  // Tags, optional, Default ist ein leeres Array
    isPinned: { type: Boolean, default: false },            // Boolean, ob die Notiz angeheftet ist
    userId: { type: String, required: true },               // Benutzer-ID, der die Notiz erstellt hat
    createdOn: { type: Date, default: new Date().getTime() }, // Erstellungszeitpunkt der Notiz
    imageUrl: { type: String, default: null }               // Neue Eigenschaft für die Bild-URL (Null, wenn kein Bild)
});

module.exports = mongoose.model("Note", noteSchema);
