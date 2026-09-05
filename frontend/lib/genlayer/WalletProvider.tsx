"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  type WalletId,
  isWalletInstalled,
  connectWallet,
  getAccountsForWallet,
  getCurrentChainIdForWallet,
  isOnGenLayerNetwork,
  getActiveProvider,
  GENLAYER_CHAIN_ID,
} from "./client";
import { error, userRejected, warning } from "../utils/toast";

const DISCONNECT_FLAG = "wallet_disconnected";
const WALLET_KEY = "connected_wallet_id";

export interface WalletState {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
  isLoading: boolean;
  isOnCorrectNetwork: boolean;
  activeWallet: WalletId | null;
}

interface WalletContextValue extends WalletState {
  connectToWallet: (walletId: WalletId) => Promise<string>;
  disconnectWallet: () => void;
  switchWalletAccount: () => Promise<string>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isLoading: true,
    isOnCorrectNetwork: false,
    activeWallet: null,
  });

  useEffect(() => {
    const initWallet = async () => {
      if (typeof window === "undefined") return;

      const wasDisconnected = localStorage.getItem(DISCONNECT_FLAG) === "true";
      if (wasDisconnected) {
        setState({ address: null, chainId: null, isConnected: false, isLoading: false, isOnCorrectNetwork: false, activeWallet: null });
        return;
      }

      setState({ address: null, chainId: null, isConnected: false, isLoading: false, isOnCorrectNetwork: false, activeWallet: null });
    };

    initWallet();
  }, []);

  useEffect(() => {
    const provider = getActiveProvider();
    if (!provider) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0 && typeof window !== "undefined") {
        localStorage.removeItem(DISCONNECT_FLAG);
      }
      const walletId = (localStorage.getItem(WALLET_KEY) as WalletId) || "metamask";
      const chainId = await getCurrentChainIdForWallet(walletId);
      const correctNetwork = await isOnGenLayerNetwork(walletId);
      setState((prev) => ({
        ...prev,
        address: accounts[0] || null,
        chainId,
        isConnected: accounts.length > 0,
        isOnCorrectNetwork: correctNetwork,
        activeWallet: accounts.length > 0 ? walletId : null,
      }));
    };

    const handleChainChanged = async (chainId: string) => {
      const walletId = (localStorage.getItem(WALLET_KEY) as WalletId) || "metamask";
      const correctNetwork = parseInt(chainId, 16) === GENLAYER_CHAIN_ID;
      const accounts = await getAccountsForWallet(walletId);
      setState((prev) => ({
        ...prev,
        chainId,
        address: accounts[0] || null,
        isConnected: accounts.length > 0,
        isOnCorrectNetwork: correctNetwork,
      }));
    };

    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("chainChanged", handleChainChanged);

    return () => {
      provider.removeListener("accountsChanged", handleAccountsChanged);
      provider.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const connectToWallet = useCallback(async (walletId: WalletId) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const address = await connectWallet(walletId);
      const chainId = await getCurrentChainIdForWallet(walletId);
      const correctNetwork = await isOnGenLayerNetwork(walletId);

      if (typeof window !== "undefined") {
        localStorage.removeItem(DISCONNECT_FLAG);
        localStorage.setItem(WALLET_KEY, walletId);
      }

      setState({
        address,
        chainId,
        isConnected: true,
        isLoading: false,
        isOnCorrectNetwork: correctNetwork,
        activeWallet: walletId,
      });

      return address;
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setState((prev) => ({ ...prev, isLoading: false }));

      if (err.message?.includes("rejected") || err.message?.includes("cancelled")) {
        userRejected("Connection cancelled");
      } else if (err.message?.includes("is not installed")) {
        error("Wallet not found", {
          description: err.message,
          action: {
            label: "Install",
            onClick: () => {
              const urls: Record<string, string> = {
                metamask: "https://metamask.io/download/",
                okx: "https://www.okx.com/web3",
                coinbase: "https://www.coinbase.com/wallet",
                phantom: "https://phantom.app/",
              };
              window.open(urls[walletId] || "", "_blank");
            },
          },
        });
      } else {
        error("Failed to connect wallet", {
          description: err.message || "Please try again.",
        });
      }

      throw err;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(DISCONNECT_FLAG, "true");
      localStorage.removeItem(WALLET_KEY);
    }
    setState({ address: null, chainId: null, isConnected: false, isLoading: false, isOnCorrectNetwork: false, activeWallet: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  const switchWalletAccount = useCallback(async () => {
    const walletId = state.activeWallet || "metamask";
    const provider = getActiveProvider();
    if (!provider) throw new Error("No wallet connected");

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await provider.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      const accounts = await provider.request({ method: "eth_accounts" });
      if (!accounts || accounts.length === 0) throw new Error("No account selected");

      const chainId = await getCurrentChainIdForWallet(walletId);
      const correctNetwork = await isOnGenLayerNetwork(walletId);

      if (typeof window !== "undefined") {
        localStorage.removeItem(DISCONNECT_FLAG);
      }

      setState({
        address: accounts[0],
        chainId,
        isConnected: true,
        isLoading: false,
        isOnCorrectNetwork: correctNetwork,
        activeWallet: walletId,
      });

      return accounts[0];
    } catch (err: any) {
      console.error("Error switching account:", err);
      setState((prev) => ({ ...prev, isLoading: false }));
      if (err.message?.includes("rejected")) {
        userRejected("Account switch cancelled");
      } else {
        error("Failed to switch account", { description: err.message || "Please try again." });
      }
      throw err;
    }
  }, [state.activeWallet]);

  const value: WalletContextValue = {
    ...state,
    connectToWallet,
    disconnectWallet,
    switchWalletAccount,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
