// api/generate-alignment.js
import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cachePath = path.resolve('./api/cached-examples.json');

const loadCache = () => {
  if (!fs.existsSync(cachePath)) return [];
  return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
};

const saveToCache = (entry) => {
  const cache = loadCache();
  cache.push(entry);
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
};

const findInCache = (person, context, action) => {
  const cache = loadCache();
  return cache.find(e =>
    e.person === person &&
    e.context === context &&
    e.action === action
  );
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { person, context, action, model } = req.body;

  const cached = findInCache(person, context, action);
  if (cached && Array.isArray(cached.results) && cached.results.length > 0) {
    return res.status(200).json(cached.results);
  }

  const systemPrompt = `You are to assess a person's action from all nine alignments of the Dungeons & Dragons alignment chart. The alignments are: Lawful Good, Neutral Good, Chaotic Good, Lawful Neutral, True Neutral, Chaotic Neutral, Lawful Evil, Neutral Evil, Chaotic Evil. For each alignment, describe the motivation behind the action assuming the person operates from that alignment. Then give a version from genius, and from incompetence.`;

  const userPrompt = `Person: ${person}\nContext: ${context}\nAction: ${action}`;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7
    });

    const output = chatResponse.choices[0].message.content;
    const parsed = JSON.parse(output);

    // Save for future use
    saveToCache({ person, context, action, results: parsed });

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Something went wrong.' });
  }
}
