"use client";

import { Scale, FileText, Gavel, CheckCircle, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Scale,
      title: "File a Dispute",
      description: "Submit a dispute against another party. Describe the issue and provide context for the AI judge.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: FileText,
      title: "Submit Evidence",
      description: "Both parties submit evidence to support their case. Text, URLs, images, and documents are accepted.",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      icon: Gavel,
      title: "AI Review",
      description: "The AI judge evaluates all evidence impartially using GenLayer's non-deterministic LLM execution.",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      icon: CheckCircle,
      title: "Verdict Delivered",
      description: "A fair verdict is reached through Optimistic Democracy consensus — validators verify the AI's reasoning.",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
  ];

  return (
    <div className="brand-card p-6 md:p-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">How it Works</h2>
        <p className="text-sm text-muted-foreground">Four simple steps to on-chain justice</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={step.title} className="relative">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block w-4 h-4 text-muted-foreground absolute right-0 top-6 translate-x-1/2" />
                )}
              </div>
              <div>
                <div className={`font-bold text-lg ${step.color}`}>{step.title}</div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="mt-8 pt-6 border-t border-border/50">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-3">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["GenLayer SDK", "Python", "Next.js 15", "TypeScript", "TanStack Query"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs bg-muted/20 text-muted-foreground border border-border/50"
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
