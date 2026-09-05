"use client";

import { useState } from "react";
import { X, AlertCircle, Download } from "lucide-react";
import { wallets } from "@/lib/wallets";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: string) => void;
  isConnecting: boolean;
}

export function WalletModal({ open, onClose, onSelectWallet, isConnecting }: WalletModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleSelect = (walletId: string) => {
    setSelectedWallet(walletId);
    onSelectWallet(walletId);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative brand-card w-full max-w-md p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Choose a wallet to connect to AI Arbitrator
        </p>

        {/* Wallet List */}
        <div className="space-y-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleSelect(wallet.id)}
              disabled={isConnecting}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                selectedWallet === wallet.id && isConnecting
                  ? "bg-accent/10 border-accent/50"
                  : "bg-card/30 border-border/50 hover:bg-card/50 hover:border-border"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex-shrink-0">{wallet.icon}</div>
              <div className="flex-1 text-left">
                <p className="font-medium">{wallet.name}</p>
                <p className="text-xs text-muted-foreground">{wallet.description}</p>
              </div>
              {selectedWallet === wallet.id && isConnecting && (
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              )}
              {wallet.downloadUrl && (
                <a
                  href={wallet.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
                  title="Install wallet"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
            </button>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-card/30 rounded-xl border border-border/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
              Make sure you're on the GenLayer network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
