// AlignmentMotivationTool.jsx
import React, { useState } from "react";
import { saveAs } from "file-saver";

export default function AlignmentMotivationTool() {
  const [person, setPerson] = useState("");
  const [context, setContext] = useState("");
  const [action, setAction] = useState("");
  const [model, setModel] = useState("deepseek-chat");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingCache, setUsingCache] = useState(false);

  const exampleCache = [
  {
    person: "A barista",
    context: "At a coffee shop",
    action: "Gave a free drink to a regular customer",
    results: []
  },
  {
    person: "A police officer",
    context: "While on duty",
    action: "Let a driver off with a warning instead of a ticket",
    results: []
  },
  {
    person: "A teacher",
    context: "In a rural school",
    action: "Used personal funds to buy classroom supplies",
    results: []
  },
  {
    person: "A doctor",
    context: "During a pandemic",
    action: "Provided free consultations to underserved communities",
    results: []
  },
  {
    person: "A CEO",
    context: "Facing a recession",
    action: "Laid off workers while giving themselves a bonus",
    results: []
  }
];

  const useRandomExample = () => { ... };
  const handleGenerate = async () => { ... };
  const handleExport = () => { ... };

  const isValidArray = Array.isArray(results) && results.length > 0;
  const gridLayout = [ ... ];

  const getCardForAlignment = (alignment) => { ... };

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: '2rem' }}>
      <h1>🧭 TMC: The Moral Compass</h1>
      <div>
        <input placeholder="Who" value={person} onChange={(e) => setPerson(e.target.value)} />
        <input placeholder="Context" value={context} onChange={(e) => setContext(e.target.value)} />
        <input placeholder="Action" value={action} onChange={(e) => setAction(e.target.value)} />
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-3.5-turbo">gpt-3.5</option>
          <option value="deepseek-chat">deepseek-chat</option>
          <option value="gpt-4" disabled>gpt-4 (coming soon)</option>
        </select>
        $1
        <button onClick={() => {
          setPerson("");
          setContext("");
          setAction("");
          setModel("deepseek-chat");
          setResults([]);
          setError(null);
        }} disabled={loading}>
          Reset
        </button>
      </div>
      {error && <p>{error}</p>}
      {isValidArray && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {gridLayout.flat().map(alignment => getCardForAlignment(alignment))}
        </div>
      )}
    </div>
  );
}
