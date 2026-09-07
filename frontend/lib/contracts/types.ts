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
  deadline: number;
}

export interface Stats {
  total_created: number;
  total_resolved: number;
  plaintiff_wins: number;
  defendant_wins: number;
  split_decisions: number;
  dismissed: number;
  creation_fee: number;
  owner: string;
}

export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: any;
}
