const express = require('express');
const router = express.Router();
const { 
    databaseHealthCheck, 
    getDatabaseStats 
} = require('../middleware/database');

// Health Check Endpoint
router.get('/health', databaseHealthCheck);

// Datenbankstatistiken (nur für authentifizierte Benutzer)
router.get('/stats', getDatabaseStats);

// Verbindungsinfo
router.get('/info', (req, res) => {
    const { getConnectionStatus } = require('../config/database');
    const status = getConnectionStatus();
    
    res.json({
        error: false,
        data: {
            connected: status.isConnected,
            database: status.name,
            host: status.host,
            port: status.port,
            environment: process.env.NODE_ENV || 'development'
        }
    });
});

module.exports = router;
