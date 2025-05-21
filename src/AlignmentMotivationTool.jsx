// AlignmentMotivationTool.jsx
import React, { useState } from "react";

export default function AlignmentMotivationTool() {
  const [person, setPerson] = useState("");
  const [context, setContext] = useState("");
  const [action, setAction] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-alignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ person, context, action }),
      });
      const data = await response.json();
      console.log("GPT response data:", data);
      if (!Array.isArray(data)) {
        throw new Error("Expected an array from API response");
      }
      setResults(data);
    } catch (err) {
      setError("Failed to fetch GPT results. Check console for details.");
      console.error(err);
      setResults([]); // Ensure results is reset to an empty array on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>Alignment Motivation Tool</h1>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <input placeholder="Person" value={person} onChange={(e) => setPerson(e.target.value)} />
        <input placeholder="Context (optional)" value={context} onChange={(e) => setContext(e.target.value)} />
        <input placeholder="Action" value={action} onChange={(e) => setAction(e.target.value)} />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {Array.isArray(results) && results.map((res, idx) => (
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
