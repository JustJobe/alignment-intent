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
  const [model, setModel] = useState("gpt-3.5-turbo");

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-alignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ person, context, action, model }),
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

    const csvHeader = "Alignment,Nickname,Motivation,Genius,Incompetence\n";
    const csvRows = results.map(r =>
      `"${r.alignment}","${r.nickname}","${r.motivation}","${r.genius}","${r.incompetence}"`
    );
    const csvContent = csvHeader + csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `alignment-motivation-${person || "export"}.csv`);
  };

  const isValidArray = Array.isArray(results) && results.length > 0;

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>🧭 TMC: The Moral Compass</h1>
      <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#555', marginBottom: '1rem' }}>
        Explore actions from every ethical angle.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <input placeholder="Who" value={person} onChange={(e) => setPerson(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }} />
        <input placeholder="Context for Who (optional)" value={context} onChange={(e) => setContext(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }} />
        <input placeholder="Action" value={action} onChange={(e) => setAction(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }} />
        <select value={model} onChange={(e) => setModel(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }}>
            <option value="gpt-3.5-turbo">GPT-3.5</option>
            <option value="gpt-4">GPT-4</option>
          </select>
<button onClick={handleGenerate} disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            {loading ? "Generating..." : "Generate"}
          </button>
          <button onClick={handleExport} disabled={!isValidArray} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            Export CSV
          </button>
        </div>
        {loading && <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}><div className="spinner" /></div>}
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {isValidArray && (
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
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
      <style>{`
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #555;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (min-width: 600px) {
          input, button {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}
