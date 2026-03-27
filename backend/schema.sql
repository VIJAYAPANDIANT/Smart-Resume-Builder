-- Supabase Schema for Smart Resume Builder

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id),
  "personalInfo" JSONB,
  education JSONB,
  experience JSONB,
  skills JSONB,
  projects JSONB,
  template TEXT DEFAULT 'modern',
  "atsScore" INTEGER DEFAULT 0,
  "aiSuggestions" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (optional but recommended)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
