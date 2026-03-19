const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getAiSuggestions = async (req, res) => {
  const { resumeData } = req.body;
  try {
    const prompt = `Analyze the following resume data and provide 5-7 concise, professional suggestions to improve it for better visibility in a competitive job market.
    
    Data: ${JSON.stringify(resumeData)}
    
    Return as a clean JSON array of strings.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const suggestions = JSON.parse(response.choices[0].message.content);
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${req.file.mimetype};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" }
    });

    const extractedData = JSON.parse(response.choices[0].message.content);
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${req.file.mimetype};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" }
    });

    const results = JSON.parse(response.choices[0].message.content);
    res.json(results);
  } catch (err) {
    console.error('ATS Analysis Error:', err);
    res.status(500).json({ error: 'Failed to analyze resume for ATS' });
  }
};
