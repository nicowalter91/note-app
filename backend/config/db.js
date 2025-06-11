const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    // Verbesserte Reconnect-Optionen
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    // Verbesserte Timeout-Einstellungen
    connectTimeoutMS: 10000,
    // Heartbeat für stabile Verbindungen
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
  };
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI ist nicht in der Umgebungsvariable definiert');
    }    const { logInfo, logError, logDebug } = require('../utils/logger');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    logInfo(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection errors after initial connection
    mongoose.connection.on('error', err => {
      logError('MongoDB connection error', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      logDebug('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logInfo('MongoDB reconnected');
    });
  } catch (error) {
    console.error('Fehler beim Verbinden mit MongoDB:', error);
    // Automatischer Reconnect-Versuch nach 5 Sekunden
    setTimeout(() => {
      console.log('Versuche erneut, eine Verbindung herzustellen...');
      connectDB();
    }, 5000);
    // Wenn im Produktionsmodus, beende den Prozess
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
