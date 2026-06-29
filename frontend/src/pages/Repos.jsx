// src/pages/Repos.jsx
import { useState } from "react";
import { useApp } from "../utils/AppContext";
import { Button, Input, ErrorAlert, SectionHeader } from "../components/ui";
import clsx from "clsx";

const SAMPLE_REPOS = [
  "https://github.com/TheAlgorithms/Python",
  "https://github.com/TheAlgorithms/Java",
  "https://github.com/TheAlgorithms/C-Plus-Plus",
];

function RepoStatusRow({ item }) {
  const ok = item.status === "loaded";
  return (
    <div className={clsx(
      "flex items-center justify-between p-4 rounded-lg border transition-colors",
      ok ? "bg-success/5 border-success/20" : "bg-danger/5 border-danger/20"
    )}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={clsx("w-2 h-2 rounded-full flex-shrink-0", ok ? "bg-success" : "bg-danger")} />
        <span className="text-text-primary text-sm font-mono truncate">{item.repo}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        {ok ? (
          <span className="text-success text-xs font-mono">{item.snippets?.toLocaleString()} snippets</span>
        ) : (
          <span className="text-danger text-xs truncate max-w-[180px]">{item.status}</span>
        )}
        <span className={clsx(
          "badge",
          ok ? "bg-success/10 text-success border-success/30 border" : "bg-danger/10 text-danger border-danger/30 border"
        )}>
          {ok ? "Loaded" : "Failed"}
        </span>
      </div>
    </div>
  );
}

export default function Repos() {
  const { loadRepositories, repoStatus, totalSnippets, repoLoading, error, setError } = useApp();
  const [input, setInput] = useState("");
  const [queue, setQueue] = useState([]);

  const addRepo = () => {
    const url = input.trim();
    if (!url) return;
    if (queue.includes(url)) return;
    setQueue((q) => [...q, url]);
    setInput("");
  };

  const removeRepo = (url) => setQueue((q) => q.filter((r) => r !== url));

  const handleLoad = async () => {
    if (queue.length === 0) return;
    setError(null);
    try {
      await loadRepositories(queue);
      setQueue([]);
    } catch {}
  };

  const useSample = () => setQueue(SAMPLE_REPOS);

  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeader
        title="Repository Loader"
        subtitle="Add GitHub repository URLs to index. The backend will clone, parse, and extract snippets automatically."
      />

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Input */}
      <div className="card p-6 mb-6">
        <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-3">
          GitHub Repository URL
        </label>
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRepo()}
            placeholder="https://github.com/owner/repo"
            className="flex-1"
          />
          <Button variant="primary" onClick={addRepo} disabled={!input.trim()}>
            Add
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-text-muted text-xs">Try samples:</span>
          <button
            onClick={useSample}
            className="text-electric-blue text-xs font-mono hover:text-electric-blue-bright transition-colors"
          >
            TheAlgorithms (Python + Java + C++)
          </button>
        </div>
      </div>

      {/* Queue */}
      {queue.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-primary font-display font-semibold text-sm">
              Queue ({queue.length})
            </h3>
            <button onClick={() => setQueue([])} className="text-text-muted text-xs hover:text-danger transition-colors">
              Clear all
            </button>
          </div>
          <div className="space-y-2 mb-5">
            {queue.map((url) => (
              <div key={url} className="flex items-center justify-between p-3 rounded-lg bg-surface-3 border border-border">
                <span className="text-text-secondary text-sm font-mono truncate">{url}</span>
                <button
                  onClick={() => removeRepo(url)}
                  className="ml-3 text-text-muted hover:text-danger transition-colors flex-shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="primary"
            onClick={handleLoad}
            loading={repoLoading}
            disabled={repoLoading}
            className="w-full justify-center"
          >
            {repoLoading ? "Loading Repositories…" : `Load ${queue.length} Repositor${queue.length === 1 ? "y" : "ies"}`}
          </Button>
        </div>
      )}

      {/* Loading progress */}
      {repoLoading && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 border-2 border-electric-blue border-t-transparent rounded-full animate-spin" />
            <span className="text-text-primary text-sm font-display font-medium">Cloning and indexing repositories…</span>
          </div>
          <div className="space-y-2">
            {["Cloning repository", "Parsing source files", "Extracting snippets", "Building index"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-surface-3 border border-border shimmer" />
                <span className="text-text-muted text-xs">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {repoStatus.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-text-primary">Loaded Repositories</h3>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono">
              <span className="glow-dot" />
              <span className="text-electric-blue-bright">{totalSnippets.toLocaleString()} total snippets</span>
            </div>
          </div>
          <div className="space-y-2">
            {repoStatus.map((item, i) => (
              <RepoStatusRow key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {repoStatus.length === 0 && queue.length === 0 && !repoLoading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4 text-3xl">
            🗂️
          </div>
          <h3 className="font-display font-semibold text-text-primary mb-2">No repositories loaded</h3>
          <p className="text-text-secondary text-sm max-w-sm mx-auto">
            Add a GitHub repository URL above and click Load to begin indexing.
          </p>
        </div>
      )}
    </div>
  );
}
