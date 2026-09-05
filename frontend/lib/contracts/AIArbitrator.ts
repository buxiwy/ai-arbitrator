import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { Dispute, TransactionReceipt } from "./types";

class AIArbitrator {
  private contractAddress: `0x${string}`;
  private client: any;
  private studioUrl?: string;

  constructor(
    contractAddress: string,
    address?: string | null,
    studioUrl?: string
  ) {
    this.contractAddress = contractAddress as `0x${string}`;
    this.studioUrl = studioUrl;

    const config: any = {
      chain: studionet,
    };

    if (address) {
      config.account = address as `0x${string}`;
    }

    if (studioUrl) {
      config.endpoint = studioUrl;
    }

    this.client = createClient(config);
  }

  updateAccount(address: string): void {
    const config: any = {
      chain: studionet,
      account: address as `0x${string}`,
    };

    if (this.studioUrl) {
      config.endpoint = this.studioUrl;
    }

    this.client = createClient(config);
  }

  async getDisputeCount(): Promise<number> {
    try {
      const count = await this.client.readContract({
        address: this.contractAddress,
        functionName: "get_dispute_count",
        args: [],
      });
      return Number(count) || 0;
    } catch (error) {
      console.error("Error fetching dispute count:", error);
      return 0;
    }
  }

  async getDispute(disputeId: number): Promise<Dispute | null> {
    try {
      const dispute: any = await this.client.readContract({
        address: this.contractAddress,
        functionName: "get_dispute",
        args: [BigInt(disputeId)],
      });

      if (dispute instanceof Map) {
        const obj = Array.from(dispute.entries()).reduce(
          (acc: any, [key, value]: any) => {
            if (key === "evidence" && value instanceof Array) {
              acc[key] = value.map((ev: any) => {
                if (ev instanceof Map) {
                  return Array.from(ev.entries()).reduce(
                    (o: any, [k, v]: any) => {
                      o[k] = v;
                      return o;
                    },
                    {}
                  );
                }
                return ev;
              });
            } else {
              acc[key] = value;
            }
            return acc;
          },
          {}
        ) as Dispute;
        return obj;
      }

      return dispute as Dispute;
    } catch (error) {
      console.error(`Error fetching dispute ${disputeId}:`, error);
      return null;
    }
  }

  async getAllDisputes(): Promise<Dispute[]> {
    try {
      const count = await this.getDisputeCount();
      const disputes: Dispute[] = [];

      for (let i = 0; i < count; i++) {
        const dispute = await this.getDispute(i);
        if (dispute) {
          disputes.push(dispute);
        }
      }

      return disputes.reverse();
    } catch (error) {
      console.error("Error fetching disputes:", error);
      return [];
    }
  }

  async createDispute(
    defendant: string,
    title: string,
    description: string
  ): Promise<TransactionReceipt> {
    try {
      const txHash = await this.client.writeContract({
        address: this.contractAddress,
        functionName: "create_dispute",
        args: [defendant, title, description],
        value: BigInt(0),
      });

      const receipt = await this.client.waitForTransactionReceipt({
        hash: txHash,
        status: "ACCEPTED" as any,
        retries: 24,
        interval: 5000,
      });

      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error creating dispute:", error);
      throw new Error("Failed to create dispute");
    }
  }

  async submitEvidence(
    disputeId: number,
    evidenceType: string,
    data: string
  ): Promise<TransactionReceipt> {
    try {
      const txHash = await this.client.writeContract({
        address: this.contractAddress,
        functionName: "submit_evidence",
        args: [BigInt(disputeId), evidenceType, data],
        value: BigInt(0),
      });

      const receipt = await this.client.waitForTransactionReceipt({
        hash: txHash,
        status: "ACCEPTED" as any,
        retries: 24,
        interval: 5000,
      });

      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error submitting evidence:", error);
      throw new Error("Failed to submit evidence");
    }
  }

  async startReview(disputeId: number): Promise<TransactionReceipt> {
    try {
      const txHash = await this.client.writeContract({
        address: this.contractAddress,
        functionName: "start_review",
        args: [BigInt(disputeId)],
        value: BigInt(0),
      });

      const receipt = await this.client.waitForTransactionReceipt({
        hash: txHash,
        status: "ACCEPTED" as any,
        retries: 24,
        interval: 5000,
      });

      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error starting review:", error);
      throw new Error("Failed to start review");
    }
  }

  async resolveDispute(disputeId: number): Promise<TransactionReceipt> {
    try {
      const txHash = await this.client.writeContract({
        address: this.contractAddress,
        functionName: "resolve_dispute",
        args: [BigInt(disputeId)],
        value: BigInt(0),
      });

      const receipt = await this.client.waitForTransactionReceipt({
        hash: txHash,
        status: "ACCEPTED" as any,
        retries: 24,
        interval: 5000,
      });

      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error resolving dispute:", error);
      throw new Error("Failed to resolve dispute");
    }
  }
}

export default AIArbitrator;
