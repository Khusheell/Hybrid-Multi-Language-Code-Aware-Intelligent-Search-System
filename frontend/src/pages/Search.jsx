// src/pages/Search.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../utils/AppContext";
import { Button, ErrorAlert } from "../components/ui";
import clsx from "clsx";

const MODES = [
  {
    id: "auto",
    label: "Auto",
    icon: "✦",
    desc: "Engine detects the best mode automatically",
    color: "blue",
  },
  {
    id: "keyword",
    label: "Keyword",
    icon: "⌗",
    desc: "Match terms in title, path, and code body",
    color: "blue",
  },
  {
    id: "intent",
    label: "Intent",
    icon: "◈",
    desc: "Natural language sentences — finds functions by purpose",
    color: "violet",
  },
  {
    id: "code",
    label: "Code",
    icon: "⌘",
    desc: "Paste a code snippet to find similar implementations",
    color: "cyan",
  },
];

const EXAMPLE_QUERIES = {
  auto: ["binary search", "sort array", "HTTP client", "parse JSON"],
  keyword: ["BFS", "LinkedList", "FileReader", "heapify"],
  intent: [
    "find all nodes in a binary tree",
    "read file line by line",
    "connect to a database",
    "parse command line arguments",
  ],
  code: ["def sort(arr):", "ArrayList<String>", "std::vector<int>", "class BinaryTree {"],
};

function ModeCard({ mode, selected, onSelect }) {
  const colors = {
    blue: selected
      ? "border-electric-blue bg-electric-blue/10 shadow-glow-blue"
      : "border-border hover:border-electric-blue/40",
    violet: selected
      ? "border-violet bg-violet/10 shadow-glow-violet"
      : "border-border hover:border-violet/40",
    cyan: selected
      ? "border-cyan bg-cyan/10 shadow-glow-cyan"
      : "border-border hover:border-cyan/40",
  };
  const iconColors = {
    blue: "text-electric-blue-bright",
    violet: "text-violet-bright",
    cyan: "text-cyan-bright",
  };

  return (
    <button
      onClick={() => onSelect(mode.id)}
      className={clsx(
        "p-4 rounded-xl border text-left transition-all duration-200 glass",
        colors[mode.color]
      )}
    >
      <div className={clsx("text-xl mb-2 font-mono", iconColors[mode.color])}>{mode.icon}</div>
      <div className="font-display font-semibold text-sm text-text-primary mb-1">{mode.label}</div>
      <div className="text-text-muted text-xs leading-relaxed">{mode.desc}</div>
    </button>
  );
}

export default function Search() {
  const navigate = useNavigate();
  const { search, searchLoading, repos, totalSnippets, error, setError } = useApp();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("auto");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setError(null);
    try {
      await search(query.trim(), mode);
      navigate("/results");
    } catch {}
  };

  const examples = EXAMPLE_QUERIES[mode] || [];

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-text-primary mb-2">Search Dashboard</h1>
        <div className="flex items-center gap-3 text-text-secondary text-sm">
          <span>{repos.length} repo{repos.length !== 1 ? "s" : ""} indexed</span>
          <span className="text-border">·</span>
          <span className="text-electric-blue-bright font-mono">{totalSnippets.toLocaleString()} snippets</span>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* No repos warning */}
      {repos.length === 0 && (
        <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-center gap-3">
          <span className="text-warning text-lg">⚠</span>
          <div>
            <p className="text-warning text-sm font-medium">No repositories loaded</p>
            <p className="text-text-muted text-xs">
              <button onClick={() => navigate("/repos")} className="text-electric-blue hover:underline">
                Load repositories
              </button>{" "}
              first to enable search.
            </p>
          </div>
        </div>
      )}

      {/* Mode selector */}
      <div className="mb-6">
        <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-3">
          Search Mode
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MODES.map((m) => (
            <ModeCard key={m.id} mode={m} selected={mode === m.id} onSelect={setMode} />
          ))}
        </div>
      </div>

      {/* Query input */}
      <div className="card p-6 mb-6">
        <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-3">
          Query
        </label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSearch();
            }
          }}
          rows={mode === "code" ? 5 : 3}
          placeholder={
            mode === "code"
              ? "Paste a code snippet to find similar implementations…"
              : mode === "intent"
              ? "Describe what the function should do in natural language…"
              : mode === "keyword"
              ? "Enter search terms (e.g. binary_search, BFS, LinkedList)…"
              : "Type anything — keyword, sentence, or code snippet…"
          }
          className="input-field resize-none font-mono text-sm"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="px-2.5 py-1 rounded-md bg-surface-3 border border-border text-text-muted text-xs font-mono hover:text-electric-blue-bright hover:border-electric-blue/30 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            onClick={handleSearch}
            loading={searchLoading}
            disabled={!query.trim() || searchLoading || repos.length === 0}
            className="ml-4 flex-shrink-0"
          >
            {searchLoading ? "Searching…" : "Search"}
            {!searchLoading && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: "💡", tip: "Use camelCase or snake_case identifiers for precise matching" },
          { icon: "🎯", tip: "Intent mode works best with 3+ word descriptive phrases" },
          { icon: "📋", tip: "Code mode finds similar implementations to your snippet" },
        ].map(({ icon, tip }) => (
          <div key={tip} className="glass rounded-lg p-4 flex items-start gap-3">
            <span className="text-base flex-shrink-0">{icon}</span>
            <p className="text-text-muted text-xs leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
