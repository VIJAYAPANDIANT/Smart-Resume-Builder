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
