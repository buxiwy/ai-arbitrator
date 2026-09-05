"use client";

import { useDisputes } from "@/lib/hooks/useAIArbitrator";
import { Scale, Clock, FileText, Gavel, CheckCircle, TrendingUp, Users, AlertTriangle } from "lucide-react";

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
    {
      label: "Total Disputes",
      value: stats.total,
      icon: Scale,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Open",
      value: stats.open,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      label: "Evidence Submitted",
      value: stats.evidenceSubmitted,
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: "Under Review",
      value: stats.underReview,
      icon: Gavel,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      label: "Decided",
      value: stats.decided,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="brand-card p-4 flex flex-col items-center gap-2"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-2xl font-bold">{stat.value}</span>
            <span className="text-xs text-muted-foreground text-center">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Verdict Stats */}
      {stats.decided > 0 && (
        <div className="brand-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Verdict Breakdown</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-sm text-muted-foreground">Plaintiff Wins</span>
              <span className="text-sm font-medium ml-auto">{stats.plaintiffWins}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-sm text-muted-foreground">Defendant Wins</span>
              <span className="text-sm font-medium ml-auto">{stats.defendantWins}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="text-sm text-muted-foreground">Split</span>
              <span className="text-sm font-medium ml-auto">{stats.split}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-sm text-muted-foreground">Dismissed</span>
              <span className="text-sm font-medium ml-auto">{stats.dismissed}</span>
            </div>
          </div>

          {/* Win Rate Bar */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Plaintiff Win Rate</span>
              <span className="text-xs font-medium text-accent">{winRate}%</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${winRate}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
