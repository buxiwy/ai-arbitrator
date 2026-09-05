import React from "react";

export const wallets = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Most popular Ethereum wallet",
    color: "#F6851B",
    downloadUrl: "https://metamask.io/download/",
    icon: (
      <svg viewBox="0 0 35 33" className="w-8 h-8">
        <path fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" d="M32.96 1l-9.78 7.28 1.82 4.32z"/>
        <path fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" d="M2.33 1l9.72 7.32-1.64-4.39zm23.02 22.34l-2.6 3.94 5.53 1.52 1.58-5.41zm-28.24.42l1.56 5.41 5.52-1.52-2.59-3.94z"/>
        <path fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" d="M9.47 14.51l-1.6 2.43 5.68.25-.19-6.1zm16.38 0l-1.65-6.13 5.63-.25-.19 6.13zm-10.8-4.55l-5.03-1.56 3.55 2.83-.15 3.36zm5.47 0l-5.1-1.48 5.07 1.5.03-3.38z"/>
        <path fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" d="M7.68 23.97l3.5-1.71-2.47-1.93zm19.97 0l-1.02-3.63-2.48 1.72zm-17.3-6.54l2.1 3.36-4.94-.14zm13.13 0l2.08 3.31-4.87-.35z"/>
        <path fill="#C0AD4E" stroke="#C0AD4E" strokeLinecap="round" strokeLinejoin="round" d="M12.32 28.87l2.95-1.44-2.55-1.97zm7.67 0l2.53-2.02-2.94-1.37z"/>
        <path fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" d="M15.32 27.43l-2.96-1.46 2.1-1.61.86.86zm4.64 0l.86-.87 2.12 1.62-2.98 1.43z"/>
      </svg>
    ),
  },
  {
    id: "okx",
    name: "OKX Wallet",
    description: "OKX multi-chain wallet",
    color: "#000",
    downloadUrl: "https://www.okx.com/web3",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect width="40" height="40" rx="8" fill="#000"/>
        <path d="M10 20a10 10 0 0120 0 10 10 0 01-20 0z" fill="none" stroke="#fff" strokeWidth="2"/>
        <circle cx="14" cy="20" r="2" fill="#fff"/>
        <circle cx="20" cy="20" r="2" fill="#fff"/>
        <circle cx="26" cy="20" r="2" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    description: "Coinbase's self-custody wallet",
    color: "#0052FF",
    downloadUrl: "https://www.coinbase.com/wallet",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect width="40" height="40" rx="8" fill="#0052FF"/>
        <path d="M20 10a10 10 0 0110 10 10 10 0 01-10 10 10 10 0 01-10-10 10 10 0 0110-10z" fill="#fff"/>
        <path d="M18 16h4v8h-4z" fill="#0052FF"/>
      </svg>
    ),
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Scan QR code with any wallet",
    color: "#3B99FC",
    downloadUrl: "",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect width="40" height="40" rx="8" fill="#3B99FC"/>
        <path d="M12 16.5a3 3 0 013-3h0a3 3 0 013 3v7a3 3 0 01-3 3h0a3 3 0 01-3-3v-7z" fill="#fff"/>
        <path d="M22 16.5a3 3 0 013-3h0a3 3 0 013 3v7a3 3 0 01-3 3h0a3 3 0 01-3-3v-7z" fill="#fff"/>
        <path d="M17 19.5a3 3 0 013-3h0a3 3 0 013 3v4a3 3 0 01-3 3h0a3 3 0 01-3-3v-4z" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: "phantom",
    name: "Phantom",
    description: "Popular Solana & EVM wallet",
    color: "#AB9FF2",
    downloadUrl: "https://phantom.app/",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect width="40" height="40" rx="8" fill="#AB9FF2"/>
        <path d="M20 10c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10z" fill="#fff"/>
        <circle cx="16" cy="18" r="2" fill="#AB9FF2"/>
        <circle cx="24" cy="18" r="2" fill="#AB9FF2"/>
        <path d="M15 24c0 0 2.5 3 5 3s5-3 5-3" stroke="#AB9FF2" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
];
