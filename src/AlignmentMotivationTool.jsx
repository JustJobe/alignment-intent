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

  const exampleCache = [
    {
      person: "Donald Trump",
      context: "During his presidency",
      action: "Imposed tariffs on foreign goods",
      results: [
        {
          "alignment": "Lawful Good",
          "nickname": "The Crusader",
          "motivation": "Trump imposes tariffs to protect American workers and uphold fair trade policies.",
          "genius": "He uses tariffs as leverage to negotiate better trade deals, benefiting the U.S. economy long term.",
          "incompetence": "He believes he's helping American workers, but miscalculates the global response and economic fallout."
        },
        {
          "alignment": "Neutral Good",
          "nickname": "The Benefactor",
          "motivation": "Trump genuinely believes tariffs will help the American people by encouraging domestic production.",
          "genius": "He uses tariffs to nudge the country toward economic independence in a volatile global market.",
          "incompetence": "He underestimates the impact on global allies and trade partners, causing diplomatic strain."
        },
        {
          "alignment": "Chaotic Good",
          "nickname": "The Rebel",
          "motivation": "Trump disrupts traditional trade to benefit ordinary citizens and break corporate dependence on cheap imports.",
          "genius": "He forces a conversation on unfair trade practices and inspires local manufacturing.",
          "incompetence": "His unpredictable actions cause confusion and instability in global markets."
        },
        {
          "alignment": "Lawful Neutral",
          "nickname": "The Judge",
          "motivation": "Trump follows through on campaign promises and trade law enforcement.",
          "genius": "He implements a structured, rules-based tariff system to reset trade expectations.",
          "incompetence": "He applies tariffs without flexibility, ignoring shifting economic conditions."
        },
        {
          "alignment": "True Neutral",
          "nickname": "The Balance Seeker",
          "motivation": "Trump enacts tariffs as a balancing act to test U.S. resilience against global pressures.",
          "genius": "He seeks to optimize America's position regardless of ideology.",
          "incompetence": "His detachment leads to inconsistent policy enforcement and uncertain messaging."
        },
        {
          "alignment": "Chaotic Neutral",
          "nickname": "The Opportunist",
          "motivation": "Trump imposes tariffs because it feels like a bold move that demonstrates power.",
          "genius": "He leverages shock value to gain negotiation ground and unsettle opponents.",
          "incompetence": "He makes impulsive decisions without assessing long-term economic consequences."
        },
        {
          "alignment": "Lawful Evil",
          "nickname": "The Manipulator",
          "motivation": "Trump uses tariffs to strengthen his base and reward favored industries.",
          "genius": "He exploits trade law and bureaucracy to gain strategic political and financial control.",
          "incompetence": "His manipulation becomes transparent, leading to backlash and reduced credibility."
        },
        {
          "alignment": "Neutral Evil",
          "nickname": "The Malefactor",
          "motivation": "Trump seeks personal and political gain regardless of global consequences.",
          "genius": "He conceals self-interest behind a nationalist agenda, profiting from chaos.",
          "incompetence": "He misjudges allies' retaliation, leading to economic losses that hurt his reputation."
        },
        {
          "alignment": "Chaotic Evil",
          "nickname": "The Destroyer",
          "motivation": "Trump imposes tariffs to sow discord, assert dominance, and defy global norms.",
          "genius": "He relishes disrupting fragile alliances, thriving in disorder.",
          "incompetence": "He creates needless chaos that undermines long-term interests of both the U.S. and its allies."
        }
      ]
    },
    {
      person: "My friend",
      context: "Walking downtown",
      action: "Gave money to a stranger asking for help",
      results: []
    },
    {
      person: "My husband",
      context: "Walking down the street",
      action: "Kicked a puppy",
      results: []
    },
    {
      person: "Taylor Swift",
      context: "At a fan meet-and-greet",
      action: "Ignored a fan asking for an autograph",
      results: []
    },
    {
      person: "My mother",
      context: "Despite being healthy",
      action: "Keeps visiting the hospital for checkups",
      results: []
    },
    {
      person: "Elon Musk",
      context: "After buying Twitter",
      action: "Changed the platform rules overnight",
      results: []
    },
    {
      person: "A teacher",
      context: "In the middle of an exam",
      action: "Left the room unattended",
      results: []
    },
    {
      person: "A barista",
      context: "At a coffee shop",
      action: "Gave a free drink to a regular customer",
      results: []
    }
  ];

  const useRandomExample = () => {
    const random = exampleCache[Math.floor(Math.random() * exampleCache.length)];
    setPerson(random.person);
    setContext(random.context);
    setAction(random.action);
    if (random.results.length > 0) {
      setResults(random.results);
    } else {
      setResults([]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-alignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, context, action, model }),
      });
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Expected an array from API response");
      setResults(data);
    } catch (err) {
      setError("Failed to fetch GPT results. Check console for details.");
      console.error(err);
      setResults([]);
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
