"use client";

import { useDisputes } from "@/lib/hooks/useAIArbitrator";
import { Scale, Clock, FileText, Gavel, CheckCircle, TrendingUp } from "lucide-react";

export function StatsDashboard() {
  const { data: disputes = [] } = useDisputes();

  const stats = {
    total: disputes.length,
    open: disputes.filter((d) => d.state === "open").length,
    evidenceSubmitted: disputes.filter((d) => d.state === "evidence_submitted").length,
    underReview: disputes.filter((d) => d.state === "under_review").length,
    decided: disputes.filter((d) => d.state === "decided").length,
    plaintiffWins: disputes.filter((d) => d.verdict === "PLAINTIFF_WINS").length,
    defendantWins: disputes.filter((d) => d.verdict === "DEFENDANT_WINS").length,
    split: disputes.filter((d) => d.verdict === "SPLIT").length,
    dismissed: disputes.filter((d) => d.verdict === "DISMISSED").length,
  };

  const winRate = stats.decided > 0
    ? Math.round((stats.plaintiffWins / stats.decided) * 100)
    : 0;

  const statCards = [
    { label: "Total Disputes", value: stats.total, icon: Scale, accent: "rgba(255,255,255,0.7)" },
    { label: "Open", value: stats.open, icon: Clock, accent: "rgba(255,200,50,0.8)" },
    { label: "Evidence", value: stats.evidenceSubmitted, icon: FileText, accent: "rgba(100,180,255,0.8)" },
    { label: "Review", value: stats.underReview, icon: Gavel, accent: "rgba(180,130,255,0.8)" },
    { label: "Decided", value: stats.decided, icon: CheckCircle, accent: "rgba(80,220,130,0.8)" },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 flex flex-col items-center gap-2.5 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(18,18,26,0.9) 0%, rgba(14,14,20,0.95) 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.03), 0 1px 3px 0 rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 4px 12px 0 rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 0 rgba(255,255,255,0.03), 0 1px 3px 0 rgba(0,0,0,0.3)";
            }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.accent }} />
            </div>
            <span className="text-2xl font-bold text-white/95">{stat.value}</span>
            <span className="text-[11px] text-white/40 text-center">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Verdict Stats */}
      {stats.decided > 0 && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(18,18,26,0.9) 0%, rgba(14,14,20,0.95) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.03)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-white/60" />
            <span className="text-sm font-medium text-white/80">Verdict Breakdown</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Plaintiff Wins", count: stats.plaintiffWins, color: "#50DC82" },
              { label: "Defendant Wins", count: stats.defendantWins, color: "#FF6B6B" },
              { label: "Split", count: stats.split, color: "#FFC832" },
              { label: "Dismissed", count: stats.dismissed, color: "#636366" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-sm text-white/40">{item.label}</span>
                <span className="text-sm font-medium text-white/80 ml-auto">{item.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Plaintiff Win Rate</span>
              <span className="text-xs font-medium text-white/70">{winRate}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${winRate}%`,
                  background: "linear-gradient(90deg, #50DC82 0%, #3CB371 100%)",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
