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

  const useRandomExample = () => {
    const random = exampleCache[Math.floor(Math.random() * exampleCache.length)];
    if (!random) return;
    setLoading(true);
    setUsingCache(true);
    setResults([]);

    setTimeout(() => {
      setPerson(random.person);
      setContext(random.context);
      setAction(random.action);
      setResults(random.results || []);
      setUsingCache(false);
      setLoading(false);
    }, 500);
  };

  const handleGenerate = async () => {
    if (usingCache || results.length > 0) return;
    if (!person || !action) {
      setError("Please enter both a person and an action.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch("/api/generate-alignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, context, action, model })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Unexpected server error.");
      }

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Unexpected data format from the server.");
      setResults(data);
    } catch (err) {
      const isBusy = /rate|timeout|fetch/i.test(err.message);
      setError(isBusy
        ? "🌀 The AI is overwhelmed. Try again in a few seconds."
        : `❗ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!results.length) return;
    const csvHeader = "Alignment,Nickname,Motivation,Genius,Incompetence\n";
    const csvRows = results.map(r =>
      `"${r.alignment}","${r.nickname}","${r.motivation}","${r.genius}","${r.incompetence}"`
    );
    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `alignment-motivation-${person || "export"}.csv`);
  };

  const isValidArray = Array.isArray(results) && results.length > 0;

  const gridLayout = [
    ["Lawful Good", "Neutral Good", "Chaotic Good"],
    ["Lawful Neutral", "True Neutral", "Chaotic Neutral"],
    ["Lawful Evil", "Neutral Evil", "Chaotic Evil"]
  ];

  const getCardForAlignment = (alignment) => {
    const item = results.find(r => r.alignment === alignment);
    if (!item) return null;

    let bgColor = '#fff';
    let icon = '';
    let lawChaosIcon = '';
    if (alignment.includes("Lawful")) lawChaosIcon = '📜';
    else if (alignment.includes("Chaotic")) lawChaosIcon = '🔥';
    else if (alignment.includes("Neutral")) lawChaosIcon = '🔸';
    if (alignment.includes("Good")) {
      bgColor = '#e6ffe6';
      icon = '🕊️';
    } else if (alignment.includes("Evil")) {
      bgColor = '#ffe6e6';
      icon = '😈';
    } else if (alignment.includes("Neutral")) {
      bgColor = '#fffacc';
      icon = '⚖️';
    }

    return (
      <div key={alignment} style={{ background: bgColor, padding: '1rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{icon} {lawChaosIcon} {item.alignment} ({item.nickname})</h3>
        <p><strong>Motivation:</strong> {item.motivation}</p>
        <p><strong>Genius:</strong> {item.genius}</p>
        <p><strong>Incompetence:</strong> {item.incompetence}</p>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>🧭 TMC: The Moral Compass</h1>
      <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#555', marginBottom: '1rem' }}>
        by jobe
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => {
          setPerson("Donald Trump");
          setContext("During his presidency");
          setAction("Imposed tariffs on foreign goods");
        }} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
          Use Example
        </button>
        <button onClick={useRandomExample} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
          Surprise Me
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <input placeholder="Who (e.g. Donald Trump)" value={person} onChange={(e) => setPerson(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }} />
        <input placeholder="Context for Who (e.g. During his presidency)" value={context} onChange={(e) => setContext(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }} />
        <input placeholder="Action (e.g. Imposed tariffs on foreign goods)" value={action} onChange={(e) => setAction(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }} />
        <select value={model} onChange={(e) => setModel(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }}>
          <option value="deepseek-chat">deepseek-chat</option>
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          <option value="gpt-4" disabled>gpt-4 (coming soon)</option>
        </select>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          $1
          <button onClick={() => {
            setPerson("");
            setContext("");
            setAction("");
            setModel("deepseek-chat");
            setResults([]);
            setError(null);
          }} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            Reset
          </button>
          <button onClick={handleExport} disabled={!isValidArray} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            Export CSV
          </button>
        </div>
        {loading && (
          <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
            <div
              style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #555',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}
            />
            <p style={{ marginTop: '0.5rem', color: '#666' }}>Thinking through the alignments...</p>
          </div>
        )}
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {isValidArray && (
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {gridLayout.flat().map(alignment => getCardForAlignment(alignment))}
        </div>
      )}
    </div>
  );
}
