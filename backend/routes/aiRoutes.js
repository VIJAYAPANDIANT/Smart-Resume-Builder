const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/suggestions', auth, aiController.getAiSuggestions);
router.post('/ats-score', auth, aiController.getAtsScore);

module.exports = router;
