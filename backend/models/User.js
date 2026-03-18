const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');

const User = {
  findOne: async ({ email }) => {
    const db = getDb();
    return await db.get('SELECT * FROM users WHERE email = ?', [email]);
  },

  findById: async (id) => {
    const db = getDb();
    return await db.get('SELECT * FROM users WHERE id = ?', [id]);
  },

  create: async ({ email, password }) => {
    const db = getDb();
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    return { id: result.lastID, email };
  },

  comparePassword: async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};

module.exports = User;
