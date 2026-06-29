// src/components/layout/Layout.jsx
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen noise-bg grid-bg relative">
      {/* Ambient glows */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-[600px] h-[400px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 100% 100%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />

      <Navbar />

      <main className="relative z-10 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="relative z-10 border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="text-text-muted text-xs font-mono">
            CodeSearch Engine © 2025 — Hybrid Structural + Semantic Ranking
          </p>
          <div className="flex items-center gap-4 text-text-muted text-xs">
            <span>Python · Java · C++</span>
            <span className="text-border">|</span>
            <span>FastAPI Backend</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
