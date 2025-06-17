// Middleware zur optionalen Authentifizierung von Benutzern
const jwt = require('jsonwebtoken');

// Middleware-Funktion zur optionalen Authentifizierung von Benutzern anhand eines Tokens
function optionalAuth(req, res, next) {
    // Überprüft, ob ein "Authorization"-Header in der Anfrage vorhanden ist
    const authHeader = req.headers["authorization"];
    // Extrahiert den Token aus dem Authorization-Header, der im Format "Bearer <token>" sein sollte
    const token = authHeader && authHeader.split(" ")[1];

    // Wenn kein Token vorhanden ist, wird ohne Benutzer fortgefahren
    if (!token) {
        req.user = null;
        return next();
    }

    // Überprüft das Token mit dem SECRET-Schlüssel, der in der Umgebungsvariable gespeichert ist
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // Wenn ein Fehler beim Verifizieren des Tokens auftritt, wird ohne Benutzer fortgefahren
        if (err) {
            req.user = null;
        } else {
            // Wenn das Token gültig ist, wird der Benutzer (user) aus dem Token extrahiert
            req.user = user;
        }

        // Ruft die nächste Middleware-Funktion auf
        next();
    });
}

// Exportiert die Middleware-Funktion, sodass sie in anderen Dateien verwendet werden kann
module.exports = optionalAuth;
