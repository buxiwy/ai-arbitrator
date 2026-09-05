"use client";

import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { createWalletClient, custom, type WalletClient } from "viem";

export const GENLAYER_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID || "61999");
export const GENLAYER_CHAIN_ID_HEX = `0x${GENLAYER_CHAIN_ID.toString(16).toUpperCase()}`;

export const GENLAYER_NETWORK = {
  chainId: GENLAYER_CHAIN_ID_HEX,
  chainName: process.env.NEXT_PUBLIC_GENLAYER_CHAIN_NAME || "GenLayer Studio",
  nativeCurrency: {
    name: process.env.NEXT_PUBLIC_GENLAYER_SYMBOL || "GEN",
    symbol: process.env.NEXT_PUBLIC_GENLAYER_SYMBOL || "GEN",
    decimals: 18,
  },
  rpcUrls: [process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "https://studio.genlayer.com/api"],
  blockExplorerUrls: [],
};

export type WalletId = "metamask" | "okx" | "coinbase" | "walletconnect" | "phantom";

interface EthereumProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    okxwallet?: EthereumProvider;
    phantom?: {
      ethereum?: EthereumProvider;
      solana?: any;
    };
  }
}

function getProviderForWallet(walletId: WalletId): EthereumProvider | null {
  if (typeof window === "undefined") return null;

  switch (walletId) {
    case "metamask":
      return window.ethereum?.isMetaMask ? window.ethereum : null;
    case "okx":
      return window.okxwallet || null;
    case "coinbase":
      return window.ethereum?.isCoinbaseWallet ? window.ethereum : null;
    case "phantom":
      return window.phantom?.ethereum || null;
    case "walletconnect":
      return null;
    default:
      return null;
  }
}

export function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  return window.ethereum || null;
}

export function isWalletInstalled(walletId: WalletId): boolean {
  if (typeof window === "undefined") return false;
  return getProviderForWallet(walletId) !== null;
}

export async function connectWallet(walletId: WalletId): Promise<string> {
  if (walletId === "walletconnect") {
    throw new Error("WalletConnect requires QR code flow — coming soon");
  }

  const provider = getProviderForWallet(walletId);
  if (!provider) {
    const names: Record<string, string> = {
      metamask: "MetaMask",
      okx: "OKX Wallet",
      coinbase: "Coinbase Wallet",
      phantom: "Phantom",
    };
    throw new Error(`${names[walletId] || walletId} is not installed`);
  }

  const accounts = await provider.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found");
  }

  const onCorrectNetwork = await isOnGenLayerNetwork(walletId);
  if (!onCorrectNetwork) {
    await switchToGenLayerNetwork(walletId);
  }

  return accounts[0];
}

export async function getAccountsForWallet(walletId: WalletId): Promise<string[]> {
  const provider = getProviderForWallet(walletId);
  if (!provider) return [];
  try {
    return await provider.request({ method: "eth_accounts" });
  } catch {
    return [];
  }
}

export async function getCurrentChainIdForWallet(walletId: WalletId): Promise<string | null> {
  const provider = getProviderForWallet(walletId);
  if (!provider) return null;
  try {
    return await provider.request({ method: "eth_chainId" });
  } catch {
    return null;
  }
}

export async function switchToGenLayerNetwork(walletId: WalletId): Promise<void> {
  const provider = getProviderForWallet(walletId);
  if (!provider) throw new Error("Wallet not installed");

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: GENLAYER_CHAIN_ID_HEX }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [GENLAYER_NETWORK],
      });
    } else if (error.code === 4001) {
      throw new Error("User rejected switching the network");
    } else {
      throw new Error(`Failed to switch network: ${error.message}`);
    }
  }
}

export async function isOnGenLayerNetwork(walletId: WalletId): Promise<boolean> {
  const chainId = await getCurrentChainIdForWallet(walletId);
  if (!chainId) return false;
  return parseInt(chainId, 16) === GENLAYER_CHAIN_ID;
}

export function getProviderEvents(walletId: WalletId) {
  const provider = getProviderForWallet(walletId);
  return provider;
}

export function getStudioUrl(): string {
  return process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "https://studio.genlayer.com/api";
}

export function getContractAddress(): string {
  return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
}

export function getActiveProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  return window.ethereum || window.okxwallet || window.phantom?.ethereum || null;
}

// Legacy exports for backward compatibility
export function isMetaMaskInstalled(): boolean {
  return isWalletInstalled("metamask");
}

export async function requestAccounts(): Promise<string[]> {
  const provider = getEthereumProvider();
  if (!provider) throw new Error("MetaMask is not installed");
  return provider.request({ method: "eth_requestAccounts" });
}

export async function getAccounts(): Promise<string[]> {
  const provider = getEthereumProvider();
  if (!provider) return [];
  try {
    return await provider.request({ method: "eth_accounts" });
  } catch {
    return [];
  }
}

export async function getCurrentChainId(): Promise<string | null> {
  const provider = getEthereumProvider();
  if (!provider) return null;
  try {
    return await provider.request({ method: "eth_chainId" });
  } catch {
    return null;
  }
}

export async function addGenLayerNetwork(): Promise<void> {
  const provider = getEthereumProvider();
  if (!provider) throw new Error("MetaMask is not installed");
  await provider.request({ method: "wallet_addEthereumChain", params: [GENLAYER_NETWORK] });
}

export async function switchToGenLayerNetworkLegacy(): Promise<void> {
  return switchToGenLayerNetwork("metamask");
}

export async function isOnGenLayerNetworkLegacy(): Promise<boolean> {
  return isOnGenLayerNetwork("metamask");
}

export async function connectMetaMask(): Promise<string> {
  return connectWallet("metamask");
}

export async function switchAccount(): Promise<string> {
  const provider = getEthereumProvider();
  if (!provider) throw new Error("MetaMask is not installed");
  await provider.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
  const accounts = await provider.request({ method: "eth_accounts" });
  if (!accounts || accounts.length === 0) throw new Error("No account selected");
  return accounts[0];
}

export function createMetaMaskWalletClient(): WalletClient | null {
  const provider = getEthereumProvider();
  if (!provider) return null;
  return createWalletClient({ chain: studionet as any, transport: custom(provider) });
}

export function createGenLayerClient(address?: string) {
  const config: any = { chain: studionet };
  if (address) config.account = address as `0x${string}`;
  return createClient(config);
}

export async function getClient() {
  const accounts = await getAccounts();
  return createGenLayerClient(accounts[0]);
}
