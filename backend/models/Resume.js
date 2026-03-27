const { getDb } = require('../config/db');

const Resume = {
  create: async (data) => {
    const supabase = getDb();
    const { data: result, error } = await supabase
      .from('resumes')
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  find: async (query) => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('userId', query.userId)
      .order('updatedAt', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  findById: async (id) => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  findByIdAndUpdate: async (id, update, options) => {
    const supabase = getDb();
    const data = update.$set || update;
    
    const { data: result, error } = await supabase
      .from('resumes')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  findByIdAndDelete: async (id) => {
    const supabase = getDb();
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

module.exports = Resume;
