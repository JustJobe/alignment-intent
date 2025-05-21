// /api/generate-alignment.js
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { person, context, action } = req.body;

  const prompt = `You are a creative alignment analyst using the D&D moral alignment chart.
Your task is to analyze the action of a person from all nine alignments.
Include three parts for each:
1. Motivation
2. Genius motivation
3. Incompetence motivation

Person: ${person}
Context: ${context || "(no context)"}
Action: ${action}

Return a JSON array of 9 objects like this:
[
  {
    "alignment": "Lawful Good",
    "nickname": "The Crusader",
    "motivation": "...",
    "genius": "...",
    "incompetence": "..."
  },
  ...
]`.trim();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You generate D&D alignment interpretations." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
    });

    const raw = response.choices[0].message.content;
    console.log("RAW GPT OUTPUT:\n", raw);
    const start = raw.indexOf("[");
    if (start === -1) {
      throw new Error("GPT response does not contain a JSON array.");
    }
    const parsed = JSON.parse(raw.slice(start));
    if (!Array.isArray(parsed)) {
      throw new Error("Parsed result is not an array.");
    }
    return res.status(200).json(parsed);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({
      error: "Failed to generate alignment.",
      detail: error.message || "Unexpected error"
    });
  }
};
