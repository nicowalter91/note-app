// Middleware zur Authentifizierung von Benutzern
const jwt = require('jsonwebtoken');

// Middleware-Funktion zur Authentifizierung von Benutzern anhand eines Tokens
function authenticateUser(req, res, next) {
    // Überprüft, ob ein "Authorization"-Header in der Anfrage vorhanden ist
    const authHeader = req.headers["authorization"];
    // Extrahiert den Token aus dem Authorization-Header, der im Format "Bearer <token>" sein sollte
    const token = authHeader && authHeader.split(" ")[1];

    // Wenn kein Token vorhanden ist, wird der Zugriff verweigert (Status 401 Unauthorized)
    if (!token) {
        return res.status(401).json({ success: false, message: 'Benutzer nicht authentifiziert' });
    }

    // Überprüft das Token mit dem SECRET-Schlüssel, der in der Umgebungsvariable gespeichert ist
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // Wenn ein Fehler beim Verifizieren des Tokens auftritt, wird der Zugriff verweigert
        if (err) {
            return res.status(401).json({ success: false, message: 'Benutzer nicht authentifiziert' });
        }

        // Wenn das Token gültig ist, wird der Benutzer (user) aus dem Token extrahiert
        // und in das req.user-Objekt eingefügt, damit die nachfolgenden Routen darauf zugreifen können
        req.user = user;

        // Ruft die nächste Middleware-Funktion auf, da der Token gültig ist
        next();
    });
}

// Exportiert die Middleware-Funktion, sodass sie in anderen Dateien verwendet werden kann
module.exports = authenticateUser;
