/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050810",
        surface: "#0a0f1e",
        "surface-2": "#0f172a",
        "surface-3": "#131c35",
        border: "#1e2d4a",
        "border-bright": "#2a3f6a",
        "electric-blue": "#3b82f6",
        "electric-blue-bright": "#60a5fa",
        "electric-blue-glow": "#1d4ed8",
        violet: "#7c3aed",
        "violet-bright": "#8b5cf6",
        "violet-glow": "#5b21b6",
        cyan: "#06b6d4",
        "cyan-bright": "#22d3ee",
        "text-primary": "#e2e8f0",
        "text-secondary": "#94a3b8",
        "text-muted": "#475569",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(124,58,237,0.1), transparent)",
        "card-gradient": "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(10,15,30,0.9) 100%)",
        "glow-gradient": "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(124,58,237,0.1))",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(59,130,246,0.3), 0 0 40px rgba(59,130,246,0.1)",
        "glow-violet": "0 0 20px rgba(124,58,237,0.3), 0 0 40px rgba(124,58,237,0.1)",
        "glow-cyan": "0 0 15px rgba(6,182,212,0.3)",
        card: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.2)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
        "scan-line": "scanLine 3s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scanLine: {
          "0%, 100%": { opacity: 0 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
