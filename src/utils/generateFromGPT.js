export async function generateFromGPT(person, context, action) {
  const prompt = `
You are a creative alignment analyst using the D&D moral alignment chart.
Your task is to analyze the action of a person from all nine alignments.
Include three parts for each:
1. Motivation
2. Genius motivation
3. Incompetence motivation

Person: ${person}
Context: ${context || "(no additional context)"}
Action: ${action}

Return a JSON array of 9 objects in this format:
[
  {
    "alignment": "Lawful Good",
    "nickname": "The Crusader",
    "motivation": "...",
    "genius": "...",
    "incompetence": "..."
  },
  ...
]
  `.trim();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You generate moral alignment motivations using the D&D chart." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
    }),
  });

  const data = await response.json();
  try {
    const jsonStart = data.choices[0].message.content.indexOf("[");
    const parsed = JSON.parse(data.choices[0].message.content.slice(jsonStart));
    return parsed;
  } catch (err) {
    console.error("Failed to parse GPT response", data);
    throw err;
  }
}
