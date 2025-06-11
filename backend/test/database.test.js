require('dotenv').config();
const { connectDB, disconnectDB, getConnectionStatus } = require('../config/database');

/**
 * Test-Script für die Datenbankverbindung
 */
async function testDatabaseConnection() {
    console.log('🔄 Teste Datenbankverbindung...\n');
    
    try {
        // 1. Verbindung testen
        console.log('📡 Stelle Verbindung her...');
        await connectDB();
        
        // 2. Status überprüfen
        const status = getConnectionStatus();
        console.log('✅ Verbindung erfolgreich!');
        console.log('📊 Verbindungsdetails:');
        console.log(`   Host: ${status.host}`);
        console.log(`   Port: ${status.port}`);
        console.log(`   Datenbank: ${status.name}`);
        console.log(`   Status: ${status.isConnected ? 'Verbunden' : 'Getrennt'}`);
        console.log(`   ReadyState: ${status.readyState}`);        // 3. Collections auflisten (nur wenn keine Authentifizierung erforderlich)
        console.log('\n📂 Verfügbare Collections:');
        try {
            const mongoose = require('mongoose');
            const collections = await mongoose.connection.db.listCollections().toArray();
            
            if (collections.length === 0) {
                console.log('   Keine Collections gefunden');
            } else {
                for (const collection of collections) {
                    try {
                        const docCount = await mongoose.connection.db.collection(collection.name).countDocuments();
                        console.log(`   - ${collection.name} (${docCount} Dokumente)`);
                    } catch (countError) {
                        console.log(`   - ${collection.name} (Anzahl nicht verfügbar)`);
                    }
                }
            }
        } catch (listError) {
            console.log('   ⚠️  Collections können nicht aufgelistet werden (möglicherweise Authentifizierung erforderlich)');
            console.log(`   Details: ${listError.message}`);
        }
        
        // 4. Umgebungsvariablen überprüfen
        console.log('\n⚙️  Umgebungskonfiguration:');
        console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'nicht gesetzt'}`);
        console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ gesetzt' : '❌ nicht gesetzt'}`);
        console.log(`   DB_TIMEOUT: ${process.env.DB_TIMEOUT || 'Standard (5000)'}`);
        console.log(`   DB_MAX_RETRIES: ${process.env.DB_MAX_RETRIES || 'Standard (5)'}`);
        
        console.log('\n✅ Datenbanktest erfolgreich abgeschlossen!');
        
    } catch (error) {
        console.error('❌ Datenbanktest fehlgeschlagen:');
        console.error(`   Fehler: ${error.message}`);
        console.error(`   Stack: ${error.stack}`);
    } finally {
        // 5. Verbindung schließen
        console.log('\n🔌 Schließe Verbindung...');
        await disconnectDB();
        console.log('✅ Verbindung geschlossen');
        process.exit(0);
    }
}

// Test ausführen
if (require.main === module) {
    testDatabaseConnection();
}

module.exports = testDatabaseConnection;
