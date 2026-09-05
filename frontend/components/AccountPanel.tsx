"use client";

import { useState } from "react";
import { User, LogOut, AlertCircle, ExternalLink } from "lucide-react";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { success, error, userRejected } from "@/lib/utils/toast";
import { AddressDisplay } from "./AddressDisplay";

const METAMASK_INSTALL_URL = "https://metamask.io/download/";

export function AccountPanel() {
  const {
    address,
    isConnected,
    isMetaMaskInstalled,
    isOnCorrectNetwork,
    isLoading,
    connectWallet,
    disconnectWallet,
    switchWalletAccount,
  } = useWallet();

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      window.open(METAMASK_INSTALL_URL, "_blank");
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionError("");
      await connectWallet();
    } catch (err: any) {
      setConnectionError(err.message || "Failed to connect to MetaMask");
      if (err.message?.includes("rejected")) {
        userRejected("Connection cancelled");
      } else {
        error("Failed to connect wallet", {
          description: err.message || "Check your MetaMask and try again.",
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isLoading || isConnecting}
        className="btn-primary flex items-center gap-2 text-sm"
      >
        <User className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-muted-foreground bg-card/50 px-3 py-1.5 rounded-lg border border-border/50 flex items-center gap-2">
        <AddressDisplay address={address!} maxLength={10} />
      </div>
      <button
        onClick={disconnectWallet}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
}
