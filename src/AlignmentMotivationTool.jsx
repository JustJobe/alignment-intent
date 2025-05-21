// AlignmentMotivationTool.jsx
import React, { useState } from "react";
import { saveAs } from "file-saver";

export default function AlignmentMotivationTool() {
  const [person, setPerson] = useState("");
  const [context, setContext] = useState("");
  const [action, setAction] = useState("");
  const [results, setResults] = useState([]);
  const [rawOutput, setRawOutput] = useState(null);
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
      console.log("Full API response:", data);
      setRawOutput(data);
      if (!Array.isArray(data)) {
        throw new Error("Expected an array from API response");
      }
      setResults(data);
    } catch (err) {
      setError("Failed to fetch GPT results. Check console for details.");
      console.error(err);
      setResults([]);
      setRawOutput(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!results || results.length === 0) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    saveAs(blob, `alignment-motivation-${person || "export"}.json`);
  };

  const isValidArray = Array.isArray(results) && results.length > 0;

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>🎯 Alignment Motivation Tool</h1>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
        <input placeholder="Person" value={person} onChange={(e) => setPerson(e.target.value)} style={{ padding: '0.5rem' }} />
        <input placeholder="Context (optional)" value={context} onChange={(e) => setContext(e.target.value)} style={{ padding: '0.5rem' }} />
        <input placeholder="Action" value={action} onChange={(e) => setAction(e.target.value)} style={{ padding: '0.5rem' }} />
        <button onClick={handleGenerate} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? "Generating..." : "Generate"}
        </button>
        <button onClick={handleExport} disabled={!isValidArray} style={{ padding: '0.5rem 1rem' }}>
          Export JSON
        </button>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Debug output */}
      {rawOutput && (
        <pre style={{ background: '#f0f0f0', padding: '1rem', overflowX: 'auto', marginTop: '1rem' }}>
          <strong>Raw Output:</strong>
          <br />
          {JSON.stringify(rawOutput, null, 2)}
        </pre>
      )}

      {isValidArray && (
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {results.map((res, idx) => (
            <div key={idx} style={{ background: '#fff', padding: '1rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{res.alignment} ({res.nickname})</h2>
              <p><strong>Motivation:</strong> {res.motivation}</p>
              <p><strong>Genius:</strong> {res.genius}</p>
              <p><strong>Incompetence:</strong> {res.incompetence}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
