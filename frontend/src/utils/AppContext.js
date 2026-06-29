// src/utils/AppContext.js
import { createContext, useContext, useState, useCallback } from "react";
import { loadRepos as apiLoadRepos, searchCode as apiSearch, getMetrics as apiMetrics } from "./api";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Repositories
  const [repos, setRepos] = useState([]);
  const [repoStatus, setRepoStatus] = useState([]); // [{repo, snippets, status}]
  const [totalSnippets, setTotalSnippets] = useState(0);
  const [repoLoading, setRepoLoading] = useState(false);

  // Search
  const [searchResults, setSearchResults] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const [detectedMode, setDetectedMode] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Metrics
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  // Errors
  const [error, setError] = useState(null);

  const loadRepositories = useCallback(async (repoUrls) => {
    setRepoLoading(true);
    setError(null);
    try {
      const data = await apiLoadRepos(repoUrls);
      setRepoStatus(data.repositories || []);
      setTotalSnippets(data.total_snippets || 0);
      setRepos(
        (data.repositories || [])
          .filter((r) => r.status === "loaded")
          .map((r) => r.repo)
      );
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setRepoLoading(false);
    }
  }, []);

  const search = useCallback(async (query, mode) => {
    setSearchLoading(true);
    setError(null);
    try {
      const data = await apiSearch(query, mode);
      setSearchResults(data.results || []);
      setLastQuery(data.query || query);
      setDetectedMode(data.detected_mode || mode);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const runMetrics = useCallback(async () => {
    setMetricsLoading(true);
    setError(null);
    try {
      // Backend runs evaluation in console; we show mock structured data
      // When backend is enhanced to return structured metrics, map them here
      const data = await apiMetrics();
      // For now, expose the message; structured mock shown in dashboard
      setMetrics(data);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        repos, repoStatus, totalSnippets, repoLoading,
        searchResults, lastQuery, detectedMode, searchLoading,
        metrics, metricsLoading,
        error, setError,
        loadRepositories, search, runMetrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
