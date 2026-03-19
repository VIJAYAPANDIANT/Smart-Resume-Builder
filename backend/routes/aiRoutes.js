const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/suggestions', auth, aiController.getAiSuggestions);
router.post('/ats-score', auth, aiController.getAtsScore);
router.post('/analyze-ats-image', auth, upload.single('resumeImage'), aiController.analyzeAtsImage);
router.post('/parse', auth, upload.single('resumeImage'), aiController.parseResumeImage);

module.exports = router;
