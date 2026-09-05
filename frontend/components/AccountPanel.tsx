"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { AddressDisplay } from "./AddressDisplay";

export function AccountPanel() {
  const {
    address,
    isConnected,
    isLoading,
    disconnectWallet,
    switchWalletAccount,
  } = useWallet();

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await switchWalletAccount();
    } catch {
      // Error handled in WalletProvider
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isConnected) {
    return null;
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
