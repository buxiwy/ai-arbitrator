"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import AIArbitrator from "../contracts/AIArbitrator";
import { getContractAddress, getStudioUrl } from "../genlayer/client";
import { useWallet } from "../genlayer/wallet";
import { success, error } from "../utils/toast";
import type { Dispute } from "../contracts/types";

export function useAIArbitratorContract(): AIArbitrator | null {
  const { address } = useWallet();
  const contractAddress = getContractAddress();
  const studioUrl = getStudioUrl();

  const contract = useMemo(() => {
    if (!contractAddress) return null;
    return new AIArbitrator(contractAddress, address, studioUrl);
  }, [contractAddress, address, studioUrl]);

  return contract;
}

export function useDisputeCount() {
  const contract = useAIArbitratorContract();

  return useQuery<number, Error>({
    queryKey: ["disputeCount"],
    queryFn: () => {
      if (!contract) return Promise.resolve(0);
      return contract.getDisputeCount();
    },
    refetchOnWindowFocus: true,
    staleTime: 2000,
    enabled: !!contract,
  });
}

export function useDisputes() {
  const contract = useAIArbitratorContract();

  return useQuery<Dispute[], Error>({
    queryKey: ["disputes"],
    queryFn: () => {
      if (!contract) return Promise.resolve([]);
      return contract.getAllDisputes();
    },
    refetchOnWindowFocus: true,
    staleTime: 2000,
    enabled: !!contract,
  });
}

export function useDispute(id: number) {
  const contract = useAIArbitratorContract();

  return useQuery<Dispute | null, Error>({
    queryKey: ["dispute", id],
    queryFn: () => {
      if (!contract) return Promise.resolve(null);
      return contract.getDispute(id);
    },
    enabled: !!contract && !isNaN(id),
    staleTime: 2000,
  });
}

export function useCreateDispute() {
  const contract = useAIArbitratorContract();
  const { address } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      defendant,
      title,
      description,
    }: {
      defendant: string;
      title: string;
      description: string;
    }) => {
      if (!contract) throw new Error("Contract not configured");
      if (!address) throw new Error("Wallet not connected");
      return contract.createDispute(defendant, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      queryClient.invalidateQueries({ queryKey: ["disputeCount"] });
      success("Dispute created!", {
        description: "Your dispute has been submitted to the blockchain.",
      });
    },
    onError: (err: any) => {
      error("Failed to create dispute", {
        description: err?.message || "Please try again.",
      });
    },
  });

  return {
    ...mutation,
    createDispute: mutation.mutate,
    createDisputeAsync: mutation.mutateAsync,
  };
}

export function useSubmitEvidence() {
  const contract = useAIArbitratorContract();
  const { address } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      disputeId,
      evidenceType,
      data,
    }: {
      disputeId: number;
      evidenceType: string;
      data: string;
    }) => {
      if (!contract) throw new Error("Contract not configured");
      if (!address) throw new Error("Wallet not connected");
      return contract.submitEvidence(disputeId, evidenceType, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      success("Evidence submitted!", {
        description: "Your evidence has been recorded.",
      });
    },
    onError: (err: any) => {
      error("Failed to submit evidence", {
        description: err?.message || "Please try again.",
      });
    },
  });

  return {
    ...mutation,
    submitEvidence: mutation.mutate,
    submitEvidenceAsync: mutation.mutateAsync,
  };
}

export function useStartReview() {
  const contract = useAIArbitratorContract();
  const { address } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (disputeId: number) => {
      if (!contract) throw new Error("Contract not configured");
      if (!address) throw new Error("Wallet not connected");
      return contract.startReview(disputeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      success("Review started!", {
        description: "The AI judge is now evaluating the evidence.",
      });
    },
    onError: (err: any) => {
      error("Failed to start review", {
        description: err?.message || "Please try again.",
      });
    },
  });

  return {
    ...mutation,
    startReview: mutation.mutate,
    startReviewAsync: mutation.mutateAsync,
  };
}

export function useResolveDispute() {
  const contract = useAIArbitratorContract();
  const { address } = useWallet();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (disputeId: number) => {
      if (!contract) throw new Error("Contract not configured");
      if (!address) throw new Error("Wallet not connected");
      return contract.resolveDispute(disputeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      success("Dispute resolved!", {
        description: "The AI verdict has been delivered.",
      });
    },
    onError: (err: any) => {
      error("Failed to resolve dispute", {
        description: err?.message || "Please try again.",
      });
    },
  });

  return {
    ...mutation,
    resolveDispute: mutation.mutate,
    resolveDisputeAsync: mutation.mutateAsync,
  };
}
