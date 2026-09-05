"use client";

import { useState, useEffect } from "react";
import { useCreateDispute } from "@/lib/hooks/useAIArbitrator";
import { X, AlertCircle, CheckCircle, Scale } from "lucide-react";

interface CreateDisputeModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateDisputeModal({ open, onClose }: CreateDisputeModalProps) {
  const [defendant, setDefendant] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(1);
  const { createDispute, isPending } = useCreateDispute();

  const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);
  const isAddressValid = isValidAddress(defendant);
  const isTitleValid = title.trim().length >= 5;
  const isDescriptionValid = description.trim().length >= 20;

  useEffect(() => {
    if (open) { setDefendant(""); setTitle(""); setDescription(""); setStep(1); }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddressValid || !isTitleValid || !isDescriptionValid) return;
    createDispute({ defendant, title, description }, { onSuccess: onClose });
  };

  const handleClose = () => { onClose(); setStep(1); };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.7)" }} onClick={handleClose} />
      <div
        className="relative w-full max-w-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto rounded-xl"
        style={{
          background: "linear-gradient(135deg, #12121A 0%, #0D0D10 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Scale className="w-4 h-4 text-white/70" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white/95">Create New Dispute</h2>
              <p className="text-[10px] text-white/30">Step {step} of 3</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="flex-1 h-0.5 rounded-full transition-all"
              style={{ background: s <= step ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.06)" }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Defendant */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Defendant Address</label>
                <input
                  type="text"
                  value={defendant}
                  onChange={(e) => setDefendant(e.target.value)}
                  placeholder="0x..."
                  className="w-full rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 font-mono focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  autoFocus
                />
                {defendant && !isAddressValid && (
                  <p className="text-xs text-red-400/80 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Invalid Ethereum address format
                  </p>
                )}
                {defendant && isAddressValid && (
                  <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "#50DC82" }}>
                    <CheckCircle className="w-3 h-3" /> Valid address
                  </p>
                )}
              </div>
              <button type="button" onClick={() => isAddressValid && setStep(2)} disabled={!isAddressValid} className="btn-primary w-full">
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Title */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Dispute Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Service not delivered"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  autoFocus
                />
                {title && !isTitleValid && (
                  <p className="text-xs text-red-400/80 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Title must be at least 5 characters
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button type="button" onClick={() => isTitleValid && setStep(3)} disabled={!isTitleValid} className="btn-primary flex-1">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the dispute in detail..."
                  rows={5}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  autoFocus
                />
                {description && !isDescriptionValid && (
                  <p className="text-xs text-red-400/80 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Description must be at least 20 characters ({description.length}/20)
                  </p>
                )}
                {description && isDescriptionValid && (
                  <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "#50DC82" }}>
                    <CheckCircle className="w-3 h-3" /> Good description ({description.length} characters)
                  </p>
                )}
              </div>

              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] text-white/30 font-medium mb-2">Summary</p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-white/35">Defendant:</span> <span className="font-mono text-xs text-white/50">{defendant.slice(0, 10)}...{defendant.slice(-8)}</span></p>
                  <p><span className="text-white/35">Title:</span> <span className="text-white/60">{title}</span></p>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                <button type="submit" disabled={isPending || !isDescriptionValid} className="btn-primary flex-1">
                  {isPending ? "Creating..." : "Create Dispute"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
