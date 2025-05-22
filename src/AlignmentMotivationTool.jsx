import React, { useState } from 'react';

function AlignmentMotivationTool() {
  const [person, setPerson] = useState('');
  const [context, setContext] = useState('');
  const [action, setAction] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate-alignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person, context, action })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>🧭 TMC: The Moral Compass</h1>
      <div style={{ textAlign: 'right', marginTop: '-1rem', marginBottom: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
        by Jobe
      </div>

      <div>
        <input
          type="text"
          placeholder="Who (e.g., Donald Trump)"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <input
          type="text"
          placeholder="Context for Who (optional)"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <input
          type="text"
          placeholder="What did they do?"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div>
        {results.map((r, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
            <h3>{r.alignment} — <em>{r.nickname}</em></h3>
            <p><strong>Motivation:</strong> {r.motivation}</p>
            <p><strong>Genius:</strong> {r.genius}</p>
            <p><strong>Incompetence:</strong> {r.incompetence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlignmentMotivationTool;
