"use client";

import { useUserDisputes } from "@/lib/hooks/useAIArbitrator";
import { useWallet } from "@/lib/genlayer/WalletProvider";

export function useNotifications() {
  const { address } = useWallet();
  const { data: disputes = [] } = useUserDisputes();

  if (!address) return { count: 0, items: [] };

  const items = disputes
    .filter((d) => {
      if (d.state === "decided") return false;
      const isPlaintiff = d.plaintiff.toLowerCase() === address.toLowerCase();
      const isDefendant = d.defendant.toLowerCase() === address.toLowerCase();
      if (isPlaintiff && d.state === "evidence_submitted") return true;
      if (isDefendant && (d.state === "open" || d.state === "evidence_submitted")) return true;
      return false;
    })
    .map((d) => ({
      id: Number(d.id),
      title: d.title,
      state: d.state,
    }));

  return { count: items.length, items };
}
