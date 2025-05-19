import React, { useState } from "react";

const ALIGNMENTS = [
  { name: "Lawful Good", nickname: "The Crusader" },
  { name: "Neutral Good", nickname: "The Benefactor" },
  { name: "Chaotic Good", nickname: "The Rebel" },
  { name: "Lawful Neutral", nickname: "The Judge" },
  { name: "True Neutral", nickname: "The Balanced" },
  { name: "Chaotic Neutral", nickname: "The Free Spirit" },
  { name: "Lawful Evil", nickname: "The Tyrant" },
  { name: "Neutral Evil", nickname: "The Malefactor" },
  { name: "Chaotic Evil", nickname: "The Destroyer" },
];

const generateMotivation = (alignment, person, context, action) => {
  const fullPerson = context ? `${person} (${context})` : person;
  return {
    motivation: `${fullPerson} performed the action '${action}' in a manner consistent with ${alignment.name}.`,
    genius: `From a genius perspective, ${fullPerson} acted with strategic foresight as a ${alignment.nickname}.`,
    incompetence: `From an incompetence perspective, ${fullPerson} misjudged the situation while trying to be a ${alignment.nickname}.`,
  };
};

export default function AlignmentMotivationTool() {
  const [person, setPerson] = useState("");
  const [context, setContext] = useState("");
  const [action, setAction] = useState("");
  const [results, setResults] = useState([]);

  const handleGenerate = () => {
    const motivations = ALIGNMENTS.map((alignment) => {
      const content = generateMotivation(alignment, person, context, action);
      return {
        alignment: alignment.name,
        nickname: alignment.nickname,
        ...content,
      };
    });
    setResults(motivations);
  };

  return (
    <div style={{ maxWidth: 1000, margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>Alignment Motivation Tool</h1>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <input placeholder="Person" value={person} onChange={(e) => setPerson(e.target.value)} />
        <input placeholder="Context (optional)" value={context} onChange={(e) => setContext(e.target.value)} />
        <input placeholder="Action" value={action} onChange={(e) => setAction(e.target.value)} />
        <button onClick={handleGenerate}>Generate</button>
      </div>
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {results.map((res, idx) => (
          <div key={idx} style={{ background: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h2>{res.alignment} ({res.nickname})</h2>
            <p><strong>Motivation:</strong> {res.motivation}</p>
            <p><strong>Genius:</strong> {res.genius}</p>
            <p><strong>Incompetence:</strong> {res.incompetence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
