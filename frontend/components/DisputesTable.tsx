"use client";

import { useState, useMemo } from "react";
import { useDisputes, useDisputeCount } from "@/lib/hooks/useAIArbitrator";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { Shield, Clock, CheckCircle, AlertCircle, Gavel, FileText, Search, Filter, X } from "lucide-react";
import type { Dispute } from "@/lib/contracts/types";

const stateIcons: Record<string, React.ReactNode> = {
  open: <Clock className="w-3.5 h-3.5 text-yellow-400" />,
  evidence_submitted: <FileText className="w-3.5 h-3.5 text-blue-400" />,
  under_review: <Gavel className="w-3.5 h-3.5 text-purple-400" />,
  decided: <CheckCircle className="w-3.5 h-3.5 text-green-400" />,
};

const stateLabels: Record<string, string> = {
  open: "Open",
  evidence_submitted: "Evidence",
  under_review: "Review",
  decided: "Decided",
};

const stateColors: Record<string, string> = {
  open: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  evidence_submitted: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  under_review: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  decided: "bg-green-400/10 text-green-400 border-green-400/20",
};

const verdictLabels: Record<string, string> = {
  PLAINTIFF_WINS: "Plaintiff Wins",
  DEFENDANT_WINS: "Defendant Wins",
  SPLIT: "Split",
  DISMISSED: "Dismissed",
};

const verdictColors: Record<string, string> = {
  PLAINTIFF_WINS: "text-green-400",
  DEFENDANT_WINS: "text-red-400",
  SPLIT: "text-yellow-400",
  DISMISSED: "text-gray-400",
};

interface DisputesTableProps {
  onSelectDispute: (id: number) => void;
  selectedId: number | null;
}

export function DisputesTable({ onSelectDispute, selectedId }: DisputesTableProps) {
  const { data: disputes = [], isLoading } = useDisputes();
  const { data: count = 0 } = useDisputeCount();
  const { address } = useWallet();

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

      const matchesStatus =
        statusFilter === "all" || dispute.state === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [disputes, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      all: disputes.length,
      open: disputes.filter((d) => d.state === "open").length,
      evidence_submitted: disputes.filter((d) => d.state === "evidence_submitted").length,
      under_review: disputes.filter((d) => d.state === "under_review").length,
      decided: disputes.filter((d) => d.state === "decided").length,
    };
  }, [disputes]);

  if (isLoading) {
    return (
      <div className="brand-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">Disputes</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted/30 rounded-xl animate-pulse" />
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
          <Shield className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">Disputes</h2>
        </div>
        <span className="text-sm text-muted-foreground">{count} total</span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, address, or ID..."
          className="w-full bg-input/50 border border-border rounded-lg pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              statusFilter === status
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-muted/20 text-muted-foreground border border-transparent hover:bg-muted/30"
            }`}
          >
            {status !== "all" && stateIcons[status]}
            <span>{status === "all" ? "All" : stateLabels[status]}</span>
            <span className="text-[10px] opacity-70">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* Dispute List */}
      {filteredDisputes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {searchQuery || statusFilter !== "all"
              ? "No disputes match your search"
              : "No disputes yet"}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-xs text-accent hover:underline mt-2"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
          {filteredDisputes.map((dispute) => (
            <button
              key={dispute.id}
              onClick={() => onSelectDispute(Number(dispute.id))}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedId === Number(dispute.id)
                  ? "bg-accent/10 border-accent/50 shadow-lg shadow-accent/5"
                  : "bg-card/30 border-border/50 hover:bg-card/50 hover:border-border hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${stateColors[dispute.state]}`}>
                      {stateIcons[dispute.state]}
                      {stateLabels[dispute.state]}
                    </span>
                    <span className="text-[10px] text-muted-foreground">#{dispute.id}</span>
                  </div>
                  <p className="text-sm font-medium truncate mb-1.5">{dispute.title}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="font-mono">{formatAddress(dispute.plaintiff)}</span>
                    <span className="opacity-50">vs</span>
                    <span className="font-mono">{formatAddress(dispute.defendant)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {dispute.verdict && dispute.verdict !== "none" && dispute.verdict !== "" && (
                    <span className={`text-[11px] font-medium ${verdictColors[dispute.verdict]}`}>
                      {verdictLabels[dispute.verdict]}
                    </span>
                  )}
                  {dispute.evidence.length > 0 && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {dispute.evidence.length}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
