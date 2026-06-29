// src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";

const FEATURES = [
  {
    icon: "⚡",
    title: "Hybrid Ranking",
    desc: "Structural scoring combined with semantic reranking via sentence transformers for unparalleled precision.",
  },
  {
    icon: "🔍",
    title: "4 Search Modes",
    desc: "Auto-detect or manually pick Keyword, Intent, or Code mode. Each tuned for a distinct search pattern.",
  },
  {
    icon: "🐍",
    title: "Multi-Language",
    desc: "Parse Python, Java, and C++ repositories. Extracts functions, classes, and inline snippets.",
  },
  {
    icon: "📊",
    title: "Eval Metrics",
    desc: "Precision@5, Recall@5, MRR, NDCG@5, Hit Rates, Latency, and Hybrid Gain — all in one dashboard.",
  },
  {
    icon: "🚀",
    title: "GitHub Native",
    desc: "Paste any public GitHub URL. Repos are cloned, parsed, and indexed in-memory on demand.",
  },
  {
    icon: "🧠",
    title: "Semantic Rerank",
    desc: "After structural ranking, results are reranked by semantic similarity using dense embeddings.",
  },
];

const MODES = [
  { mode: "Keyword", color: "blue", example: "binary search", desc: "Single or compound terms" },
  { mode: "Intent", color: "violet", example: "find all files in a directory", desc: "Natural language sentences" },
  { mode: "Code", color: "cyan", example: "def sort(arr):", desc: "Paste code snippets directly" },
  { mode: "Auto", color: "blue", example: "Automatic", desc: "AI detects the best mode" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative pt-16 pb-24 text-center overflow-hidden">

        {/* Liquid blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-10 pointer-events-none liquid-blob"
          style={{ background: "radial-gradient(circle, #3b82f6, #7c3aed)" }} />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full opacity-8 pointer-events-none liquid-blob"
          style={{ background: "radial-gradient(circle, #06b6d4, #3b82f6)", animationDelay: "2s" }} />

        {/* Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-electric-blue/30 text-xs font-mono text-electric-blue-bright mb-8">
          <span className="glow-dot" />
          Hybrid Structural + Semantic Code Search
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-text-primary leading-tight mb-6">
          Search Code Like<br />
          <span className="bg-gradient-to-r from-electric-blue via-violet-bright to-cyan bg-clip-text text-transparent">
            a Machine Thinks
          </span>
        </h1>

        <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Load any GitHub repository, parse functions and classes across Python, Java, and C++,
          then find exactly what you need with hybrid ranked search.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button variant="primary" onClick={() => navigate("/repos")} className="px-8 py-4 text-base">
            Load Repositories
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
          <Button variant="secondary" onClick={() => navigate("/search")} className="px-8 py-4 text-base">
            Start Searching
          </Button>
        </div>

        {/* Hero terminal mockup */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="card scan-line overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-2/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <span className="text-text-muted text-xs font-mono ml-2">CodeSearch Engine v1.0</span>
            </div>
            <div className="p-6 text-left space-y-2 font-mono text-sm">
              <div>
                <span className="text-violet-bright">›</span>{" "}
                <span className="text-text-secondary">POST</span>{" "}
                <span className="text-electric-blue-bright">/load-repos</span>{" "}
                <span className="text-text-muted">{"{ repos: ['github.com/...'] }"}</span>
              </div>
              <div className="text-success text-xs pl-4">✓ Loaded 3 repositories · 1,248 snippets indexed</div>
              <div className="mt-4">
                <span className="text-violet-bright">›</span>{" "}
                <span className="text-text-secondary">POST</span>{" "}
                <span className="text-electric-blue-bright">/search</span>{" "}
                <span className="text-text-muted">{"{ query: 'binary search tree insert', mode: 'auto' }"}</span>
              </div>
              <div className="text-cyan-bright text-xs pl-4">⚡ Detected: intent · Structural rank → Semantic rerank</div>
              <div className="text-text-secondary text-xs pl-4">↳ 10 results · Top match: <span className="text-electric-blue-bright">BST::insert()</span> · Score: 385 · Confidence: High</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-text-muted">›</span>
                <span className="text-text-muted cursor-blink">█</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH MODES ─────────────────────────── */}
      <section className="py-16">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl text-text-primary mb-3">
            Intelligent Query Understanding
          </h2>
          <p className="text-text-secondary text-sm max-w-lg mx-auto">
            The engine automatically classifies your query and optimizes ranking accordingly.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MODES.map(({ mode, color, example, desc }) => {
            const colors = {
              blue: "border-electric-blue/30 hover:border-electric-blue/60 hover:shadow-glow-blue",
              violet: "border-violet/30 hover:border-violet/60 hover:shadow-glow-violet",
              cyan: "border-cyan/30 hover:border-cyan/60 hover:shadow-glow-cyan",
            };
            const textColors = { blue: "text-electric-blue-bright", violet: "text-violet-bright", cyan: "text-cyan-bright" };
            return (
              <div key={mode} className={`card p-5 transition-all duration-300 ${colors[color]}`}>
                <span className={`font-display font-bold text-lg ${textColors[color]}`}>{mode}</span>
                <p className="text-text-muted text-xs mt-1 mb-3">{desc}</p>
                <code className="block text-xs font-mono bg-surface-3 px-2 py-1.5 rounded text-text-secondary truncate">
                  {example}
                </code>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section className="py-16">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl text-text-primary mb-3">
            Built for Precision
          </h2>
          <p className="text-text-secondary text-sm max-w-lg mx-auto">
            Every layer of the pipeline is designed to surface the most relevant code, fast.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="card p-6 group hover:shadow-glow-blue transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">{icon}</div>
              <h3 className="font-display font-semibold text-base text-text-primary mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-16">
        <div className="card p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-transparent to-violet/5" />
          <div className="relative z-10">
            <h2 className="font-display font-bold text-3xl text-text-primary mb-4">
              Ready to search your codebase?
            </h2>
            <p className="text-text-secondary text-sm mb-8 max-w-md mx-auto">
              Load your first repository and experience the power of hybrid code search in seconds.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button variant="primary" onClick={() => navigate("/repos")} className="px-8">
                Get Started
              </Button>
              <Button variant="ghost" onClick={() => navigate("/metrics")}>
                View Metrics →
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
