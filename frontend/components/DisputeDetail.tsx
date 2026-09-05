"use client";

import { useState } from "react";
import { useDispute, useSubmitEvidence, useStartReview, useResolveDispute } from "@/lib/hooks/useAIArbitrator";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { ArrowLeft, Send, Play, Gavel, FileText, User, Clock, CheckCircle, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface DisputeDetailProps {
  disputeId: number;
  onBack: () => void;
}

const stateConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  open: { icon: Clock, color: "text-yellow-400", bgColor: "bg-yellow-400/10", label: "Open" },
  evidence_submitted: { icon: FileText, color: "text-blue-400", bgColor: "bg-blue-400/10", label: "Evidence Submitted" },
  under_review: { icon: Gavel, color: "text-purple-400", bgColor: "bg-purple-400/10", label: "Under Review" },
  decided: { icon: CheckCircle, color: "text-green-400", bgColor: "bg-green-400/10", label: "Decided" },
};

const verdictConfig: Record<string, { color: string; bgColor: string; borderColor: string; label: string }> = {
  PLAINTIFF_WINS: { color: "text-green-400", bgColor: "bg-green-400/10", borderColor: "border-green-400/30", label: "Plaintiff Wins" },
  DEFENDANT_WINS: { color: "text-red-400", bgColor: "bg-red-400/10", borderColor: "border-red-400/30", label: "Defendant Wins" },
  SPLIT: { color: "text-yellow-400", bgColor: "bg-yellow-400/10", borderColor: "border-yellow-400/30", label: "Split Decision" },
  DISMISSED: { color: "text-gray-400", bgColor: "bg-gray-400/10", borderColor: "border-gray-400/30", label: "Dismissed" },
};

