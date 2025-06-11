const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utilities');
const { getAllTransactions, createTransaction, deleteTransaction } = require('../controllers/transactions');
const upload = require('../middleware/upload');

// Alle Transaktionen abrufen
router.get('/', authenticateToken, getAllTransactions);

// Neue Transaktion erstellen
router.post('/', authenticateToken, (req, res, next) => {
    console.log('Auth Headers:', req.headers);
    console.log('User:', req.user);
    next();
}, upload.single('receipt'), createTransaction);

// Transaktion löschen
router.delete('/:transactionId', authenticateToken, deleteTransaction);

module.exports = router;
