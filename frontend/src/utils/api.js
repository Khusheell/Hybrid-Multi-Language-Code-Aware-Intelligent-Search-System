// src/utils/api.js
// Mapped to FastAPI backend: api.py

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const request = async (method, path, body = null) => {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
};

// POST /load-repos → { repositories: [{repo, snippets, status}], total_snippets }
export const loadRepos = (repos) => request("POST", "/load-repos", { repos });

// POST /search → { query, detected_mode, count, results: [...] }
export const searchCode = (query, mode = "auto") =>
  request("POST", "/search", { query, mode });

// GET /metrics → runs evaluator and returns message (console output)
export const getMetrics = () => request("GET", "/metrics");

// GET / → health check
export const healthCheck = () => request("GET", "/");

export default { loadRepos, searchCode, getMetrics, healthCheck };