const evidenceTypeIcons: Record<string, string> = {
  text: "📄",
  url: "🔗",
  image: "🖼️",
  document: "📋",
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
      {
        onSuccess: () => {
          setEvidenceData("");
          setShowEvidenceForm(false);
        },
      }
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
        <div className="h-8 w-32 bg-muted/30 rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted/30 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-muted/30 rounded animate-pulse" />
          <div className="h-20 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="h-32 bg-muted/30 rounded animate-pulse" />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="brand-card p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mb-4">Dispute not found</p>
        <button onClick={onBack} className="btn-secondary">
          Back to disputes
        </button>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.key === dispute.state);

  return (
    <div className="brand-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">{dispute.title}</h2>
            <p className="text-sm text-muted-foreground">Dispute #{dispute.id}</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${stateConfig[dispute.state]?.bgColor} ${stateConfig[dispute.state]?.color}`}>
          {stateConfig[dispute.state]?.label}
        </div>
      </div>

      {/* Status Flow */}
      <div className="bg-card/30 rounded-xl p-4 border border-border/50">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = stateConfig[step.key]?.icon || Clock;
            const isCurrent = index === currentStepIndex;
            const isDone = step.done;

            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-accent/20 text-accent"
                        : isCurrent
                        ? "bg-accent/10 text-accent ring-2 ring-accent/30"
                        : "bg-muted/20 text-muted-foreground"
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 text-center ${isCurrent ? "text-accent font-medium" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-[-20px] ${isDone ? "bg-accent" : "bg-muted/30"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`bg-card/30 rounded-xl p-4 border ${isPlaintiff ? "border-accent/50" : "border-border/50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Plaintiff</span>
            {isPlaintiff && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">You</span>}
          </div>
          <p className="font-mono text-sm break-all">{formatAddress(dispute.plaintiff)}</p>
        </div>
        <div className={`bg-card/30 rounded-xl p-4 border ${isDefendant ? "border-accent/50" : "border-border/50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-red-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Defendant</span>
            {isDefendant && <span className="text-xs bg-red-400/20 text-red-400 px-2 py-0.5 rounded-full">You</span>}
          </div>
          <p className="font-mono text-sm break-all">{formatAddress(dispute.defendant)}</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <span className="text-muted-foreground text-sm block mb-2">Description</span>
        <p className="text-sm bg-card/30 rounded-xl p-4 border border-border/50 leading-relaxed">
          {dispute.description}
        </p>
      </div>

      {/* Verdict */}
      {dispute.verdict && dispute.verdict !== "none" && dispute.verdict !== "" && (
        <div className={`rounded-xl p-5 border ${verdictConfig[dispute.verdict]?.bgColor} ${verdictConfig[dispute.verdict]?.borderColor}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-full ${verdictConfig[dispute.verdict]?.bgColor} flex items-center justify-center`}>
              <Gavel className={`w-6 h-6 ${verdictConfig[dispute.verdict]?.color}`} />
            </div>
            <div>
              <span className={`text-lg font-bold ${verdictConfig[dispute.verdict]?.color}`}>
                {verdictConfig[dispute.verdict]?.label}
              </span>
              <p className="text-sm text-muted-foreground">AI Judge Verdict</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">{dispute.explanation}</p>
        </div>
      )}

      {/* Evidence Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Evidence Timeline</span>
            <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
              {dispute.evidence.length}
            </span>
          </div>
          {isParty && dispute.state !== "decided" && (
            <button
              onClick={() => setShowEvidenceForm(!showEvidenceForm)}
              className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
            >
              {showEvidenceForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showEvidenceForm ? "Hide Form" : "Submit Evidence"}
            </button>
          )}
        </div>

        {/* Evidence Form */}
        {showEvidenceForm && isParty && dispute.state !== "decided" && (
          <form onSubmit={handleSubmitEvidence} className="mb-4 p-4 bg-card/30 rounded-xl border border-accent/30 space-y-3">
            <div className="flex gap-2">
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value)}
                className="bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="text">📄 Text</option>
                <option value="url">🔗 URL</option>
                <option value="image">🖼️ Image</option>
                <option value="document">📋 Document</option>
              </select>
              <input
                type="text"
                value={evidenceData}
                onChange={(e) => setEvidenceData(e.target.value)}
                placeholder="Enter evidence data..."
                className="flex-1 bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEvidenceForm(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingEvidence || !evidenceData}
                className="btn-primary text-xs flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                {isSubmittingEvidence ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}

        {/* Evidence List */}
        {dispute.evidence.length === 0 ? (
          <div className="text-center py-8 bg-card/30 rounded-xl border border-border/50">
            <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-30" />
            <p className="text-sm text-muted-foreground">No evidence submitted yet</p>
            {isParty && dispute.state !== "decided" && (
              <button
                onClick={() => setShowEvidenceForm(true)}
                className="text-xs text-accent hover:underline mt-2"
              >
                Be the first to submit evidence
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {dispute.evidence.map((ev, i) => (
              <div
                key={i}
                className="bg-card/30 rounded-xl border border-border/50 overflow-hidden transition-all hover:border-border"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedEvidence(expandedEvidence === i ? null : i)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{evidenceTypeIcons[ev.evidence_type] || "📄"}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {ev.evidence_type}
                          </span>
                          {ev.submitter === address && (
                            <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded">Yours</span>
                          )}
                        </div>
                        <p className={`text-sm ${expandedEvidence === i ? "" : "line-clamp-2"}`}>
                          {ev.data}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  </div>
                </div>
                {expandedEvidence === i && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
        <div className="border-t border-border/50 pt-4 space-y-3">
          {isPlaintiff && dispute.state === "evidence_submitted" && (
            <button
              onClick={() => startReview(disputeId)}
              disabled={isStartingReview}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isStartingReview ? "Starting AI Review..." : "Start AI Review"}
            </button>
          )}

          {isPlaintiff && dispute.state === "under_review" && (
            <button
              onClick={() => resolveDispute(disputeId)}
              disabled={isResolving}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              {isResolving ? "Resolving..." : "Resolve Dispute (AI Judge)"}
            </button>
          )}

          {isPlaintiff && dispute.state === "open" && (
            <p className="text-xs text-muted-foreground text-center">
              Submit evidence to proceed to the next step
            </p>
          )}

          {isDefendant && dispute.state === "open" && (
            <p className="text-xs text-muted-foreground text-center">
              You have been named as the defendant. Submit your evidence to defend yourself.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
