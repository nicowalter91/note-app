const mongoose = require('mongoose');
require('dotenv').config();

// Temporäre In-Memory MongoDB für Development ohne Authentifizierung
class TempDatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connection = null;
  }

  async connect() {
    try {
      // Versuche verschiedene MongoDB URIs ohne Authentifizierung
      const uris = [
        'mongodb://127.0.0.1:27017/note-app-dev',
        'mongodb://localhost:27017/note-app-dev',
        'mongodb://127.0.0.1:27018/note-app-dev', // Alternative Port
      ];

      for (const uri of uris) {
        try {
          console.log(`🔄 Versuche Verbindung zu: ${uri}`);
          
          const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000,
            connectTimeoutMS: 3000,
            socketTimeoutMS: 3000,
          });
          
          this.connection = conn;
          this.isConnected = true;
          
          console.log(`✅ Erfolgreich verbunden mit: ${uri}`);
          console.log(`Database: ${conn.connection.name}`);
          
          // Test-Benutzer erstellen falls nicht vorhanden
          await this.createTestUser();
          
          return conn;
          
        } catch (err) {
          console.log(`❌ Verbindung zu ${uri} fehlgeschlagen: ${err.message}`);
          continue;
        }
      }
      
      throw new Error('Keine MongoDB-Instanz ohne Authentifizierung gefunden');
      
    } catch (error) {
      console.error('Alle Verbindungsversuche fehlgeschlagen:', error.message);
      throw error;
    }
  }

  async createTestUser() {
    try {
      const User = require('../models/user.model');
      const bcrypt = require('bcrypt');
      
      // Prüfe ob Test-Benutzer bereits existiert
      const existingUser = await User.findOne({ email: 'test@example.com' });
      
      if (!existingUser) {
        console.log('🔄 Erstelle Test-Benutzer...');
        
        const hashedPassword = await bcrypt.hash('test123', 10);
        const testUser = new User({
          fullName: 'Test User',
          email: 'test@example.com',
          password: hashedPassword,
          refreshTokens: []
        });
        
        await testUser.save();
        console.log('✅ Test-Benutzer erfolgreich erstellt');
        console.log('   Email: test@example.com');
        console.log('   Password: test123');
      } else {
        console.log('ℹ️  Test-Benutzer existiert bereits');
      }
      
      // Liste alle Benutzer auf
      const users = await User.find({}, 'fullName email createdOn').limit(5);
      console.log(`\n📋 Benutzer in der Datenbank (${users.length}):`);
      users.forEach(user => {
        console.log(`   - ${user.fullName} (${user.email})`);
      });
      
    } catch (error) {
      console.error('❌ Fehler beim Erstellen des Test-Benutzers:', error.message);
    }
  }

  async disconnect() {
    if (this.isConnected && this.connection) {
      await this.connection.disconnect();
      this.isConnected = false;
      console.log('🔌 Datenbankverbindung geschlossen');
    }
  }

  getConnectionStatus() {
    if (!this.isConnected) {
      return { isConnected: false };
    }
    
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
const tempDbConnection = new TempDatabaseConnection();

module.exports = {
  connectTempDB: () => tempDbConnection.connect(),
  disconnectTempDB: () => tempDbConnection.disconnect(),
  getTempConnectionStatus: () => tempDbConnection.getConnectionStatus()
};
