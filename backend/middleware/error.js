const { logError } = require('../utils/logger');

// Zentrale Fehlerbehandlung
const errorHandler = (err, req, res, next) => {
    // Log des Fehlers
    logError('Anwendungsfehler aufgetreten', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Mongoose Validierungsfehler
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: true,
            message: 'Validierungsfehler',
            errors: Object.values(err.errors).map(error => ({
                field: error.path,
                message: error.message
            }))
        });
    }

    // JWT Fehler
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: true,
            message: 'Ungültiger Token'
        });
    }

    // Token abgelaufen
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: true,
            message: 'Token abgelaufen'
        });
    }

    // Mongoose Cast Error (ungültige ID)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: true,
            message: 'Ungültiges Datenformat'
        });
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        return res.status(409).json({
            error: true,
            message: 'Diese E-Mail-Adresse ist bereits registriert'
        });
    }

    // Standard-Fehlerantwort
    res.status(err.status || 500).json({
        error: true,
        message: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'Ein interner Serverfehler ist aufgetreten'
    });
};

// 404 Handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: true,
        message: 'Die angeforderte Resource wurde nicht gefunden'
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};
