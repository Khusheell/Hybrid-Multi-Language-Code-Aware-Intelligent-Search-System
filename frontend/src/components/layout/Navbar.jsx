// src/components/layout/Navbar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../../utils/AppContext";
import clsx from "clsx";

const NAV_ITEMS = [
  { to: "/", label: "Home", exact: true },
  { to: "/repos", label: "Repositories" },
  { to: "/search", label: "Search" },
  { to: "/metrics", label: "Metrics" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { totalSnippets, repos } = useApp();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-electric-blue/20 group-hover:bg-electric-blue/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 14L7 9L10 12L14 4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="3" cy="14" r="1.5" fill="#7c3aed"/>
                  <circle cx="14" cy="4" r="1.5" fill="#06b6d4"/>
                </svg>
              </div>
            </div>
            <span className="font-display font-bold text-base text-text-primary group-hover:text-electric-blue-bright transition-colors">
              CodeSearch<span className="text-electric-blue">Engine</span>
            </span>
          </NavLink>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  clsx(
                    "px-3 py-1.5 rounded-md text-sm font-body font-medium transition-all duration-150",
                    isActive
                      ? "text-electric-blue-bright bg-electric-blue/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-3">
            {repos.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono">
                <span className="glow-dot" />
                <span className="text-text-secondary">{repos.length} repo{repos.length !== 1 ? "s" : ""}</span>
                <span className="text-text-muted">·</span>
                <span className="text-electric-blue-bright">{totalSnippets.toLocaleString()} snippets</span>
              </div>
            )}
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-slow" title="API Connected" />
          </div>
        </div>
      </div>
    </nav>
  );
}
