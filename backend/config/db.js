const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
  };

  try {
    // Überprüfung der Umgebungsvariablen
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI ist nicht in der .env-Datei definiert');
    }

    const { logInfo, logError, logDebug } = require('../utils/logger');
    
    // Verbindung zur MongoDB herstellen
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    logInfo(`MongoDB erfolgreich verbunden: ${conn.connection.host}`);
    logInfo(`Datenbank: ${conn.connection.name}`);
    logInfo(`Port: ${conn.connection.port}`);

    // Event-Listener für Verbindungsereignisse
    mongoose.connection.on('error', (err) => {
      logError('MongoDB Verbindungsfehler:', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      logDebug('MongoDB Verbindung unterbrochen. Versuche Wiederverbindung...');
    });

    mongoose.connection.on('reconnected', () => {
      logInfo('MongoDB erfolgreich wiederverbunden');
    });

    mongoose.connection.on('connected', () => {
      logInfo('MongoDB Verbindung hergestellt');
    });

    return conn;

  } catch (error) {
    const errorMessage = `Fehler beim Verbinden mit MongoDB: ${error.message}`;
    console.error(errorMessage);
    
    // Im Entwicklungsmodus: Automatischer Reconnect-Versuch
    if (process.env.NODE_ENV !== 'production') {
      console.log('Entwicklungsmodus: Versuche Wiederverbindung in 5 Sekunden...');
      setTimeout(() => {
        connectDB();
      }, 5000);
    } else {
      // Im Produktionsmodus: Prozess beenden
      console.error('Produktionsmodus: Beende Anwendung aufgrund von Datenbankverbindungsfehler');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
