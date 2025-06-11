const { getConnectionStatus } = require('../config/database');

/**
 * Middleware zur Überprüfung der Datenbankverbindung
 */
const checkDatabaseConnection = (req, res, next) => {
    const status = getConnectionStatus();
    
    if (!status.isConnected) {
        return res.status(503).json({
            error: true,
            message: 'Datenbankverbindung nicht verfügbar',
            details: 'Der Service ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.'
        });
    }
    
    next();
};

/**
 * Health Check Endpoint für die Datenbank
 */
const databaseHealthCheck = (req, res) => {
    const status = getConnectionStatus();
    
    const healthStatus = {
        status: status.isConnected ? 'healthy' : 'unhealthy',
        database: {
            connected: status.isConnected,
            readyState: status.readyState,
            host: status.host,
            port: status.port,
            name: status.name
        },
        timestamp: new Date().toISOString()
    };

    const httpStatus = status.isConnected ? 200 : 503;
    res.status(httpStatus).json(healthStatus);
};

/**
 * Datenbankverbindungsstatistiken
 */
const getDatabaseStats = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const status = getConnectionStatus();
        
        if (!status.isConnected) {
            return res.status(503).json({
                error: true,
                message: 'Datenbankverbindung nicht verfügbar'
            });
        }

        const stats = {
            connection: status,
            collections: {},
            indexes: {},
            totalDocuments: 0
        };

        // Sammle Statistiken für alle Collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        for (const collection of collections) {
            const collectionName = collection.name;
            const coll = mongoose.connection.db.collection(collectionName);
            
            // Dokumentenanzahl
            const docCount = await coll.countDocuments();
            stats.collections[collectionName] = {
                documents: docCount,
                name: collectionName
            };
            stats.totalDocuments += docCount;
            
            // Index-Informationen
            const indexes = await coll.indexes();
            stats.indexes[collectionName] = indexes;
        }

        res.json({
            error: false,
            data: stats,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Fehler beim Abrufen der Datenbankstatistiken',
            details: error.message
        });
    }
};

module.exports = {
    checkDatabaseConnection,
    databaseHealthCheck,
    getDatabaseStats
};
