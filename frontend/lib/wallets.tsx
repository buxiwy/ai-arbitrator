import React from "react";

export const wallets = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Most popular Ethereum wallet",
    color: "#F6851B",
    downloadUrl: "https://metamask.io/download/",
    icon: (
      <svg viewBox="0 0 318.6 318.6" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mm-grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2761B"/>
            <stop offset="100%" stopColor="#CD6116"/>
          </linearGradient>
        </defs>
        <path d="M274.1 35.5l-99.5 73.9L193 65.8z" fill="#E2761B"/>
        <path d="M44.4 35.5l98.7 74.6-17.5-44.3zm193.9 171.3l-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4-.9L50.1 183l56.7-15.6-26.5-40.6z" fill="#E4761B"/>
        <path d="M103.6 138.2l-15.8 23.9 56.3.2v-46.4zm111.3 0l-15.8-23.9v46.4l56.2-.2zm114.6-52.2l-39-35.8-14.8 45.9 40.7-10.1zm-241.9-10.1l-14.8-45.9-39 35.8 43.8 10.1z" fill="#E4761B"/>
        <path d="M57.8 213.5l32.4-15.9-22.1-20.5zm203 0l-10.2-20.5 32.3 15.9z" fill="#E4761B"/>
        <path d="M108.7 97.8l-15.8 24 29.8-.4zm101.2 0l-14-24-15.8 24.4zm84.8 38.3l-29.8.4 28.2 20.6 26.5-20.2z" fill="#C0AD4E"/>
        <path d="M108.7 97.8l-4.3 66.6 33.5-33.5zm101.2 0l29.5 33.1 33.5 33.5-4.6-66.3z" fill="#C0AD4E"/>
        <path d="M177.7 176.9l-28.2-20.6h-42.5l28.2 20.6z" fill="#C0AD4E"/>
        <path d="M86.2 265l28.8-14-24.9-20.7zm147.1 0l-3.8-34.6 25-20.8z" fill="#E4761B"/>
        <path d="M242.3 97.8l-56.2.2 20.5 18.6 22.2-18.4z" fill="#E4761B"/>
        <path d="M76.3 97.8l22 18.6 20.5-18.6-56.2-.2z" fill="#E4761B"/>
        <path d="M105 154.5l-22.1-20.6H37.9l37.3 27.2zm163.6 0l37.3-27.2h-45l-22.2 20.6zm-100.6 22.4l20.7-20.6 20.8 20.6h-41.5z" fill="#D0811A"/>
        <path d="M274.1 35.5l-48.3 36.3 45.6 20.8 40.4-28.4z" fill="#E4761B"/>
        <path d="M44.4 35.5l-4 38.7 40.3 28.4 45.7-20.8z" fill="#E4761B"/>
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
      <svg viewBox="0 0 100 100" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#000"/>
        <circle cx="22" cy="50" r="11" fill="#fff"/>
        <circle cx="50" cy="50" r="11" fill="#fff"/>
        <circle cx="78" cy="50" r="11" fill="#fff"/>
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
      <svg viewBox="0 0 100 100" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#0052FF"/>
        <path d="M50 20C33.4 20 20 33.4 20 50s13.4 30 30 30 30-13.4 30-30S66.6 20 50 20zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z" fill="#fff"/>
        <rect x="43" y="40" width="14" height="20" rx="2" fill="#fff"/>
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
      <svg viewBox="0 0 100 100" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#3B99FC"/>
        <path d="M35 38a8 8 0 018-8h0a8 8 0 018 8v24a8 8 0 01-8 8h0a8 8 0 01-8-8V38z" fill="#fff"/>
        <path d="M65 38a8 8 0 018-8h0a8 8 0 018 8v24a8 8 0 01-8 8h0a8 8 0 01-8-8V38z" fill="#fff"/>
        <path d="M49 46a8 8 0 018-8h0a8 8 0 018 8v16a8 8 0 01-8 8h0a8 8 0 01-8-8V46z" fill="#fff"/>
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
      <svg viewBox="0 0 100 100" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#AB9FF2"/>
        <path d="M50 20C33.4 20 20 33.4 20 50s13.4 30 30 30 30-13.4 30-30S66.6 20 50 20z" fill="#fff"/>
        <circle cx="40" cy="45" r="5" fill="#AB9FF2"/>
        <circle cx="60" cy="45" r="5" fill="#AB9FF2"/>
        <path d="M38 60c0 0 5.5 8 12 8s12-8 12-8" stroke="#AB9FF2" strokeWidth="4" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
];
