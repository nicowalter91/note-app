const mongoose = require('mongoose');
require('dotenv').config();

// Einfache Verbindung ohne Authentifizierung
const connectWithoutAuth = async () => {
  try {
    // Verbindung zu MongoDB ohne Authentifizierung
    const uri = 'mongodb://127.0.0.1:27017/note-app';
    
    console.log('🔄 Versuche Verbindung ohne Authentifizierung...');
    console.log('URI:', uri);
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    });
    
    console.log('✅ Verbindung erfolgreich!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Port: ${conn.connection.port}`);
    console.log(`Datenbank: ${conn.connection.name}`);
    
    // Test: Benutzer erstellen
    const User = require('../models/user.model');
    const bcrypt = require('bcrypt');
    
    console.log('\n🔄 Erstelle Test-Benutzer...');
    
    // Prüfe ob Benutzer bereits existiert
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('⚠️  Test-Benutzer existiert bereits');
    } else {
      // Erstelle neuen Test-Benutzer
      const hashedPassword = await bcrypt.hash('test123', 10);
      const testUser = new User({
        fullName: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        refreshTokens: []
      });
      
      await testUser.save();
      console.log('✅ Test-Benutzer erfolgreich erstellt');
    }
    
    // Liste alle Benutzer auf
    const users = await User.find({}, 'fullName email createdOn');
    console.log('\n📋 Alle Benutzer in der Datenbank:');
    users.forEach(user => {
      console.log(`- ${user.fullName} (${user.email}) - erstellt: ${user.createdOn}`);
    });
    
    return conn;
    
  } catch (error) {
    console.error('❌ Verbindungsfehler:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
};

// Script ausführen
if (require.main === module) {
  connectWithoutAuth()
    .then(() => {
      console.log('\n✅ Script erfolgreich abgeschlossen');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script fehlgeschlagen:', error.message);
      process.exit(1);
    });
}

module.exports = connectWithoutAuth;
