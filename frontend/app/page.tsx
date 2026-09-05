"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DisputesTable } from "@/components/DisputesTable";
import { DisputeDetail } from "@/components/DisputeDetail";
import { CreateDisputeModal } from "@/components/CreateDisputeModal";
import { HowItWorks } from "@/components/HowItWorks";
import { StatsDashboard } from "@/components/StatsDashboard";
import { WalletModal } from "@/components/WalletModal";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { wallets } from "@/lib/wallets";
import { Scale, ArrowLeft, Wallet } from "lucide-react";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedDisputeId, setSelectedDisputeId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { address, isConnected, isLoading, connectWallet, disconnectWallet } = useWallet();

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    setSelectedDisputeId(null);
  };

  const handleSelectWallet = async (walletId: string) => {
    if (walletId === "metamask") {
      try {
        await connectWallet();
        setShowWalletModal(false);
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    } else {
      // For other wallets, check if they're installed
      const wallet = wallets.find((w) => w.id === walletId);
      if (wallet?.downloadUrl) {
        window.open(wallet.downloadUrl, "_blank");
      }
      setShowWalletModal(false);
    }
  };

  const renderContent = () => {
    if (selectedDisputeId !== null) {
      return (
        <DisputeDetail
          disputeId={selectedDisputeId}
          onBack={() => setSelectedDisputeId(null)}
        />
      );
    }

    switch (activeSection) {
      case "disputes":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Disputes</h2>
            </div>
            <DisputesTable
              onSelectDispute={setSelectedDisputeId}
              selectedId={selectedDisputeId}
            />
          </div>
        );

      case "how-it-works":
        return <HowItWorks />;

      case "about":
        return (
          <div className="brand-card p-8 space-y-6">
            <h2 className="text-2xl font-bold">About AI Arbitrator</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                AI Arbitrator is a decentralized dispute resolution platform built on
                GenLayer blockchain. It uses AI judges to evaluate evidence and deliver
                fair verdicts, all enforced by smart contract consensus.
              </p>
              <p>
                Traditional dispute resolution costs over $50 billion annually and takes
                months to resolve. AI Arbitrator provides a faster, cheaper, and more
                impartial alternative.
              </p>
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-2">Built With</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-accent" />
                    <span>GenLayer Intelligent Contracts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-accent" />
                    <span>Non-deterministic LLM Execution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-accent" />
                    <span>Optimistic Democracy Consensus</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm">
                  Built for the GenLayer Agent Tank Hackathon 2024 — Onchain Justice Track
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Stats */}
            <StatsDashboard />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <DisputesTable
                  onSelectDispute={setSelectedDisputeId}
                  selectedId={selectedDisputeId}
                />
              </div>
              <div className="lg:col-span-5">
                <HowItWorks />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onCreateDispute={() => setShowCreateModal(true)}
      />

      {/* Main Content - Offset for sidebar */}
      <main className="ml-[240px] min-h-screen transition-all duration-300">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 brand-navbar">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedDisputeId !== null && (
                  <button
                    onClick={() => setSelectedDisputeId(null)}
                    className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h1 className="text-lg font-bold">
                  {selectedDisputeId !== null
                    ? `Dispute #${selectedDisputeId}`
                    : activeSection === "home"
                    ? "Dashboard"
                    : activeSection === "disputes"
                    ? "My Disputes"
                    : activeSection === "how-it-works"
                    ? "How It Works"
                    : "About"}
                </h1>
              </div>

              {/* Wallet Connect */}
              {isConnected && address ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground bg-card/50 px-3 py-1.5 rounded-lg border border-border/50 font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
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
                  onClick={() => setShowWalletModal(true)}
                  disabled={isLoading}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <Wallet className="w-4 h-4" />
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>

      {/* Create Dispute Modal */}
      <CreateDisputeModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Wallet Selection Modal */}
      <WalletModal
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleSelectWallet}
        isConnecting={isLoading}
      />
    </div>
  );
}
