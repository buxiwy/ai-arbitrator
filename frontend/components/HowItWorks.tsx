"use client";

import { Scale, FileText, Gavel, CheckCircle, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Scale,
      title: "File a Dispute",
      description: "Submit a dispute against another party. Describe the issue and provide context for the AI judge.",
      accent: "rgba(255,255,255,0.7)",
    },
    {
      icon: FileText,
      title: "Submit Evidence",
      description: "Both parties submit evidence to support their case. Text, URLs, images, and documents are accepted.",
      accent: "rgba(100,180,255,0.8)",
    },
    {
      icon: Gavel,
      title: "AI Review",
      description: "The AI judge evaluates all evidence impartially using GenLayer's non-deterministic LLM execution.",
      accent: "rgba(180,130,255,0.8)",
    },
    {
      icon: CheckCircle,
      title: "Verdict Delivered",
      description: "A fair verdict is reached through Optimistic Democracy consensus — validators verify the AI's reasoning.",
      accent: "rgba(80,220,130,0.8)",
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
      {/* Feature Illustration Banner */}
      <div className="relative h-40 overflow-hidden">
        <img
          src="/images/Feature Illustration.png"
          alt="How it Works"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.7) contrast(1.1)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(18,18,26,0.3) 0%, rgba(18,18,26,1) 100%)" }} />
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <h2 className="text-xl font-bold text-white/95">How it Works</h2>
          <p className="text-xs text-white/40 mt-1">Four simple steps to on-chain justice</p>
        </div>
      </div>

      {/* Content */}
      <div
        className="p-6"
        style={{
          background: "linear-gradient(135deg, rgba(18,18,26,0.95) 0%, rgba(12,12,16,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderTop: "none",
        }}
      >
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-start gap-4">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <step.icon className="w-4 h-4" style={{ color: step.accent }} />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-px h-6 mt-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                )}
              </div>
              <div className="pt-1">
                <div className="text-sm font-semibold text-white/85">{step.title}</div>
                <p className="text-xs text-white/35 mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-6 pt-4 border-t border-white/[0.06]">
          <p className="text-[10px] text-white/25 mb-2.5 uppercase tracking-wider text-center">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["GenLayer SDK", "Python", "Next.js 15", "TypeScript", "TanStack Query"].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-[10px] text-white/35"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
