const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Importiere bcrypt
const Schema = mongoose.Schema;

// Definiere das Schema
const userSchema = new Schema({
    fullName: {type: String},
    email: {type: String, unique: true}, // Optional: Email sollte eindeutig sein
    password: {type: String, required: true}, // Passwort ist erforderlich
    createdOn: {type: Date, default: () => new Date()},
    refreshTokens: [{
        token: { type: String },
        createdAt: { type: Date, default: Date.now, expires: 7*24*60*60 } // Token läuft nach 7 Tagen ab
    }]
});

// Middleware, die vor dem Speichern ausgeführt wird
userSchema.pre("save", async function (next) {
    // Überprüfe, ob das Passwort geändert wurde oder neu ist
    if (!this.isModified("password")) return next();

    try {
        // Generiere einen Salt-Wert
        const salt = await bcrypt.genSalt(10); // 10 ist die Standard-Rundenanzahl

        // Hash das Passwort mit dem Salt
        this.password = await bcrypt.hash(this.password, salt);

        next(); // Weiter mit dem Speichern
    } catch (err) {
        next(err); // Fehler beim Hashen weitergeben
    }
});

// Methode, um das Passwort beim Login zu überprüfen
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Exportiere das Modell
module.exports = mongoose.model("User", userSchema);
