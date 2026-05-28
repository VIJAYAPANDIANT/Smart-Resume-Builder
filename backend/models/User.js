const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');

const User = {
  findOne: async ({ email }) => {
    const pool = getDb();
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] || null;
  },

  findById: async (id) => {
    const pool = getDb();
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  create: async ({ email, password }) => {
    const pool = getDb();
    const hashedPassword = await bcrypt.hash(password, 12);
    const res = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    return res.rows[0];
  },

  comparePassword: async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};

module.exports = User;
