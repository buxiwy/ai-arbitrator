export interface Evidence {
  submitter: string;
  evidence_type: string;
  data: string;
}

export interface Dispute {
  id: string;
  plaintiff: string;
  defendant: string;
  title: string;
  description: string;
  evidence: Evidence[];
  state: string;
  verdict: string;
  explanation: string;
}

export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: any;
}
