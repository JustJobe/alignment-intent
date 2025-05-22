const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { person, context, action, model } = req.body;

  if (!person || !action) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `
Generate alignment-based motivations for the following scenario:

Person: ${person}
Context: ${context || 'No specific context'}
Action: ${action}

For each of the 9 Dungeons & Dragons alignments (Lawful Good, Neutral Good, Chaotic Good, Lawful Neutral, True Neutral, Chaotic Neutral, Lawful Evil, Neutral Evil, Chaotic Evil), provide:

1. A general motivation this person would have under that alignment.
2. A genius motivation — the motivation to do so assuming extreme competence in the subject matter.
3. An incompetant motivation — a flawed motivation assuming poor competence in the subject matter.

Try to use humor and be creative. Keep each answer rooted in the identity of the person and their context — do not generalize based on the alignment archetypes alone. Prioritize emotional realism, social relevance, or professional stakes.
Return your output as a JSON array of 9 objects, each with "alignment", "nickname", "motivation", "genius", and "incompetence".
`;

  try {
    const response = await openai.chat.completions.create({
      model: model || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at ethical reasoning and narrative alignment analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 1.5
    });

    const rawText = response.choices[0].message.content;
    let jsonStart = rawText.indexOf("[");
    let jsonEnd = rawText.lastIndexOf("]") + 1;
    let jsonString = rawText.slice(jsonStart, jsonEnd);
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      parsed = null;
    }

    if (!parsed || !Array.isArray(parsed)) {
      return res.status(500).json({ error: "Failed to parse GPT response" });
    }

    res.status(200).json(parsed);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch GPT results" });
  }
};
