// AlignmentMotivationTool.jsx
import React, { useState } from "react";
import { saveAs } from "file-saver";

export default function AlignmentMotivationTool() {
  const [person, setPerson] = useState("");
  const [context, setContext] = useState("");
  const [action, setAction] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingCache, setUsingCache] = useState(false);

  const exampleCache = [
    // (Truncated for brevity — keep all existing example data unchanged)
  ];

  const useRandomExample = () => {
    const random = exampleCache[Math.floor(Math.random() * exampleCache.length)];
    setLoading(true);
    setUsingCache(true);
    setTimeout(() => {
      setPerson(random.person);
      setContext(random.context);
      setAction(random.action);
      if (random.results.length > 0) {
        setResults(random.results);
      } else {
        setResults([]);
      }
      setLoading(false);
      setUsingCache(false);
    }, 500);
  };

  const handleGenerate = async () => {
    if (usingCache) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const response = await fetch("/api/generate-alignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, context, action, model }),
      });
      if (!response.ok) throw new Error("Failed to fetch GPT results.");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Expected an array from API response");
      setResults(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
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

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>🧭 TMC: The Moral Compass</h1>
      <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#555', marginBottom: '1rem' }}>
        Explore actions from every ethical angle.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <small style={{ color: '#777', fontSize: '0.9rem' }}>
          Example: Who = "Donald Trump", Context = "During his presidency", Action = "Imposed tariffs on foreign goods"
        </small>
        <button onClick={() => {
          setPerson("Donald Trump");
          setContext("During his presidency");
          setAction("Imposed tariffs on foreign goods");
        }} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', alignSelf: 'flex-start' }}>
          Use Example
        </button>
        <button onClick={useRandomExample} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', alignSelf: 'flex-start' }}>
          Surprise Me
        </button>
        <input placeholder="Who (e.g. Donald Trump)" value={person} onChange={(e) => setPerson(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }} />
        <input placeholder="Context for Who (e.g. During his presidency)" value={context} onChange={(e) => setContext(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }} />
        <input placeholder="Action (e.g. Imposed tariffs on foreign goods)" value={action} onChange={(e) => setAction(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }} />
        <select value={model} onChange={(e) => setModel(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }}>
          <option value="gpt-3.5-turbo">GPT-3.5</option>
          <option value="gpt-4" disabled>GPT-4 (coming soon)</option>
        </select>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleGenerate} disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            {loading ? "Generating..." : "Generate"}
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
          </div>
        )}
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {isValidArray && (
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {(() => {
            const groups = { Evil: [], Neutral: [], Good: [] };
            results.slice().reverse().forEach((res) => {
              if (res.alignment.includes("Evil")) groups.Evil.push(res);
              else if (res.alignment.includes("Good")) groups.Good.push(res);
              else groups.Neutral.push(res);
            });
            return ["Evil", "Neutral", "Good"].map((group) => (
              <div key={group}>
                <h2 style={{ gridColumn: '1 / -1', fontSize: '1.5rem', marginTop: '1rem', color: '#333' }}>{group} Alignments</h2>
                {groups[group].map((res, idx) => (
                  <div key={idx} style={{ background: '#fff', padding: '1rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{res.alignment} ({res.nickname})</h3>
                    <p><strong>Motivation:</strong> {res.motivation}</p>
                    <p><strong>Genius:</strong> {res.genius}</p>
                    <p><strong>Incompetence:</strong> {res.incompetence}</p>
                  </div>
                ))}
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}
