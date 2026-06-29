// src/pages/About.jsx
import { useState } from "react";
import { Input, Button, SectionHeader } from "../components/ui";

const ARCHITECTURE = [
  { layer: "GitHub Loader", desc: "Clones public repos to temp directory via git clone", file: "utils/github_loader.py" },
  { layer: "File Loader", desc: "Recursively discovers .py, .java, .cpp, .h, .hpp files", file: "utils/file_loader.py" },
  { layer: "Parsers", desc: "Language-specific AST parsers extract functions and classes", file: "parsers/*.py" },
  { layer: "Snippet Extractor", desc: "Flattens parsed docs into a normalized snippet database", file: "snippets/extractor.py" },
  { layer: "Query Understanding", desc: "Classifies query as keyword / intent / code mode", file: "search/query_understanding.py" },
  { layer: "Structural Ranker", desc: "Token-level scoring across title, path, and code body zones", file: "search/snippet_ranker.py" },
  { layer: "Semantic Reranker", desc: "Dense embedding similarity reranks top-K results", file: "embeddings/semantic_model.py" },
  { layer: "Evaluator", desc: "Computes Precision, Recall, MRR, NDCG, Hit Rates, Latency", file: "evaluation/evaluator.py" },
];

export default function About() {
  const [apiUrl, setApiUrl] = useState(process.env.REACT_APP_API_URL || "http://localhost:8000");
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    localStorage.setItem("api_url", apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader
        title="About & Settings"
        subtitle="Architecture overview and connection settings for the CodeSearch Engine."
      />

      {/* Settings card */}
      <div className="card p-6 mb-8">
        <h2 className="font-display font-semibold text-text-primary mb-4">Connection Settings</h2>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-2">
              Backend API URL
            </label>
            <Input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000"
            />
          </div>
          <Button variant="primary" onClick={saveSettings}>
            {saved ? "Saved ✓" : "Save"}
          </Button>
        </div>
        <p className="text-text-muted text-xs mt-3 font-mono">
          Restart required for URL changes to take effect. Set REACT_APP_API_URL env variable for permanent config.
        </p>
      </div>

      {/* Pipeline Architecture */}
      <div className="card p-6 mb-8">
        <h2 className="font-display font-semibold text-text-primary mb-6">Pipeline Architecture</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {ARCHITECTURE.map(({ layer, desc, file }, i) => (
              <div key={layer} className="flex gap-5 relative">
                <div className="flex-shrink-0 w-8 h-8 rounded-full glass border border-border flex items-center justify-center text-xs font-mono text-electric-blue z-10 bg-surface">
                  {i + 1}
                </div>
                <div className="pt-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-display font-semibold text-text-primary text-sm">{layer}</h3>
                    <code className="text-xs font-mono text-text-muted bg-surface-3 px-2 py-0.5 rounded border border-border">
                      {file}
                    </code>
                  </div>
                  <p className="text-text-secondary text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Reference */}
      <div className="card p-6 mb-8">
        <h2 className="font-display font-semibold text-text-primary mb-4">API Reference</h2>
        <div className="space-y-3">
          {[
            { method: "GET", path: "/", desc: "Health check — returns API status", resp: '{ message: "Hybrid Code Search Engine API Running" }' },
            { method: "POST", path: "/load-repos", desc: "Load and index a list of GitHub repositories", resp: '{ repositories: [{repo, snippets, status}], total_snippets }' },
            { method: "POST", path: "/search", desc: "Search indexed snippets with query + mode", resp: '{ query, detected_mode, count, results: [...] }' },
            { method: "GET", path: "/metrics", desc: "Run benchmark evaluation (output in server console)", resp: '{ message: "Metrics executed in server console." }' },
          ].map(({ method, path, desc, resp }) => {
            const methodColors = {
              GET: "bg-success/10 text-success border-success/30",
              POST: "bg-electric-blue/10 text-electric-blue-bright border-electric-blue/30",
            };
            return (
              <div key={path} className="p-4 rounded-lg bg-surface-3 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`badge border ${methodColors[method]}`}>{method}</span>
                  <code className="text-electric-blue-bright font-mono text-sm">{path}</code>
                </div>
                <p className="text-text-secondary text-xs mb-2">{desc}</p>
                <code className="block text-xs font-mono text-text-muted bg-surface px-3 py-2 rounded border border-border">
                  {resp}
                </code>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech stack */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-text-primary mb-4">Tech Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { cat: "Backend", items: ["FastAPI", "Python 3.10+", "Sentence Transformers", "AST Parsers", "GitPython"] },
            { cat: "Frontend", items: ["React 18", "Tailwind CSS", "React Router", "Recharts", "Framer Motion"] },
            { cat: "Languages Supported", items: ["Python (.py)", "Java (.java)", "C++ (.cpp, .hpp, .h)"] },
          ].map(({ cat, items }) => (
            <div key={cat}>
              <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-2">{cat}</p>
              <div className="space-y-1.5">
                {items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="text-electric-blue text-xs">›</span>
                    <span className="text-text-secondary text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
