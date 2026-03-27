const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = await User.create({ email, password });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error('AUTH REGISTER ERROR:', err.message);
    res.status(500).json({ 
        msg: 'Server Error', 
        details: err.message,
        hint: 'Did you run schema.sql in Supabase?' 
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error('AUTH LOGIN ERROR:', err.message);
    res.status(500).json({ 
        msg: 'Server Error', 
        details: err.message 
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) delete user.password;
    res.json(user);
  } catch (err) {
    console.error('AUTH GETUSER ERROR:', err.message);
    res.status(500).json({ 
        msg: 'Server Error', 
        details: err.message 
    });
  }
};
