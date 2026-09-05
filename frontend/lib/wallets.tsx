import React from "react";

export const wallets = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Most popular Ethereum wallet",
    color: "#F6851B",
    downloadUrl: "https://metamask.io/download/",
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#F6851B] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 35 33" className="w-5 h-5" fill="#fff">
          <path d="M32.96 1l-9.78 7.28 1.82 4.32-2.61-1.94-3.67 2.75 4.55 3.41 2.33 1.16 3.67-2.75 1.58 5.41-5.53 1.52-2.6-3.94-5.36 4.02-6.07-4.55.61 5.37-4.55 3.41-4.55-3.41-.61-5.37-6.07 4.55L12.1 5.64 8.43 2.89 4.76 5.64 2.43 3.88 0 1l9.78 7.28 1.82 4.32 2.61-1.94 3.67-2.75-4.55-3.41z"/>
        </svg>
      </div>
    ),
  },
  {
    id: "okx",
    name: "OKX Wallet",
    description: "OKX multi-chain wallet",
    color: "#000",
    downloadUrl: "https://www.okx.com/web3",
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#000] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <circle cx="6" cy="12" r="2.5" fill="#fff"/>
          <circle cx="12" cy="12" r="2.5" fill="#fff"/>
          <circle cx="18" cy="12" r="2.5" fill="#fff"/>
        </svg>
      </div>
    ),
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    description: "Coinbase's self-custody wallet",
    color: "#0052FF",
    downloadUrl: "https://www.coinbase.com/wallet",
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#0052FF] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#fff"/>
          <path d="M14.5 8h-5v8h5c2.21 0 4-1.79 4-4s-1.79-4-4-4z" fill="#0052FF"/>
        </svg>
      </div>
    ),
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Scan QR code with any wallet",
    color: "#3B99FC",
    downloadUrl: "",
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#3B99FC] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path d="M7 8a3 3 0 013-3h0a3 3 0 013 3v8a3 3 0 01-3 3h0a3 3 0 01-3-3V8z" fill="#fff"/>
          <path d="M15 8a3 3 0 013-3h0a3 3 0 013 3v8a3 3 0 01-3 3h0a3 3 0 01-3-3V8z" fill="#fff"/>
          <path d="M11 11a3 3 0 013-3h0a3 3 0 013 3v2a3 3 0 01-3 3h0a3 3 0 01-3-3v-2z" fill="#fff"/>
        </svg>
      </div>
    ),
  },
  {
    id: "phantom",
    name: "Phantom",
    description: "Popular Solana & EVM wallet",
    color: "#AB9FF2",
    downloadUrl: "https://phantom.app/",
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#AB9FF2] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#fff"/>
          <circle cx="9" cy="10" r="1.5" fill="#AB9FF2"/>
          <circle cx="15" cy="10" r="1.5" fill="#AB9FF2"/>
          <path d="M9 15c0 0 1.5 2 3 2s3-2 3-2" stroke="#AB9FF2" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    ),
  },
];
