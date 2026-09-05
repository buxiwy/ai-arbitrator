"use client";

import { useState, useMemo } from "react";
import { useDisputes, useDisputeCount, useUserDisputes } from "@/lib/hooks/useAIArbitrator";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { Shield, Clock, CheckCircle, AlertCircle, Gavel, FileText, Search, X } from "lucide-react";
import type { Dispute } from "@/lib/contracts/types";

const stateIcons: Record<string, React.ReactNode> = {
  open: <Clock className="w-3 h-3" />,
  evidence_submitted: <FileText className="w-3 h-3" />,
  under_review: <Gavel className="w-3 h-3" />,
  decided: <CheckCircle className="w-3 h-3" />,
};

const stateLabels: Record<string, string> = {
  open: "Open",
  evidence_submitted: "Evidence",
  under_review: "Review",
  decided: "Decided",
};

const stateStyles: Record<string, { bg: string; text: string; border: string }> = {
  open: { bg: "rgba(255,200,50,0.08)", text: "rgba(255,200,50,0.9)", border: "rgba(255,200,50,0.15)" },
  evidence_submitted: { bg: "rgba(100,180,255,0.08)", text: "rgba(100,180,255,0.9)", border: "rgba(100,180,255,0.15)" },
  under_review: { bg: "rgba(180,130,255,0.08)", text: "rgba(180,130,255,0.9)", border: "rgba(180,130,255,0.15)" },
  decided: { bg: "rgba(80,220,130,0.08)", text: "rgba(80,220,130,0.9)", border: "rgba(80,220,130,0.15)" },
};

const verdictLabels: Record<string, string> = {
  PLAINTIFF_WINS: "Plaintiff Wins",
  DEFENDANT_WINS: "Defendant Wins",
  SPLIT: "Split",
  DISMISSED: "Dismissed",
};

const verdictColors: Record<string, string> = {
  PLAINTIFF_WINS: "#50DC82",
  DEFENDANT_WINS: "#FF6B6B",
  SPLIT: "#FFC832",
  DISMISSED: "#636366",
};

interface DisputesTableProps {
  onSelectDispute: (id: number) => void;
  selectedId: number | null;
  filterByAddress?: boolean;
}

export function DisputesTable({ onSelectDispute, selectedId, filterByAddress }: DisputesTableProps) {
  const { data: allDisputes = [], isLoading: isLoadingAll } = useDisputes();
  const { data: userDisputes = [], isLoading: isLoadingUser } = useUserDisputes();
  const { data: count = 0 } = useDisputeCount();
  const { address } = useWallet();

  const disputes = filterByAddress ? userDisputes : allDisputes;
  const isLoading = filterByAddress ? isLoadingUser : isLoadingAll;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const formatAddress = (addr: string) => `${addr?.slice(0, 6)}...${addr?.slice(-4)}`;

  const filteredDisputes = useMemo(() => {
    return disputes.filter((dispute) => {
      const matchesSearch =
        searchQuery === "" ||
        dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispute.plaintiff.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispute.defendant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispute.id.toString().includes(searchQuery);
      const matchesStatus = statusFilter === "all" || dispute.state === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [disputes, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => ({
    all: disputes.length,
    open: disputes.filter((d) => d.state === "open").length,
    evidence_submitted: disputes.filter((d) => d.state === "evidence_submitted").length,
    under_review: disputes.filter((d) => d.state === "under_review").length,
    decided: disputes.filter((d) => d.state === "decided").length,
  }), [disputes]);

  if (isLoading) {
    return (
      <div className="brand-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-white/60" />
          <h2 className="text-lg font-bold text-white/90">Disputes</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="brand-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-white/60" />
          <h2 className="text-lg font-bold text-white/90">Disputes</h2>
        </div>
        <span className="text-sm text-white/30">{count} total</span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, address, or ID..."
          className="w-full rounded-lg pl-10 pr-8 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(["all", "open", "evidence_submitted", "under_review", "decided"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
            style={{
              color: statusFilter === status ? "#F5F5F7" : "rgba(255,255,255,0.35)",
              background: statusFilter === status ? "rgba(255,255,255,0.08)" : "transparent",
              border: `1px solid ${statusFilter === status ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}`,
            }}
          >
            {status !== "all" && <span style={{ color: stateStyles[status]?.text }}>{stateIcons[status]}</span>}
            <span>{status === "all" ? "All" : stateLabels[status]}</span>
            <span className="text-[10px] opacity-60">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* Dispute List */}
      {filteredDisputes.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-white/10" />
          <p className="text-sm text-white/30">
            {searchQuery || statusFilter !== "all" ? "No disputes match your search" : "No disputes yet"}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
              className="text-xs text-white/50 hover:text-white/70 mt-2 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[600px] overflow-y-auto custom-scrollbar">
          {filteredDisputes.map((dispute) => {
            const isSelected = selectedId === Number(dispute.id);
            const style = stateStyles[dispute.state] || stateStyles.open;

            return (
              <button
                key={dispute.id}
                onClick={() => onSelectDispute(Number(dispute.id))}
                className="w-full text-left p-4 rounded-xl transition-all duration-200"
                style={{
                  background: isSelected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isSelected ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}`,
                  boxShadow: isSelected ? "0 0 20px rgba(255,255,255,0.02)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                  }
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
                      >
                        {stateIcons[dispute.state]}
                        {stateLabels[dispute.state]}
                      </span>
                      <span className="text-[10px] text-white/25">#{dispute.id}</span>
                    </div>
                    <p className="text-sm font-medium text-white/85 truncate mb-1.5">{dispute.title}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                      <span className="font-mono">{formatAddress(dispute.plaintiff)}</span>
                      <span className="opacity-40">vs</span>
                      <span className="font-mono">{formatAddress(dispute.defendant)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {dispute.verdict && dispute.verdict !== "none" && dispute.verdict !== "" && (
                      <span className="text-[11px] font-medium" style={{ color: verdictColors[dispute.verdict] || "#8E8E93" }}>
                        {verdictLabels[dispute.verdict]}
                      </span>
                    )}
                    {dispute.evidence.length > 0 && (
                      <span className="text-[10px] text-white/25 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {dispute.evidence.length}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
