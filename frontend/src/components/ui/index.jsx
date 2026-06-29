// src/components/ui/index.jsx
import clsx from "clsx";

/* ─── BADGE ──────────────────────────────────── */
export const LanguageBadge = ({ lang }) => {
  const map = {
    Python: "badge-python",
    Java: "badge-java",
    "C++": "badge-cpp",
  };
  return (
    <span className={clsx("badge", map[lang] || "badge-unknown")}>
      {lang === "Python" && "🐍 "}
      {lang === "Java" && "☕ "}
      {lang === "C++" && "⚡ "}
      {lang || "Unknown"}
    </span>
  );
};

export const TypeBadge = ({ type }) => {
  const map = {
    function: "badge-function",
    class: "badge-class",
  };
  const icons = { function: "ƒ", class: "◆" };
  return (
    <span className={clsx("badge", map[type?.toLowerCase()] || "badge-unknown")}>
      <span className="mr-1 opacity-60">{icons[type?.toLowerCase()] || "○"}</span>
      {type}
    </span>
  );
};

export const ConfidenceBadge = ({ confidence }) => {
  const colors = {
    High: "bg-success/10 text-success border-success/30",
    Medium: "bg-warning/10 text-warning border-warning/30",
    Low: "bg-danger/10 text-danger border-danger/30",
  };
  return (
    <span className={clsx("badge border", colors[confidence] || colors.Low)}>
      <span className={clsx(
        "w-1.5 h-1.5 rounded-full mr-1.5 inline-block",
        confidence === "High" ? "bg-success" : confidence === "Medium" ? "bg-warning" : "bg-danger"
      )} />
      {confidence}
    </span>
  );
};

/* ─── BUTTON ──────────────────────────────────── */
export const Button = ({ children, variant = "primary", className, disabled, loading, ...props }) => {
  const base = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  }[variant];

  return (
    <button
      className={clsx(base, className, disabled && "opacity-50 cursor-not-allowed")}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </>
      ) : children}
    </button>
  );
};

/* ─── INPUT ─────────────────────────────────── */
export const Input = ({ className, ...props }) => (
  <input className={clsx("input-field", className)} {...props} />
);

/* ─── SCORE BAR ──────────────────────────────── */
export const ScoreBar = ({ score, max = 600 }) => {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="score-bar">
      <div className="score-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
};

/* ─── STAT CARD ──────────────────────────────── */
export const StatCard = ({ label, value, sub, color = "blue", icon }) => {
  const glow = { blue: "shadow-glow-blue", violet: "shadow-glow-violet", cyan: "shadow-glow-cyan" };
  const accent = { blue: "text-electric-blue-bright", violet: "text-violet-bright", cyan: "text-cyan-bright" };
  return (
    <div className={clsx("card p-5 hover:" + glow[color])}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-text-muted text-xs font-mono uppercase tracking-wider">{label}</p>
        {icon && <span className="text-text-muted text-base">{icon}</span>}
      </div>
      <p className={clsx("font-display font-bold text-3xl", accent[color])}>{value}</p>
      {sub && <p className="text-text-muted text-xs mt-1">{sub}</p>}
    </div>
  );
};

/* ─── SPINNER ─────────────────────────────────── */
export const Spinner = ({ size = "md" }) => {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-8 h-8 border-2", lg: "w-12 h-12 border-3" };
  return (
    <div className={clsx(sizes[size], "border-border-bright border-t-electric-blue rounded-full animate-spin")} />
  );
};

/* ─── EMPTY STATE ─────────────────────────────── */
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4 text-3xl">
      {icon}
    </div>
    <h3 className="font-display font-semibold text-lg text-text-primary mb-2">{title}</h3>
    <p className="text-text-secondary text-sm max-w-sm leading-relaxed">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

/* ─── ERROR ALERT ─────────────────────────────── */
export const ErrorAlert = ({ message, onDismiss }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-danger/10 border border-danger/30 text-danger">
    <span className="text-lg mt-0.5">⚠</span>
    <div className="flex-1 text-sm">{message}</div>
    {onDismiss && (
      <button onClick={onDismiss} className="text-danger/60 hover:text-danger text-lg leading-none">×</button>
    )}
  </div>
);

/* ─── SECTION HEADER ──────────────────────────── */
export const SectionHeader = ({ title, subtitle, right }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
    </div>
    {right && <div>{right}</div>}
  </div>
);
