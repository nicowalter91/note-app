const winston = require('winston');
const path = require('path');

// Log-Levels definieren
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// Log-Level basierend auf der Umgebung
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'warn';
};

// Farben für verschiedene Log-Level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
};

// Füge die Farben zu winston hinzu
winston.addColors(colors);

// Log-Format definieren
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(
        (info) => {
            const { timestamp, level, message, ...meta } = info;
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
            return `${timestamp} [${level.toUpperCase()}] ${message} ${metaStr}`;
        }
    )
);

// Console-Transport mit Farben
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    format
);

// Logging-Verzeichnis erstellen
const logsDir = path.join(__dirname, '../logs');

// Logger erstellen
const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports: [
        // Fehler in separate Datei schreiben
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Alle Logs in eine Datei schreiben
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Console-Output für Entwicklung
        new winston.transports.Console({
            format: consoleFormat
        })
    ]
});

// Produktionsumgebung: Nur Fehler in der Konsole ausgeben
if (process.env.NODE_ENV === 'production') {
    logger.transports.find(t => t instanceof winston.transports.Console).level = 'error';
}

// Hilfsfunktionen für verschiedene Log-Level
const logError = (message, meta = {}) => {
    // Entferne sensitive Daten
    const sanitizedMeta = { ...meta };
    delete sanitizedMeta.password;
    delete sanitizedMeta.token;
    delete sanitizedMeta.refreshToken;
    delete sanitizedMeta.accessToken;
    
    logger.error(message, sanitizedMeta);
};

const logInfo = (message, meta = {}) => {
    const sanitizedMeta = { ...meta };
    delete sanitizedMeta.password;
    delete sanitizedMeta.token;
    delete sanitizedMeta.refreshToken;
    delete sanitizedMeta.accessToken;
    
    logger.info(message, sanitizedMeta);
};

const logDebug = (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
        const sanitizedMeta = { ...meta };
        delete sanitizedMeta.password;
        delete sanitizedMeta.token;
        delete sanitizedMeta.refreshToken;
        delete sanitizedMeta.accessToken;
        
        logger.debug(message, sanitizedMeta);
    }
};

const logHttp = (message, meta = {}) => {
    const sanitizedMeta = { ...meta };
    delete sanitizedMeta.password;
    delete sanitizedMeta.token;
    delete sanitizedMeta.refreshToken;
    delete sanitizedMeta.accessToken;
    
    logger.http(message, sanitizedMeta);
};

const logWarn = (message, meta = {}) => {
    const sanitizedMeta = { ...meta };
    delete sanitizedMeta.password;
    delete sanitizedMeta.token;
    delete sanitizedMeta.refreshToken;
    delete sanitizedMeta.accessToken;
    
    logger.warn(message, sanitizedMeta);
};

module.exports = {
    logger,
    logError,
    logInfo,
    logDebug,
    logHttp,
    logWarn
};
