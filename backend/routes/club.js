const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club');
const { authenticateToken } = require('../utilities');

router.post('/club-settings', authenticateToken, clubController.saveClubSettings);
router.get('/club-settings', authenticateToken, clubController.getClubSettings);

module.exports = router;
