const { getDb } = require('../config/db');

const Resume = {
  create: async (data) => {
    const pool = getDb();
    const keys = Object.keys(data).filter(k => data[k] !== undefined);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const values = keys.map(k => {
      const val = data[k];
      return typeof val === 'object' && val !== null ? JSON.stringify(val) : val;
    });

    const queryText = `INSERT INTO resumes (${columns}) VALUES (${placeholders}) RETURNING *`;
    const res = await pool.query(queryText, values);
    return res.rows[0];
  },

  find: async (query) => {
    const pool = getDb();
    const res = await pool.query(
      'SELECT * FROM resumes WHERE "userId" = $1 ORDER BY "updatedAt" DESC',
      [query.userId]
    );
    return res.rows;
  },

  findById: async (id) => {
    const pool = getDb();
    const res = await pool.query('SELECT * FROM resumes WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  findByIdAndUpdate: async (id, update, options) => {
    const pool = getDb();
    const data = update.$set || update;
    
    const keys = Object.keys(data).filter(k => data[k] !== undefined && k !== 'id');
    if (keys.length === 0) {
      return await Resume.findById(id);
    }
    
    const setClause = keys.map((k, i) => `"${k}" = $${i + 2}`).join(', ');
    const values = keys.map(k => {
      const val = data[k];
      return typeof val === 'object' && val !== null ? JSON.stringify(val) : val;
    });
    
    const queryText = `UPDATE resumes SET ${setClause}, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    const res = await pool.query(queryText, [id, ...values]);
    return res.rows[0];
  },

  findByIdAndDelete: async (id) => {
    const pool = getDb();
    await pool.query('DELETE FROM resumes WHERE id = $1', [id]);
  }
};

module.exports = Resume;
