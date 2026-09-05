"use client";

import { useState } from "react";
import { useDispute, useSubmitEvidence, useStartReview, useResolveDispute } from "@/lib/hooks/useAIArbitrator";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { ArrowLeft, Send, Play, Gavel, FileText, User, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

interface DisputeDetailProps {
  disputeId: number;
  onBack: () => void;
}

const stateConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  open: { icon: Clock, color: "rgba(255,200,50,0.9)", label: "Open" },
  evidence_submitted: { icon: FileText, color: "rgba(100,180,255,0.9)", label: "Evidence Submitted" },
  under_review: { icon: Gavel, color: "rgba(180,130,255,0.9)", label: "Under Review" },
  decided: { icon: CheckCircle, color: "rgba(80,220,130,0.9)", label: "Decided" },
};

const verdictConfig: Record<string, { color: string; label: string }> = {
  PLAINTIFF_WINS: { color: "#50DC82", label: "Plaintiff Wins" },
  DEFENDANT_WINS: { color: "#FF6B6B", label: "Defendant Wins" },
  SPLIT: { color: "#FFC832", label: "Split Decision" },
  DISMISSED: { color: "#636366", label: "Dismissed" },
};

const evidenceTypeIcons: Record<string, string> = {
  text: "📄", url: "🔗", image: "🖼️", document: "📋",
};

