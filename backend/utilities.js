const jwt = require('jsonwebtoken');
const { logDebug, logError } = require('./utils/logger');

function authenticateToken(req, res, next) {
    // Logging der Request-Details (ohne sensitive Daten)
    logDebug('Neue Authentifizierungsanfrage', {
        method: req.method,
        path: req.path,
        ip: req.ip
    });
    
    const authHeader = req.headers["authorization"];
    
    const token = authHeader && authHeader.split(" ")[1];    if (!token) {
        logDebug('Authentifizierung fehlgeschlagen: Kein Token vorhanden');
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            logError('Token-Validierungsfehler', { 
                error: err.name,
                message: err.message 
            });
            return res.status(401).json({ message: 'Invalid token' });
        }

        logDebug('Benutzer erfolgreich authentifiziert', { 
            userId: user._id,
            email: user.email 
        });
        
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
