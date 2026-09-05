"use client";

import { useState } from "react";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import {
  Scale,
  Home,
  FileText,
  Plus,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onCreateDispute: () => void;
}

const menuItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "disputes", label: "My Disputes", icon: FileText },
  { id: "how-it-works", label: "How It Works", icon: BookOpen },
  { id: "about", label: "About", icon: HelpCircle },
];

const externalLinks = [
  { label: "GenLayer Docs", url: "https://docs.genlayer.com", icon: ExternalLink },
  { label: "GenLayer Studio", url: "https://studio.genlayer.com", icon: ExternalLink },
  { label: "GitHub", url: "https://github.com/buxiwy/ai-arbitrator", icon: ExternalLink },
];

export function Sidebar({ activeSection, onNavigate, onCreateDispute }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { address, isConnected, disconnectWallet } = useWallet();

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
      style={{
        background: "linear-gradient(180deg, rgba(13,13,16,0.95) 0%, rgba(8,8,10,0.98) 100%)",
        backdropFilter: "blur(24px) saturate(1.5)",
        WebkitBackdropFilter: "blur(24px) saturate(1.5)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Scale className="w-4 h-4 text-white/80" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm text-white/95 leading-tight">AI Arbitrator</h1>
                <p className="text-[10px] text-white/40">On-chain Justice</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Dispute Button */}
        <div className="p-3">
          <button
            onClick={onCreateDispute}
            className={`w-full flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all ${
              collapsed ? "px-0 py-2.5" : "px-4 py-2.5"
            }`}
            style={{
              background: "#08080A",
              color: "#F5F5F7",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>New Dispute</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                collapsed ? "justify-center" : ""
              }`}
              style={{
                color: activeSection === item.id ? "#F5F5F7" : "rgba(255,255,255,0.4)",
                background: activeSection === item.id ? "rgba(255,255,255,0.06)" : "transparent",
                borderLeft: activeSection === item.id ? "2px solid rgba(255,255,255,0.6)" : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* External Links */}
        {!collapsed && (
          <div className="px-3 pb-3">
            <div className="border-t border-white/[0.06] pt-3">
              <p className="text-[10px] text-white/30 px-3 mb-2 uppercase tracking-wider">
                Links
              </p>
              {externalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all"
                >
                  <link.icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Info */}
        <div className="p-3 border-t border-white/[0.06]">
          {isConnected && address ? (
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-white/70 truncate">{formatAddress(address)}</p>
                  <p className="text-[10px] text-white/30">Connected</p>
                </div>
              )}
              <button
                onClick={disconnectWallet}
                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-all"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className={`text-center ${collapsed ? "" : "text-xs text-white/30"}`}>
              {!collapsed && <p>Connect wallet to start</p>}
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 rounded-r-lg flex items-center justify-center text-white/30 hover:text-white/60 transition-all"
          style={{
            background: "#12121A",
            border: "1px solid rgba(255,255,255,0.08)",
            borderLeft: "none",
          }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>
    </aside>
  );
}
