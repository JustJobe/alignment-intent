// api/generate-alignment.js
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cacheFile = path.resolve(process.cwd(), "cached-examples.json");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { person, context, action, model } = req.body;
  if (!person || !action) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `Generate a JSON array of 9 objects representing each alignment from D&D's moral alignment chart (Lawful Good to Chaotic Evil).
Each object should contain:
- alignment
- nickname (a brief title for the persona)
- motivation (why this person did the action)
- genius (how the action showcases brilliance)
- incompetence (how the action may backfire or reveal a flaw)

Example structure:
{
  "alignment": "Lawful Good",
  "nickname": "The Crusader",
  "motivation": "...",
  "genius": "...",
  "incompetence": "..."
}

Respond only with a JSON array. No explanations.

Person: ${person}
Context: ${context || "None"}
Action: ${action}`;

  // Try returning cached version if it exists
  try {
    const cacheData = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
    const cached = cacheData.find(
      (ex) => ex.person === person && ex.context === context && ex.action === action
    );
    if (cached && Array.isArray(cached.results) && cached.results.length > 0) {
      return res.status(200).json(cached.results);
    }
  } catch (e) {
    console.error("Cache read failed:", e);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: model || "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.choices?.[0]?.message?.content || "";
    const jsonStart = raw.indexOf("[");
    const jsonEnd = raw.lastIndexOf("]") + 1;
    const parsed = JSON.parse(raw.substring(jsonStart, jsonEnd));

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({ error: error.message || "API error" });
  }
}