export function DisputeDetail({ disputeId, onBack }: DisputeDetailProps) {
  const { data: dispute, isLoading } = useDispute(disputeId);
  const { address } = useWallet();
  const { submitEvidence, isPending: isSubmittingEvidence } = useSubmitEvidence();
  const { startReview, isPending: isStartingReview } = useStartReview();
  const { resolveDispute, isPending: isResolving } = useResolveDispute();

  const [evidenceType, setEvidenceType] = useState("text");
  const [evidenceData, setEvidenceData] = useState("");
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState<number | null>(null);

  const isParty = address && (dispute?.plaintiff === address || dispute?.defendant === address);
  const isPlaintiff = address && dispute?.plaintiff === address;
  const isDefendant = address && dispute?.defendant === address;

  const formatAddress = (addr: string) => `${addr?.slice(0, 6)}...${addr?.slice(-4)}`;

  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceData) return;
    submitEvidence(
      { disputeId, evidenceType, data: evidenceData },
      { onSuccess: () => { setEvidenceData(""); setShowEvidenceForm(false); } }
    );
  };

  const steps = [
    { key: "open", label: "Dispute Filed", done: true },
    { key: "evidence_submitted", label: "Evidence Submitted", done: dispute?.state === "evidence_submitted" || dispute?.state === "under_review" || dispute?.state === "decided" },
    { key: "under_review", label: "AI Review", done: dispute?.state === "under_review" || dispute?.state === "decided" },
    { key: "decided", label: "Verdict", done: dispute?.state === "decided" },
  ];

  if (isLoading) {
    return (
      <div className="brand-card p-6 space-y-4">
        <div className="h-8 w-32 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="h-4 w-48 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
        <div className="h-32 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="brand-card p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-white/10" />
        <p className="text-white/40 mb-4">Dispute not found</p>
        <button onClick={onBack} className="btn-secondary">Back to disputes</button>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.key === dispute.state);

  return (
    <div className="brand-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white/95">{dispute.title}</h2>
            <p className="text-sm text-white/30">Dispute #{dispute.id}</p>
          </div>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: `${stateConfig[dispute.state]?.color}15`, color: stateConfig[dispute.state]?.color, border: `1px solid ${stateConfig[dispute.state]?.color}25` }}
        >
          {stateConfig[dispute.state]?.label}
        </div>
      </div>

      {/* Status Flow */}
      <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = stateConfig[step.key]?.icon || Clock;
            const isCurrent = index === currentStepIndex;
            const isDone = step.done;

            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: isDone ? "rgba(255,255,255,0.08)" : isCurrent ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                      color: isDone || isCurrent ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                      boxShadow: isCurrent ? "0 0 0 2px rgba(255,255,255,0.1)" : "none",
                    }}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] mt-2 text-center ${isCurrent ? "text-white/70 font-medium" : "text-white/25"}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px mx-2 mt-[-16px]" style={{ background: isDone ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Plaintiff", addr: dispute.plaintiff, isUser: isPlaintiff, icon: User, userColor: "rgba(255,255,255,0.7)" },
          { label: "Defendant", addr: dispute.defendant, isUser: isDefendant, icon: User, userColor: "#FF6B6B" },
        ].map((party) => (
          <div
            key={party.label}
            className="rounded-xl p-4"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${party.isUser ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <party.icon className="w-3.5 h-3.5" style={{ color: party.isUser ? party.userColor : "rgba(255,255,255,0.3)" }} />
              <span className="text-[10px] text-white/35 uppercase tracking-wide">{party.label}</span>
              {party.isUser && (
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>You</span>
              )}
            </div>
            <p className="font-mono text-xs text-white/60 break-all">{formatAddress(party.addr)}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <span className="text-white/30 text-xs block mb-2">Description</span>
        <p className="text-sm text-white/60 rounded-xl p-4 leading-relaxed" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {dispute.description}
        </p>
      </div>

      {/* Verdict */}
      {dispute.verdict && dispute.verdict !== "none" && dispute.verdict !== "" && (
        <div className="rounded-xl p-5" style={{ background: `${verdictConfig[dispute.verdict]?.color}08`, border: `1px solid ${verdictConfig[dispute.verdict]?.color}20` }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${verdictConfig[dispute.verdict]?.color}15` }}>
              <Gavel className="w-5 h-5" style={{ color: verdictConfig[dispute.verdict]?.color }} />
            </div>
            <div>
              <span className="text-lg font-bold" style={{ color: verdictConfig[dispute.verdict]?.color }}>
                {verdictConfig[dispute.verdict]?.label}
              </span>
              <p className="text-xs text-white/35">AI Judge Verdict</p>
            </div>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">{dispute.explanation}</p>
        </div>
      )}

      {/* Evidence Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-white/40" />
            <span className="text-sm font-medium text-white/70">Evidence Timeline</span>
            <span className="text-[10px] text-white/25 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
              {dispute.evidence.length}
            </span>
          </div>
          {isParty && dispute.state !== "decided" && (
            <button
              onClick={() => setShowEvidenceForm(!showEvidenceForm)}
              className="text-xs text-white/40 hover:text-white/60 transition-colors flex items-center gap-1"
            >
              {showEvidenceForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showEvidenceForm ? "Hide" : "Submit Evidence"}
            </button>
          )}
        </div>

        {/* Evidence Form */}
        {showEvidenceForm && isParty && dispute.state !== "decided" && (
          <form onSubmit={handleSubmitEvidence} className="mb-4 p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex gap-2">
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value)}
                className="rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <option value="text">Text</option>
                <option value="url">URL</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
              </select>
              <input
                type="text"
                value={evidenceData}
                onChange={(e) => setEvidenceData(e.target.value)}
                placeholder="Enter evidence data..."
                className="flex-1 rounded-lg px-3 py-2 text-sm text-white/70 placeholder:text-white/20 focus:outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowEvidenceForm(false)} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" disabled={isSubmittingEvidence || !evidenceData} className="btn-primary text-xs flex items-center gap-1">
                <Send className="w-3 h-3" />
                {isSubmittingEvidence ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}

        {/* Evidence List */}
        {dispute.evidence.length === 0 ? (
          <div className="text-center py-8 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <FileText className="w-8 h-8 mx-auto mb-2 text-white/10" />
            <p className="text-sm text-white/25">No evidence submitted yet</p>
            {isParty && dispute.state !== "decided" && (
              <button onClick={() => setShowEvidenceForm(true)} className="text-xs text-white/40 hover:text-white/60 mt-2 transition-colors">
                Be the first to submit evidence
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {dispute.evidence.map((ev, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="p-4 cursor-pointer" onClick={() => setExpandedEvidence(expandedEvidence === i ? null : i)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{evidenceTypeIcons[ev.evidence_type] || "📄"}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-medium uppercase tracking-wide text-white/30">{ev.evidence_type}</span>
                          {ev.submitter === address && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Yours</span>
                          )}
                        </div>
                        <p className={`text-sm text-white/60 ${expandedEvidence === i ? "" : "line-clamp-2"}`}>{ev.data}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/20">#{i + 1}</span>
                  </div>
                </div>
                {expandedEvidence === i && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="flex items-center gap-2 text-[10px] text-white/25">
                      <User className="w-3 h-3" />
                      <span className="font-mono">{formatAddress(ev.submitter)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {isParty && dispute.state !== "decided" && (
        <div className="border-t border-white/[0.06] pt-4 space-y-3">
          {isPlaintiff && dispute.state === "evidence_submitted" && (
            <button onClick={() => startReview(disputeId)} disabled={isStartingReview} className="btn-primary w-full flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              {isStartingReview ? "Starting AI Review..." : "Start AI Review"}
            </button>
          )}
          {isPlaintiff && dispute.state === "under_review" && (
            <button onClick={() => resolveDispute(disputeId)} disabled={isResolving} className="btn-primary w-full flex items-center justify-center gap-2">
              <Gavel className="w-4 h-4" />
              {isResolving ? "Resolving..." : "Resolve Dispute (AI Judge)"}
            </button>
          )}
          {isPlaintiff && dispute.state === "open" && (
            <p className="text-xs text-white/25 text-center">Submit evidence to proceed to the next step</p>
          )}
          {isDefendant && dispute.state === "open" && (
            <p className="text-xs text-white/25 text-center">You have been named as the defendant. Submit your evidence to defend yourself.</p>
          )}
        </div>
      )}
    </div>
  );
}
