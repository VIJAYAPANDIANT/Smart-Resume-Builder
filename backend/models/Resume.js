const { getDb } = require('../config/db');

const Resume = {
  create: async (data) => {
    const db = getDb();
    const { userId, personalInfo, education, experience, skills, projects, template, atsScore, aiSuggestions } = data;
    
    const result = await db.run(
      `INSERT INTO resumes (
        userId, personalInfo, education, experience, skills, projects, template, atsScore, aiSuggestions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        JSON.stringify(personalInfo || {}),
        JSON.stringify(education || []),
        JSON.stringify(experience || []),
        JSON.stringify(skills || []),
        JSON.stringify(projects || []),
        template || 'modern',
        atsScore || 0,
        JSON.stringify(aiSuggestions || [])
      ]
    );
    return { id: result.lastID, ...data };
  },

  find: async (query) => {
    const db = getDb();
    const rows = await db.all('SELECT * FROM resumes WHERE userId = ? ORDER BY updatedAt DESC', [query.userId]);
    return rows.map(parseResume);
  },

  findById: async (id) => {
    const db = getDb();
    const row = await db.get('SELECT * FROM resumes WHERE id = ?', [id]);
    return row ? parseResume(row) : null;
  },

  findByIdAndUpdate: async (id, update, options) => {
    const db = getDb();
    const setClause = [];
    const params = [];
    
    const data = update.$set || update;

    for (const key in data) {
      if (['personalInfo', 'education', 'experience', 'skills', 'projects', 'aiSuggestions'].includes(key)) {
        setClause.push(`${key} = ?`);
        params.push(JSON.stringify(data[key]));
      } else if (['template', 'atsScore'].includes(key)) {
        setClause.push(`${key} = ?`);
        params.push(data[key]);
      }
    }

    if (setClause.length === 0) return await Resume.findById(id);

    setClause.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);

    await db.run(
      `UPDATE resumes SET ${setClause.join(', ')} WHERE id = ?`,
      params
    );

    return await Resume.findById(id);
  },

  findByIdAndDelete: async (id) => {
    const db = getDb();
    await db.run('DELETE FROM resumes WHERE id = ?', [id]);
  }
};

function parseResume(row) {
  return {
    ...row,
    personalInfo: JSON.parse(row.personalInfo || '{}'),
    education: JSON.parse(row.education || '[]'),
    experience: JSON.parse(row.experience || '[]'),
    skills: JSON.parse(row.skills || '[]'),
    projects: JSON.parse(row.projects || '[]'),
    aiSuggestions: JSON.parse(row.aiSuggestions || '[]')
  };
}

module.exports = Resume;
