"use client";

import { useState } from "react";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import {
  Scale,
  Home,
  FileText,
  Plus,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Gavel,
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
    >
      <div className="h-full brand-card rounded-none border-l-0 border-t-0 border-b-0 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5 text-accent" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm leading-tight">AI Arbitrator</h1>
                <p className="text-[10px] text-muted-foreground">On-chain Justice</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Dispute Button */}
        <div className="p-3">
          <button
            onClick={onCreateDispute}
            className={`w-full btn-primary flex items-center justify-center gap-2 ${
              collapsed ? "px-0 py-2" : "px-4 py-2.5"
            }`}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>New Dispute</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeSection === item.id
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* External Links */}
        {!collapsed && (
          <div className="px-3 pb-3">
            <div className="border-t border-border/50 pt-3">
              <p className="text-[10px] text-muted-foreground px-3 mb-2 uppercase tracking-wider">
                Links
              </p>
              {externalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/20 hover:text-foreground transition-all"
                >
                  <link.icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Info */}
        <div className="p-3 border-t border-border/50">
          {isConnected && address ? (
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono truncate">{formatAddress(address)}</p>
                  <p className="text-[10px] text-muted-foreground">Connected</p>
                </div>
              )}
              <button
                onClick={disconnectWallet}
                className="p-2 rounded-lg hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-all"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className={`text-center ${collapsed ? "" : "text-xs text-muted-foreground"}`}>
              {collapsed ? (
                <Gavel className="w-4 h-4 mx-auto text-muted-foreground" />
              ) : (
                <p>Connect wallet to start</p>
              )}
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 rounded-r-lg bg-card border border-l-0 border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>
    </aside>
  );
}
