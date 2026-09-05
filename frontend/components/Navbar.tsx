"use client";

import { useWallet } from "@/lib/genlayer/WalletProvider";
import { Scale, Wallet } from "lucide-react";

export function Navbar() {
  const { address, isConnected, isLoading, connectWallet, disconnectWallet } =
    useWallet();

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 brand-navbar">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-accent" />
            <span className="text-lg font-bold hidden sm:block">
              AI Arbitrator
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && address ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground bg-card/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <span className="hidden md:inline">{formatAddress(address)}</span>
                  <span className="md:hidden">{formatAddress(address)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Wallet className="w-4 h-4" />
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
