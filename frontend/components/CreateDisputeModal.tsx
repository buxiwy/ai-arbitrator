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
    if (open) {
      setDefendant("");
      setTitle("");
      setDescription("");
      setStep(1);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddressValid || !isTitleValid || !isDescriptionValid) return;

    createDispute(
      { defendant, title, description },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    onClose();
    setStep(1);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative brand-card w-full max-w-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Create New Dispute</h2>
              <p className="text-xs text-muted-foreground">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-all ${
                s <= step ? "bg-accent" : "bg-muted/30"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Defendant */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Defendant Address
                </label>
                <input
                  type="text"
                  value={defendant}
                  onChange={(e) => setDefendant(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono"
                  autoFocus
                />
                {defendant && !isAddressValid && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Invalid Ethereum address format
                  </p>
                )}
                {defendant && isAddressValid && (
                  <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Valid address
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => isAddressValid && setStep(2)}
                disabled={!isAddressValid}
                className="btn-primary w-full"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Title */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Dispute Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Service not delivered"
                  className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  autoFocus
                />
                {title && !isTitleValid && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Title must be at least 5 characters
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => isTitleValid && setStep(3)}
                  disabled={!isTitleValid}
                  className="btn-primary flex-1"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the dispute in detail. Include relevant facts, dates, and any supporting information..."
                  rows={5}
                  className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  autoFocus
                />
                {description && !isDescriptionValid && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Description must be at least 20 characters ({description.length}/20)
                  </p>
                )}
                {description && isDescriptionValid && (
                  <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Good description ({description.length} characters)
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-card/30 rounded-xl p-4 border border-border/50 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Summary</p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Defendant:</span> <span className="font-mono text-xs">{defendant.slice(0, 10)}...{defendant.slice(-8)}</span></p>
                  <p><span className="text-muted-foreground">Title:</span> {title}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isPending || !isDescriptionValid}
                  className="btn-primary flex-1"
                >
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
