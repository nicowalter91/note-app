const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definiert ein Schema für Notizen, die in der Datenbank gespeichert werden sollen.
const noteSchema = new Schema({

    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    userId: { type: String, required: true },
    createdOn: { type: Date, default: new Date().getTime() },
});

// Exportiert das Mongoose-Modell "Note", das auf dem definierten Schema basiert.
// Dieses Modell wird verwendet, um CRUD-Operationen auf der "Note"-Kollektion in der MongoDB-Datenbank auszuführen.
module.exports = mongoose.model("Note", noteSchema);


