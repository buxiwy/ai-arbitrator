"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DisputesTable } from "@/components/DisputesTable";
import { DisputeDetail } from "@/components/DisputeDetail";
import { CreateDisputeModal } from "@/components/CreateDisputeModal";
import { HowItWorks } from "@/components/HowItWorks";
import { StatsDashboard } from "@/components/StatsDashboard";
import { Footer } from "@/components/Footer";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { Scale, ArrowLeft, Wallet } from "lucide-react";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedDisputeId, setSelectedDisputeId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { address, isConnected, isLoading, connectToWallet, disconnectWallet } = useWallet();

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    setSelectedDisputeId(null);
  };

  const handleConnect = async () => {
    try {
      await connectToWallet("metamask");
    } catch (error) {
      console.error("Failed to connect:", error);
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
              <h2 className="text-2xl font-bold text-white/95">My Disputes</h2>
            </div>
            <DisputesTable
              onSelectDispute={setSelectedDisputeId}
              selectedId={selectedDisputeId}
              filterByAddress={true}
            />
          </div>
        );

      case "how-it-works":
        return <HowItWorks />;

      case "about":
        return (
          <div className="brand-card p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white/95">About AI Arbitrator</h2>
            <div className="space-y-4">
              <p className="text-sm text-white/50 leading-relaxed">
                AI Arbitrator is a decentralized dispute resolution platform built on
                GenLayer blockchain. It uses AI judges to evaluate evidence and deliver
                fair verdicts, all enforced by smart contract consensus.
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Traditional dispute resolution costs over $50 billion annually and takes
                months to resolve. AI Arbitrator provides a faster, cheaper, and more
                impartial alternative.
              </p>
              <div className="pt-4 border-t border-white/[0.06]">
                <h3 className="text-lg font-semibold text-white/80 mb-3">Built With</h3>
                <ul className="space-y-2.5">
                  {["GenLayer Intelligent Contracts", "Non-deterministic LLM Execution", "Optimistic Democracy Consensus"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <Scale className="w-3.5 h-3.5 text-white/30" />
                      <span className="text-sm text-white/50">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-white/25">
                  Built for the GenLayer Agent Tank Hackathon 2024 — Onchain Justice Track
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <StatsDashboard />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <DisputesTable
                  onSelectDispute={setSelectedDisputeId}
                  selectedId={selectedDisputeId}
                />
              </div>
              <div className="lg:col-span-4">
                <HowItWorks />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onCreateDispute={() => setShowCreateModal(true)}
      />

      <main className="ml-[240px] min-h-screen transition-all duration-300">
        <header className="sticky top-0 z-30 brand-navbar">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedDisputeId !== null && (
                  <button
                    onClick={() => setSelectedDisputeId(null)}
                    className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-white/50" />
                  </button>
                )}
                <h1 className="text-lg font-bold text-white/90">
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

              {isConnected && address ? (
                <div className="flex items-center gap-3">
                  <div className="text-xs text-white/50 px-3 py-1.5 rounded-lg font-mono" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
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

        <div className="p-6">
          {renderContent()}
          <Footer />
        </div>
      </main>

      <CreateDisputeModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
