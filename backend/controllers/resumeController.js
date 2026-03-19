const Resume = require('../models/Resume');

exports.createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      userId: req.user.id
    });
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id });
    res.json(resumes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ msg: 'Resume not found' });
    if (resume.userId != req.user.id) return res.status(401).json({ msg: 'Unauthorized' });
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateResume = async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ msg: 'Resume not found' });
    if (resume.userId != req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

    resume = await Resume.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ msg: 'Resume not found' });
    if (resume.userId != req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Resume removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
