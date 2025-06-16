// Importiert das jsonwebtoken-Modul, um JSON Web Tokens (JWTs) zu verifizieren
const jwt = require('jsonwebtoken');

// Middleware-Funktion zur Authentifizierung von Benutzern anhand eines Tokens
function authenticateToken(req, res, next) {
    console.log("authenticateToken called for:", req.method, req.path);
    // Überprüft, ob ein "Authorization"-Header in der Anfrage vorhanden ist
    const authHeader = req.headers["authorization"];
    console.log("Authorization header:", authHeader);
    // Extrahiert den Token aus dem Authorization-Header, der im Format "Bearer <token>" sein sollte
    const token = authHeader && authHeader.split(" ")[1];
    console.log("Extracted token:", token ? "Token present" : "No token");

    // Wenn kein Token vorhanden ist, wird der Zugriff verweigert (Status 401 Unauthorized)
    if (!token) {
        console.log("No token found, returning 401");
        return res.sendStatus(401);
    }

    // Überprüft das Token mit dem SECRET-Schlüssel, der in der Umgebungsvariable gespeichert ist
    console.log("Verifying token with secret:", process.env.ACCESS_TOKEN_SECRET ? "Secret present" : "No secret");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // Wenn ein Fehler beim Verifizieren des Tokens auftritt, wird der Zugriff verweigert
        if (err) {
            console.log("Token verification failed:", err.message);
            return res.sendStatus(401);
        }

        console.log("Token verified successfully, user:", user);
        // Wenn das Token gültig ist, wird der Benutzer (user) aus dem Token extrahiert
        // und in das req.user-Objekt eingefügt, damit die nachfolgenden Routen darauf zugreifen können
        req.user = user;

        // Ruft die nächste Middleware-Funktion auf, da der Token gültig ist
        next();
    });
}

// Exportiert die Middleware-Funktion, sodass sie in anderen Dateien verwendet werden kann
module.exports = {
    authenticateToken
};
