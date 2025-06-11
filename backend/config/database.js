const mongoose = require('mongoose');
require('dotenv').config();

// Datenbankoptionen basierend auf Umgebungsvariablen
const getDatabaseConfig = () => {
  return {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/note-app',
    options: {
      serverSelectionTimeoutMS: parseInt(process.env.DB_TIMEOUT || '5000'),
      socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT || '45000'),
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
      connectTimeoutMS: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000'),
      heartbeatFrequencyMS: parseInt(process.env.DB_HEARTBEAT_FREQUENCY || '10000'),
      retryWrites: process.env.DB_RETRY_WRITES !== 'false',
      bufferCommands: process.env.DB_BUFFER_COMMANDS !== 'false',
    }
  };
};

// Erweiterte Datenbankverbindung mit Retry-Logik
class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = parseInt(process.env.DB_MAX_RETRIES || '5');
    this.retryDelay = parseInt(process.env.DB_RETRY_DELAY || '5000');
  }

  async connect() {
    const config = getDatabaseConfig();
    const { logInfo, logError, logWarn } = require('../utils/logger');

    try {
      // Überprüfung der erforderlichen Umgebungsvariablen
      if (!config.uri) {
        throw new Error('MONGODB_URI muss in der .env-Datei definiert sein');
      }

      logInfo('Stelle Verbindung zur MongoDB her...', {
        uri: config.uri.replace(/\/\/.*@/, '//***:***@'), // Passwort verbergen
        database: config.uri.split('/').pop(),
      });

      const connection = await mongoose.connect(config.uri, config.options);
      
      this.isConnected = true;
      this.retryCount = 0;

      logInfo('MongoDB Verbindung erfolgreich hergestellt', {
        host: connection.connection.host,
        port: connection.connection.port,
        database: connection.connection.name,
        readyState: connection.connection.readyState
      });

      this.setupEventListeners();
      return connection;

    } catch (error) {
      logError('Fehler beim Verbinden mit MongoDB', {
        error: error.message,
        retryCount: this.retryCount,
        maxRetries: this.maxRetries
      });

      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        logWarn(`Wiederverbindungsversuch ${this.retryCount}/${this.maxRetries} in ${this.retryDelay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.connect();
      } else {
        logError('Maximale Anzahl der Wiederverbindungsversuche erreicht');
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
        throw error;
      }
    }
  }

  setupEventListeners() {
    const { logInfo, logError, logWarn } = require('../utils/logger');

    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      logInfo('MongoDB Verbindung hergestellt');
    });

    mongoose.connection.on('error', (err) => {
      this.isConnected = false;
      logError('MongoDB Verbindungsfehler', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      logWarn('MongoDB Verbindung unterbrochen');
    });

    mongoose.connection.on('reconnected', () => {
      this.isConnected = true;
      logInfo('MongoDB Wiederverbindung erfolgreich');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logInfo('MongoDB Verbindung durch SIGINT geschlossen');
        process.exit(0);
      } catch (error) {
        logError('Fehler beim Schließen der MongoDB Verbindung', { error: error.message });
        process.exit(1);
      }
    });
  }

  async disconnect() {
    const { logInfo } = require('../utils/logger');
    
    if (this.isConnected) {
      await mongoose.connection.close();
      this.isConnected = false;
      logInfo('MongoDB Verbindung geschlossen');
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }
}

// Singleton-Instanz
const dbConnection = new DatabaseConnection();

module.exports = {
  connectDB: () => dbConnection.connect(),
  disconnectDB: () => dbConnection.disconnect(),
  getConnectionStatus: () => dbConnection.getConnectionStatus(),
  getDatabaseConfig
};
