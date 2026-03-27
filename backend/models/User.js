const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');

const User = {
  findOne: async ({ email }) => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  findById: async (id) => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async ({ email, password }) => {
    const supabase = getDb();
    const hashedPassword = await bcrypt.hash(password, 12);
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }])
      .select('id, email')
      .single();
    
    if (error) throw error;
    return data;
  },

  comparePassword: async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};

module.exports = User;
