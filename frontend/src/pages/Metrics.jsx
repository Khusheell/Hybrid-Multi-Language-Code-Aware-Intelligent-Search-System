import { useState } from "react";
import { useApp } from "../utils/AppContext";
import {
  Button,
  StatCard,
  SectionHeader,
  ErrorAlert
} from "../components/ui";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const EMPTY = {
  precision_at_5: 0,
  recall_at_5: 0,
  mrr: 0,
  ndcg_at_5: 0,
  top1_hit_rate: 0,
  top5_hit_rate: 0,
  avg_latency_ms: 0,
  hybrid_gain_pct: 0,
  hybrid_wins: 0,
  structural_wins: 0,
  ties: 0
};

export default function Metrics() {
  const {
    runMetrics,
    metricsLoading,
    repos,
    error,
    setError
  } = useApp();

  const [liveMetrics, setLiveMetrics] = useState(null);

  const handleRun = async () => {
  setError(null);

  try {
    const data = await runMetrics();

if (data.error) {
  setError(data.error);
  return;
}

setLiveMetrics(data);
    const payload = data.results || data.metrics || data;

    setLiveMetrics(payload);
  } catch (e) {
    console.error(e);
  }
};

 const m = { ...EMPTY, ...(liveMetrics || {}) };

  const radarData = [
    { metric: "Precision@5", value: m.precision_at_5 * 100 },
    { metric: "Recall@5", value: m.recall_at_5 * 100 },
    { metric: "MRR", value: m.mrr * 100 },
    { metric: "NDCG@5", value: m.ndcg_at_5 * 100 },
    { metric: "Top1", value: m.top1_hit_rate * 100 },
    { metric: "Top5", value: m.top5_hit_rate * 100 }
  ];

  const barData = [
    { name: "Hybrid", value: m.hybrid_wins },
    { name: "Structural", value: m.structural_wins },
    { name: "Tie", value: m.ties }
  ];

const fmt = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? "0.000" : n.toFixed(3);
};
  return (
    <div>
      <SectionHeader
        title="Metrics Dashboard"
        subtitle="Live benchmark metrics from backend evaluator"
        right={
          <Button
            variant="primary"
            onClick={handleRun}
            loading={metricsLoading}
            disabled={repos.length === 0}
          >
            {metricsLoading ? "Running..." : "Run Evaluation"}
          </Button>
        }
      />

      {error && (
        <div className="mb-6">
          <ErrorAlert
            message={error}
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
  <StatCard label="Precision@5" value={fmt(m.precision_at_5)} color="blue" icon="🎯" />
  <StatCard label="Recall@5" value={fmt(m.recall_at_5)} color="violet" icon="📡" />
  <StatCard label="MRR" value={fmt(m.mrr)} color="cyan" icon="⚡" />
  <StatCard label="NDCG@5" value={fmt(m.ndcg_at_5)} color="blue" icon="📊" />
</div>

<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
  <StatCard label="Top-1 Hit" value={fmt(m.top1_hit_rate)} color="violet" icon="🥇" />
  <StatCard label="Top-5 Hit" value={fmt(m.top5_hit_rate)} color="cyan" icon="🏅" />
  <StatCard label="Latency" value={`${m.avg_latency_ms} ms`} color="blue" icon="⏱" />
  <StatCard label="Hybrid Gain" value={`${m.hybrid_gain_pct}%`} color="violet" icon="🚀" />
</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="card p-6">
          <h3 className="mb-4 font-bold">Metric Radar</h3>

          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <Radar
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-bold">
            Hybrid vs Structural
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {barData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    index === 0
                      ? "#22c55e"
                      : index === 1
                      ? "#8b5cf6"
                      : "#64748b"
                }
             />
            ))}
            </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}