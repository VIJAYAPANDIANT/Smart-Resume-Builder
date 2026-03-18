const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/auth');

router.post('/', auth, resumeController.createResume);
router.get('/', auth, resumeController.getResumes);
router.get('/:id', auth, resumeController.getResumeById);
router.put('/:id', auth, resumeController.updateResume);
router.delete('/:id', auth, resumeController.deleteResume);

module.exports = router;
