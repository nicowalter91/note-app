const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// MongoDB-Verbindung herstellen
async function createTestUser() {
  try {
    console.log('🔄 Verbinde zu MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB-Verbindung erfolgreich');
    
    // User Model laden
    const User = require('../models/user.model');
    
    // Prüfe ob Test-Benutzer bereits existiert
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('⚠️  Test-Benutzer existiert bereits');
      console.log('   Email: test@example.com');
      console.log('   Name:', existingUser.fullName);
    } else {
      console.log('🔄 Erstelle Test-Benutzer...');
      
      // Passwort hashen
      const hashedPassword = await bcrypt.hash('test123', 10);
      
      // Test-Benutzer erstellen
      const testUser = new User({
        fullName: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        refreshTokens: []
      });
      
      await testUser.save();
      
      console.log('✅ Test-Benutzer erfolgreich erstellt!');
      console.log('   Email: test@example.com');
      console.log('   Password: test123');
      console.log('   ID:', testUser._id);
    }
    
    // Liste alle Benutzer auf
    const users = await User.find({}, 'fullName email createdOn').limit(10);
    console.log(`\n📋 Alle Benutzer (${users.length}):`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.fullName} (${user.email}) - ${user.createdOn.toLocaleDateString()}`);
    });
    
    console.log('\n✅ Script erfolgreich abgeschlossen');
    
  } catch (error) {
    console.error('❌ Fehler:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Verbindung schließen
    await mongoose.disconnect();
    console.log('🔌 MongoDB-Verbindung geschlossen');
  }
}

// Script ausführen
if (require.main === module) {
  createTestUser()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = createTestUser;
