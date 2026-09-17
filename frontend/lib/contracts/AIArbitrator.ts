import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { Dispute, Stats, TransactionReceipt } from "./types";

const studioNext = {
  ...studionet,
  id: 61997,
  name: "GenLayer Studio Next",
  rpcUrls: { default: { http: ["https://studio.genlayer.com/api"] } },
};

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
      chain: studioNext,
    };

    if (address) {
      config.account = address as `0x${string}`;
    }

    if (studioUrl) {
      config.endpoint = studioUrl;
    }

    if (typeof window !== "undefined" && window.ethereum) {
      config.provider = window.ethereum;
    }

    this.client = createClient(config);
  }

  updateAccount(address: string): void {
    const config: any = {
      chain: studioNext,
      account: address as `0x${string}`,
    };

    if (this.studioUrl) {
      config.endpoint = this.studioUrl;
    }

    if (typeof window !== "undefined" && window.ethereum) {
      config.provider = window.ethereum;
    }

    this.client = createClient(config);
  }

  /**
   * GenLayer lifecycle status (ACCEPTED/FINALIZED) only means the network
   * took the transaction — it does NOT mean the contract code executed
   * successfully. A failed execution still produces a receipt, so every
   * write must pass this check or the UI will report false success.
   */
  private assertTxAccepted(receipt: any, action: string): void {
    const status = receipt?.status;
    const statusName =
      receipt?.statusName ?? receipt?.status_name ?? receipt?.statusname;
    const ok =
      status === 5 ||
      status === 6 ||
      statusName === "ACCEPTED" ||
      statusName === "FINALIZED";
    if (!ok) {
      console.error(`${action} receipt:`, receipt);
      throw new Error(
        `${action} was not accepted by the network (status: ${
          statusName ?? status ?? "unknown"
        }). No state was changed — check the contract address and inputs.`
      );
    }
  }

  private describeError(error: unknown): string {
    if (error instanceof Error && error.message) return error.message;
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
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

  async getUserDisputes(address: string): Promise<Dispute[]> {
    try {
      const ids: bigint[] = await this.client.readContract({
        address: this.contractAddress,
        functionName: "get_user_disputes",
        args: [address],
      });

      const disputes: Dispute[] = [];
      for (const id of ids) {
        const dispute = await this.getDispute(Number(id));
        if (dispute) {
          disputes.push(dispute);
        }
      }

      return disputes.reverse();
    } catch (error) {
      console.error("Error fetching user disputes:", error);
      return [];
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
        retries: 30,
        interval: 5000,
      });

      this.assertTxAccepted(receipt, "Create dispute");
      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error creating dispute:", error);
      throw new Error(`Failed to create dispute: ${this.describeError(error)}`);
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
        retries: 30,
        interval: 5000,
      });

      this.assertTxAccepted(receipt, "Submit evidence");
      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error submitting evidence:", error);
      throw new Error(`Failed to submit evidence: ${this.describeError(error)}`);
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
        retries: 30,
        interval: 5000,
      });

      this.assertTxAccepted(receipt, "Start review");
      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error starting review:", error);
      throw new Error(`Failed to start review: ${this.describeError(error)}`);
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
        retries: 30,
        interval: 5000,
      });

      this.assertTxAccepted(receipt, "Resolve dispute");
      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error resolving dispute:", error);
      throw new Error(`Failed to resolve dispute: ${this.describeError(error)}`);
    }
  }

  async checkTimeout(disputeId: number): Promise<TransactionReceipt> {
    try {
      const txHash = await this.client.writeContract({
        address: this.contractAddress,
        functionName: "check_timeout",
        args: [BigInt(disputeId)],
        value: BigInt(0),
      });

      const receipt = await this.client.waitForTransactionReceipt({
        hash: txHash,
        retries: 30,
        interval: 5000,
      });

      this.assertTxAccepted(receipt, "Check timeout");
      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error checking timeout:", error);
      throw new Error(`Failed to check timeout: ${this.describeError(error)}`);
    }
  }

  async getStats(): Promise<Stats | null> {
    try {
      const result: any = await this.client.readContract({
        address: this.contractAddress,
        functionName: "get_stats",
        args: [],
      });

      if (result instanceof Map) {
        return Array.from(result.entries()).reduce(
          (acc: any, [key, value]: any) => {
            acc[key] = value;
            return acc;
          },
          {}
        ) as Stats;
      }

      return result as Stats;
    } catch (error) {
      console.error("Error fetching stats:", error);
      return null;
    }
  }
}

export default AIArbitrator;
