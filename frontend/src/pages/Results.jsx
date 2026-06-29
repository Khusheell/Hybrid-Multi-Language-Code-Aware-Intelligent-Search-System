// src/pages/Results.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../utils/AppContext";
import { LanguageBadge, TypeBadge, ConfidenceBadge, ScoreBar, Button, EmptyState } from "../components/ui";
import clsx from "clsx";

const LANG_SYNTAX = { Python: "python", Java: "java", "C++": "cpp" };

function ZonePill({ zone }) {
  const colors = {
    Identifier: "bg-electric-blue/10 text-electric-blue-bright border-electric-blue/20",
    "File Path": "bg-violet/10 text-violet-bright border-violet/20",
    "Code Body": "bg-cyan/10 text-cyan-bright border-cyan/20",
    "Exact Match": "bg-success/10 text-success border-success/30",
  };
  return (
    <span className={clsx("badge border text-xs", colors[zone] || "badge-unknown")}>
      {zone}
    </span>
  );
}

function CodeViewer({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg bg-surface border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-2/60">
        <span className="text-text-muted text-xs font-mono">{language}</span>
        <button
          onClick={copy}
          className={clsx(
            "flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md transition-all duration-200",
            copied
              ? "bg-success/20 text-success"
              : "bg-surface-3 text-text-muted hover:text-text-primary hover:bg-border"
          )}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 4V2a1 1 0 00-1-1H2a1 1 0 00-1 1v5a1 1 0 001 1h2" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto max-h-72">
        <pre className="text-text-secondary text-xs font-mono leading-relaxed whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
}

function ResultCard({ result, rank }) {
  const [expanded, setExpanded] = useState(false);

  const scoreColor =
    result.confidence === "High"
      ? "text-success"
      : result.confidence === "Medium"
      ? "text-warning"
      : "text-danger";

  return (
    <div className={clsx(
      "card p-5 transition-all duration-300",
      rank === 1 && "border-electric-blue/30 shadow-glow-blue"
    )}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={clsx(
            "w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold flex-shrink-0",
            rank === 1 ? "bg-electric-blue text-white" : "bg-surface-3 text-text-muted"
          )}>
            {rank}
          </span>
          <h3 className="font-display font-semibold text-text-primary truncate">{result.title}</h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ConfidenceBadge confidence={result.confidence} />
          <span className={clsx("font-mono font-bold text-sm", scoreColor)}>
            {result.score}
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <LanguageBadge lang={result.language} />
        <TypeBadge type={result.type} />
        <span className="text-text-muted text-xs font-mono">📁 {result.repo_name}</span>
        {result.zones?.map((z) => <ZonePill key={z} zone={z} />)}
      </div>

      {/* File path */}
      <div className="mb-3">
        <p className="text-text-muted text-xs font-mono truncate" title={result.file}>
          {result.file}
          {result.start !== undefined && (
            <span className="text-border ml-2">
              L{result.start}–L{result.end}
            </span>
          )}
        </p>
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <ScoreBar score={result.score} />
      </div>

      {/* Why relevant */}
      {result.reasons?.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-surface-3 border border-border">
          <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-1.5">Why relevant</p>
          <ul className="space-y-1">
            {result.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                <span className="text-electric-blue mt-0.5">›</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 text-xs text-text-secondary hover:text-electric-blue-bright transition-colors font-mono mb-3"
      >
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={clsx("transition-transform duration-200", expanded && "rotate-180")}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {expanded ? "Collapse code" : "View code snippet"}
      </button>

      {expanded && (
        <CodeViewer code={result.code} language={result.language} />
      )}
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const { searchResults, lastQuery, detectedMode, searchLoading } = useApp();

  if (searchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-2 border-border border-t-electric-blue rounded-full animate-spin mb-4" />
        <p className="text-text-secondary text-sm">Ranking and reranking results…</p>
      </div>
    );
  }

  if (!searchResults) {
    return (
      <EmptyState
        icon="🔍"
        title="No search yet"
        description="Run a search query to see ranked results here."
        action={<Button variant="primary" onClick={() => navigate("/search")}>Go to Search</Button>}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="font-display font-bold text-2xl text-text-primary">Results</h1>
            <span className="badge bg-electric-blue/10 text-electric-blue-bright border border-electric-blue/20">
              {searchResults.length} found
            </span>
            {detectedMode && (
              <span className="badge bg-violet/10 text-violet-bright border border-violet/20">
                {detectedMode} mode
              </span>
            )}
          </div>
          <p className="text-text-secondary text-sm font-mono truncate">
            "{lastQuery}"
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/search")} className="flex-shrink-0">
          New Search
        </Button>
      </div>

      {searchResults.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No results found"
          description="Try a different query, search mode, or make sure repositories are loaded."
          action={<Button variant="primary" onClick={() => navigate("/search")}>Try Again</Button>}
        />
      ) : (
        <div className="space-y-4">
          {searchResults.map((r, i) => (
            <ResultCard key={`${r.title}-${i}`} result={r} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
