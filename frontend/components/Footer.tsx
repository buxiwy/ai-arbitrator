"use client";

import { Scale, Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="mt-8 py-6 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-white/20" />
          <span className="text-xs text-white/30">
            AI Arbitrator — Built for GenLayer Agent Tank Hackathon
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/buxiwy/ai-arbitrator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://docs.genlayer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>GenLayer Docs</span>
          </a>
          <span className="text-[10px] text-white/15">
            On-chain Justice
          </span>
        </div>
      </div>
    </footer>
  );
}
