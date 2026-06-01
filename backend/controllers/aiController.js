const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.getAiSuggestions = async (req, res) => {
  const { resumeData } = req.body;
  try {
    const prompt = `Analyze the following resume data and provide 5-7 concise, professional suggestions to improve it for better visibility in a competitive job market.
    
    Data: ${JSON.stringify(resumeData)}
    
    Return as a clean JSON array of strings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const suggestions = JSON.parse(response.text);
    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI processing failed' });
  }
};

exports.getAtsScore = async (req, res) => {
  const { resumeData, targetKeywords } = req.body;
  try {
    const prompt = `Calculate an ATS Match Score (0-100) for the following resume against these keywords: ${targetKeywords.join(', ')}. 
    Briefly explain why (max 100 words).
    
    Resume: ${JSON.stringify(resumeData)}
    
    Return JSON format: { "score": number, "explanation": string }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ATS scoring failed' });
  }
};

exports.parseResumeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const prompt = `Analyze this resume image and extract all professional information. 
    Map it EXACTLY to this JSON structure:
    {
      "personalInfo": {
        "fullName": "",
        "title": "",
        "email": "",
        "phone": "",
        "location": "",
        "summary": "",
        "linkedin": "",
        "github": "",
        "profilePic": "",
        "languages": "",
        "hobbies": ""
      },
      "education": [{ "school": "", "degree": "", "startDate": "", "endDate": "", "description": "" }],
      "experience": [{ "company": "", "position": "", "startDate": "", "endDate": "", "description": "" }],
      "skills": [],
      "projects": [{ "name": "", "description": "", "link": "" }]
    }
    If a field is missing, leave it as an empty string or empty array. Return ONLY the JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: req.file.mimetype
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const extractedData = JSON.parse(response.text);
    res.json(extractedData);
  } catch (err) {
    console.error('AI Parsing Error:', err);
    res.status(500).json({ error: 'Failed to parse resume image' });
  }
};

exports.analyzeAtsImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const prompt = `Analyze this resume image as an expert ATS (Applicant Tracking System) and professional recruiter. 
    1. Extract the main text (essential for analysis).
    2. Evaluate the resume based on:
       - Formatting & Layout (is it easy for an ATS to read? e.g., no complex columns, icons that block text, etc.)
       - Content Quality (quantifiable achievements, strong action verbs)
       - Professionalism and relevant section coverage.
    3. Calculate an overall ATS Score (0-100).
    4. Provide specific Strengths, Weaknesses, and Key Recommendations.

    Return EXACTLY in this JSON format:
    {
      "score": number,
      "feedback": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "recommendations": ["string"]
      },
      "summary": "a brief 2-sentence summary of the overall profile"
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: req.file.mimetype
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const results = JSON.parse(response.text);
    res.json(results);
  } catch (err) {
    console.error('ATS Analysis Error:', err);
    res.status(500).json({ error: 'Failed to analyze resume for ATS' });
  }
};

exports.tailorResumeForJob = async (req, res) => {
  const { resumeId, jobDescription, jobTitle, companyName } = req.body;
  try {
    const Resume = require('../models/Resume');
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    if (resume.userId !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    const prompt = `You are an AI expert recruiter and job application advisor. 
    Analyze the following resume data against the job description for the role of "${jobTitle}" at "${companyName}".
    
    Resume Data:
    ${JSON.stringify(resume)}
    
    Job Description:
    ${jobDescription}
    
    Tasks:
    1. Calculate a match score (0 to 100) representing how well the resume matches the job requirements.
    2. Identify key matching keywords/skills that are present in both the resume and the job description.
    3. Identify missing critical keywords/skills that are in the job description but not in the resume.
    4. Provide 3-5 specific, actionable recommendations on how the user can edit their resume experience or skills sections to better align with the job.
    5. Write a highly tailored, compelling, professional cover letter (approx. 250-350 words) from the user's perspective, highlighting matching experiences and projects from their resume, addressed to the hiring manager at "${companyName}".
    
    Return the response EXACTLY in this JSON format:
    {
      "matchScore": number,
      "matches": ["string"],
      "gaps": ["string"],
      "recommendations": ["string"],
      "coverLetter": "string"
    }
    Ensure the JSON is clean and strictly valid. Do not wrap with anything other than the JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (err) {
    console.error('Job Tailor Error:', err);
    res.status(500).json({ error: 'Failed to tailor resume' });
  }
};

