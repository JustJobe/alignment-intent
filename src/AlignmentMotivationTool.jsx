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
      results: [
        {
          "alignment": "Lawful Good",
          "nickname": "The Altruist",
          "motivation": "My friend believes it's a moral duty to help those in need whenever possible.",
          "genius": "They prepare in advance by carrying small bills or gift cards specifically for giving.",
          "incompetence": "They may overlook potential scams or enable dependency without addressing root issues."
        },
        {
          "alignment": "Neutral Good",
          "nickname": "The Empath",
          "motivation": "My friend acts out of spontaneous compassion and emotional connection.",
          "genius": "They listen to the person’s story and offer meaningful help beyond money.",
          "incompetence": "Their emotional reaction might cloud judgment about whether the action truly helps."
        },
        {
          "alignment": "Chaotic Good",
          "nickname": "The Free Spirit",
          "motivation": "My friend doesn’t follow norms and prefers to support people directly rather than through institutions.",
          "genius": "They connect deeply, offering support in unexpected and impactful ways.",
          "incompetence": "They might disregard safety or get involved without proper boundaries."
        },
        {
          "alignment": "Lawful Neutral",
          "nickname": "The Citizen",
          "motivation": "My friend gives because it's part of their structured approach to being a good member of society.",
          "genius": "They integrate giving into a broader personal philosophy of civic duty.",
          "incompetence": "They give more out of obligation than intention, possibly overlooking deeper needs."
        },
        {
          "alignment": "True Neutral",
          "nickname": "The Observer",
          "motivation": "My friend gives with no strong stance, responding as the situation arises.",
          "genius": "They offer help calmly and logically when they assess that it matters most.",
          "incompetence": "Their lack of conviction might make them inconsistent or disengaged."
        },
        {
          "alignment": "Chaotic Neutral",
          "nickname": "The Wildcard",
          "motivation": "My friend enjoys doing spontaneous things that defy convention.",
          "genius": "They support others in ways that are inventive and impactful.",
          "incompetence": "They may act without regard to consequences or follow-through."
        },
        {
          "alignment": "Lawful Evil",
          "nickname": "The Strategist",
          "motivation": "My friend gives to be seen as charitable or to manipulate a situation.",
          "genius": "They leverage small acts of charity to build reputation or gain influence.",
          "incompetence": "They might miscalculate the optics and be seen as insincere."
        },
        {
          "alignment": "Neutral Evil",
          "nickname": "The Opportunist",
          "motivation": "They use generosity to feel superior or to receive praise.",
          "genius": "They give just enough to be noticed and avoid criticism.",
          "incompetence": "Their self-serving motives can be transparent and counterproductive."
        },
        {
          "alignment": "Chaotic Evil",
          "nickname": "The Saboteur",
          "motivation": "They give money not to help, but to mock or manipulate.",
          "genius": "They might use the act to sow confusion or undermine trust in genuine charity.",
          "incompetence": "Their cruelty is usually obvious and backfires socially."
        }
      ]
    },
    {
      person: "My husband",
      context: "Walking down the street",
      action: "Kicked a puppy",
      results: [
        {"alignment": "Lawful Good", "nickname": "The Enforcer", "motivation": "He acted believing the puppy was attacking someone and it was necessary to protect them.", "genius": "He uses moral restraint in violence, doing the least harm to protect another.", "incompetence": "He misjudges the situation, harming the innocent through misplaced vigilance."},
        {"alignment": "Neutral Good", "nickname": "The Flawed Hero", "motivation": "He panicked while trying to do good, thinking the puppy was in danger.", "genius": "His moral compass is solid, but his methods are flawed.", "incompetence": "His emotional reaction clouds his better judgment."},
        {"alignment": "Chaotic Good", "nickname": "The Misguided Rebel", "motivation": "He reacted instinctively to what he thought was cruelty or chaos.", "genius": "He challenges norms to stop injustice—even if misunderstood.", "incompetence": "His reckless impulse causes unnecessary harm."},
        {"alignment": "Lawful Neutral", "nickname": "The Rule Keeper", "motivation": "He was following a policy or personal rule regarding aggressive animals.", "genius": "He enforces standards consistently.", "incompetence": "Blind adherence to policy over compassion causes harm."},
        {"alignment": "True Neutral", "nickname": "The Indifferent", "motivation": "He acted without emotional or moral weight—simply reacted.", "genius": "He remains detached, balancing instinct and logic.", "incompetence": "Detachment leads to moral disengagement."},
        {"alignment": "Chaotic Neutral", "nickname": "The Impulsive", "motivation": "He acted purely on impulse without reflection.", "genius": "He's quick and decisive in unpredictable ways.", "incompetence": "His impulsiveness leads to harmful chaos."},
        {"alignment": "Lawful Evil", "nickname": "The Tyrant", "motivation": "He believes he has the right to punish lesser beings to assert control.", "genius": "He weaponizes order to dominate others.", "incompetence": "His rigid cruelty exposes him to moral backlash."},
        {"alignment": "Neutral Evil", "nickname": "The Malefactor", "motivation": "He derives satisfaction from hurting others with no guilt.", "genius": "He hides cruelty under a calm mask.", "incompetence": "His cruelty is evident and earns social punishment."},
        {"alignment": "Chaotic Evil", "nickname": "The Destroyer", "motivation": "He kicked the puppy purely out of malice and disorder.", "genius": "He instills fear to control or confuse.", "incompetence": "His actions are vile and self-destructive."}
      ]
    },
    {
      person: "Taylor Swift",
      context: "At a fan meet-and-greet",
      action: "Ignored a fan asking for an autograph",
      results: [
        {"alignment": "Lawful Good", "nickname": "The Professional", "motivation": "She adheres to event protocol or time constraints.", "genius": "She respects structure to treat all fans fairly.", "incompetence": "Her rigidity appears cold or impersonal."},
        {"alignment": "Neutral Good", "nickname": "The Reserved Guardian", "motivation": "She preserves energy or avoids emotional burnout.", "genius": "She sustains long-term connection by maintaining boundaries.", "incompetence": "She underestimates the impact of a brief dismissal."},
        {"alignment": "Chaotic Good", "nickname": "The Spontaneous Idealist", "motivation": "She makes unpredictable choices to protect her well-being.", "genius": "She adapts to complex emotions without being constrained.", "incompetence": "Her unpredictability alienates those who feel overlooked."},
        {"alignment": "Lawful Neutral", "nickname": "The Disciplined", "motivation": "She follows the schedule regardless of emotions.", "genius": "She respects professionalism over appeasement.", "incompetence": "She comes across as indifferent or distant."},
        {"alignment": "True Neutral", "nickname": "The Detached", "motivation": "She neither favors nor rejects attention.", "genius": "She responds based on balance rather than expectations.", "incompetence": "Her lack of emotional engagement seems uncaring."},
        {"alignment": "Chaotic Neutral", "nickname": "The Independent", "motivation": "She acts on impulse or mood without explanation.", "genius": "She defies expectations to maintain autonomy.", "incompetence": "She undermines rapport through erratic choices."},
        {"alignment": "Lawful Evil", "nickname": "The Calculated Icon", "motivation": "She snubs fans selectively to cultivate mystique.", "genius": "She manipulates reputation to maintain elite status.", "incompetence": "Her methods provoke backlash and suspicion."},
        {"alignment": "Neutral Evil", "nickname": "The Self-Server", "motivation": "She prioritizes personal interest above fan connection.", "genius": "She controls interactions to maximize attention and brand.", "incompetence": "Her selfishness reduces public sympathy."},
        {"alignment": "Chaotic Evil", "nickname": "The Dismantler", "motivation": "She dismisses fans to express control or disdain.", "genius": "She uses alienation to spark controversy.", "incompetence": "She sabotages goodwill with cruel unpredictability."}
      ]
    },
    {
      person: "My mother",
      context: "Despite being healthy",
      action: "Keeps visiting the hospital for checkups",
      results: [
        {"alignment": "Lawful Good", "nickname": "The Watchful", "motivation": "She believes in prevention and strictly following health guidelines.", "genius": "She models responsible health behavior and encourages others to do the same.", "incompetence": "She may waste medical resources or cause unnecessary concern."},
        {"alignment": "Neutral Good", "nickname": "The Concerned", "motivation": "She genuinely wants to stay healthy and avoid burdening others.", "genius": "She advocates for personal responsibility in health.", "incompetence": "Her fears may lead to obsessive or counterproductive behavior."},
        {"alignment": "Chaotic Good", "nickname": "The Rebel Worrier", "motivation": "She resists anyone who tells her she's fine because she deeply mistrusts authority.", "genius": "She pushes for second opinions that can uncover overlooked issues.", "incompetence": "She may cause confusion or burnout among caregivers."},
        {"alignment": "Lawful Neutral", "nickname": "The Follower", "motivation": "She is simply following what the system allows or what insurance covers.", "genius": "She follows instructions and maintains documentation meticulously.", "incompetence": "She lacks critical thinking about whether repeated visits are necessary."},
        {"alignment": "True Neutral", "nickname": "The Passive", "motivation": "She neither worries nor fully ignores her health — she checks in routinely without attachment.", "genius": "She balances action and inaction with little emotional disruption.", "incompetence": "She may become disconnected from the purpose behind the visits."},
        {"alignment": "Chaotic Neutral", "nickname": "The Anxious Freethinker", "motivation": "She goes to the hospital out of instinct or emotion, not rules.", "genius": "She takes control of her health journey without waiting for permission.", "incompetence": "Her unpredictability may lead to miscommunication or friction with medical staff."},
        {"alignment": "Lawful Evil", "nickname": "The Exploiter", "motivation": "She visits out of entitlement or to extract as much as possible from public services.", "genius": "She games the system to her advantage.", "incompetence": "Her abuse of services may result in penalties or systemic strain."},
        {"alignment": "Neutral Evil", "nickname": "The Manipulator", "motivation": "She uses health visits for attention or to gain sympathy.", "genius": "She positions herself for maximum emotional or material gain.", "incompetence": "Her tactics may erode trust and exhaust those around her."},
        {"alignment": "Chaotic Evil", "nickname": "The Disruptor", "motivation": "She causes chaos through false alarms and exaggerated complaints.", "genius": "She stirs emotion and panic to feel powerful.", "incompetence": "Her destructiveness damages relationships and drains critical resources."}
      ]
    },
    {
      person: "Elon Musk",
      context: "After buying Twitter",
      action: "Changed the platform rules overnight",
      results: [
        {"alignment": "Lawful Good", "nickname": "The Reformist", "motivation": "He believes in restoring order and fairness to an unbalanced system.", "genius": "He uses rule changes to build a more transparent and principled platform.", "incompetence": "His rapid changes alienate users and cause confusion."},
        {"alignment": "Neutral Good", "nickname": "The Innovator", "motivation": "He wants to improve user experience and combat misuse.", "genius": "He retools the system to favor open discourse and balance.", "incompetence": "His well-meaning changes lack clarity and create unintended issues."},
        {"alignment": "Chaotic Good", "nickname": "The Visionary", "motivation": "He sees himself as a disruptor reshaping a broken structure.", "genius": "His bold reforms inspire new possibilities.", "incompetence": "His rapid shifts result in user instability and backlash."},
        {"alignment": "Lawful Neutral", "nickname": "The Operator", "motivation": "He applies policy as a business executive enforcing control.", "genius": "He centralizes authority and streamlines enforcement.", "incompetence": "He sacrifices nuance and transparency for uniformity."},
        {"alignment": "True Neutral", "nickname": "The Calculator", "motivation": "He makes changes pragmatically without strong ethical leanings.", "genius": "He adapts rules to fit whatever ensures platform survival.", "incompetence": "His detachment undermines user trust."},
        {"alignment": "Chaotic Neutral", "nickname": "The Maverick", "motivation": "He changes rules unpredictably based on gut instinct.", "genius": "He thrives on shock value and creative control.", "incompetence": "His impulsive changes cause instability and user loss."},
        {"alignment": "Lawful Evil", "nickname": "The Autocrat", "motivation": "He enforces strict rules to dominate discourse and suppress dissent.", "genius": "He uses order as a tool for personal power.", "incompetence": "His rule changes incite rebellion and erode legitimacy."},
        {"alignment": "Neutral Evil", "nickname": "The Opportunist", "motivation": "He monetizes and manipulates platform control for personal gain.", "genius": "He redefines platform rules to benefit his influence.", "incompetence": "His greed compromises user loyalty and platform integrity."},
        {"alignment": "Chaotic Evil", "nickname": "The Saboteur", "motivation": "He enjoys disrupting the status quo regardless of consequence.", "genius": "He sows disorder to assert dominance.", "incompetence": "His recklessness drives the platform toward chaos and collapse."}
      ]
    },
    {
      person: "A teacher",
      context: "In the middle of an exam",
      action: "Left the room unattended",
      results: [
        {"alignment": "Lawful Good", "nickname": "The Trust Builder", "motivation": "Believes in fostering student integrity and self-governance.", "genius": "Promotes personal responsibility through trust.", "incompetence": "Assumes ideal behavior, resulting in unchecked cheating."},
        {"alignment": "Neutral Good", "nickname": "The Naive Optimist", "motivation": "Wants students to feel respected and unmonitored.", "genius": "Builds a positive atmosphere of autonomy.", "incompetence": "Unintentionally enables dishonest behavior."},
        {"alignment": "Chaotic Good", "nickname": "The Idealistic Rule-Breaker", "motivation": "Rejects the rigidity of surveillance as oppressive.", "genius": "Encourages ethical growth by removing pressure.", "incompetence": "Undermines academic fairness."},
        {"alignment": "Lawful Neutral", "nickname": "The Proceduralist", "motivation": "Was following a school procedure or duty call.", "genius": "Maintains institutional priorities.", "incompetence": "Fails to consider timing and context."},
        {"alignment": "True Neutral", "nickname": "The Indifferent", "motivation": "Feels no strong commitment to outcome—just follows routine.", "genius": "Remains detached and efficient.", "incompetence": "Lacks initiative or awareness of risks."},
        {"alignment": "Chaotic Neutral", "nickname": "The Impulsive", "motivation": "Left without concern for norms or consequences.", "genius": "Operates instinctively and unpredictably.", "incompetence": "Shows disregard for duty or consistency."},
        {"alignment": "Lawful Evil", "nickname": "The Manipulator", "motivation": "Leaves the room to trap students into breaking rules.", "genius": "Uses authority to create control tests.", "incompetence": "Fosters mistrust and resentment."},
        {"alignment": "Neutral Evil", "nickname": "The Negligent", "motivation": "Left out of laziness or apathy.", "genius": "Avoids work while maintaining minimal compliance.", "incompetence": "Jeopardizes academic integrity and student success."},
        {"alignment": "Chaotic Evil", "nickname": "The Saboteur", "motivation": "Wants students to fail or create classroom chaos.", "genius": "Destabilizes the environment with intent.", "incompetence": "Creates educational failure and unrest."}
      ]
    },
    {
      person: "A barista",
      context: "At a coffee shop",
      action: "Gave a free drink to a regular customer",
      results: [
        {"alignment": "Lawful Good", "nickname": "The Generous Professional", "motivation": "The barista values customer loyalty and believes kindness builds community.", "genius": "They strengthen customer relationships and morale.", "incompetence": "They may violate store policy, causing friction with management."},
        {"alignment": "Neutral Good", "nickname": "The Kind Soul", "motivation": "The barista simply wants to brighten someone's day.", "genius": "Their small gesture spreads goodwill and returns in word-of-mouth support.", "incompetence": "Their generosity may go unnoticed or unappreciated."},
        {"alignment": "Chaotic Good", "nickname": "The Friendly Rebel", "motivation": "They act on impulse to do something nice without asking for permission.", "genius": "They create memorable, personal connections with customers.", "incompetence": "They risk their job for small acts of kindness."},
        {"alignment": "Lawful Neutral", "nickname": "The Rule Follower", "motivation": "The barista might be acting under a formal customer reward policy.", "genius": "They uphold loyalty programs with consistency.", "incompetence": "They may misapply rules and cause internal confusion."},
        {"alignment": "True Neutral", "nickname": "The Balanced Giver", "motivation": "The barista gives a free drink with no agenda—just sees it as fine in the moment.", "genius": "They respond fluidly to customer behavior.", "incompetence": "They may appear inconsistent or unpredictable."},
        {"alignment": "Chaotic Neutral", "nickname": "The Wildcard", "motivation": "They do whatever they feel like without thinking of consequences.", "genius": "They keep things lively and authentic.", "incompetence": "Their unpredictability may frustrate coworkers or customers."},
        {"alignment": "Lawful Evil", "nickname": "The Schemer", "motivation": "They give free drinks to favored customers to gain influence or favors.", "genius": "They build a personal network through selective generosity.", "incompetence": "Their favoritism leads to unfairness and scrutiny."},
        {"alignment": "Neutral Evil", "nickname": "The Self-Server", "motivation": "They use freebies to manipulate or win over someone they like.", "genius": "They extract personal benefit from generosity.", "incompetence": "Their motives are transparent and erode trust."},
        {"alignment": "Chaotic Evil", "nickname": "The Underminer", "motivation": "They sabotage the business under the guise of generosity.", "genius": "They disrupt rules to expose control structures.", "incompetence": "Their hostility leads to disciplinary action or dismissal."}
      ]
    }
  ];

  const useRandomExample = () => {
    const random = exampleCache[Math.floor(Math.random() * exampleCache.length)];
    setLoading(true);
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
    }, 500);
      
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
