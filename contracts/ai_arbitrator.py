# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

import json
from genlayer import *


class AIArbitrator(gl.Contract):
    dispute_count: u256
    dispute_plaintiff: TreeMap[u256, str]
    dispute_defendant: TreeMap[u256, str]
    dispute_title: TreeMap[u256, str]
    dispute_description: TreeMap[u256, str]
    dispute_state: TreeMap[u256, str]
    dispute_verdict: TreeMap[u256, str]
    dispute_explanation: TreeMap[u256, str]
    evidence_count: TreeMap[u256, u256]
    evidence_submitter: TreeMap[str, str]
    evidence_type: TreeMap[str, str]
    evidence_data: TreeMap[str, str]

    def __init__(self):
        self.dispute_count = 0

    @gl.public.write.payable
    def create_dispute(self, defendant: str, title: str, description: str) -> u256:
        dispute_id = self.dispute_count
        self.dispute_count += 1
        sender = gl.message.sender_address.as_hex.lower()
        self.dispute_plaintiff[dispute_id] = sender
        self.dispute_defendant[dispute_id] = defendant.lower()
        self.dispute_title[dispute_id] = title
        self.dispute_description[dispute_id] = description
        self.dispute_state[dispute_id] = "open"
        self.dispute_verdict[dispute_id] = ""
        self.dispute_explanation[dispute_id] = ""
        self.evidence_count[dispute_id] = 0
        return dispute_id

    @gl.public.write
    def submit_evidence(self, dispute_id: u256, evidence_type: str, data: str):
        state = self.dispute_state[dispute_id]
        if state not in ("open", "evidence_submitted"):
            raise Exception("Dispute not accepting evidence")
        sender = gl.message.sender_address.as_hex.lower()
        if sender != self.dispute_plaintiff[dispute_id] and sender != self.dispute_defendant[dispute_id]:
            raise Exception("Only parties can submit evidence")
        ev_id = self.evidence_count[dispute_id]
        key_prefix = f"{dispute_id}_{ev_id}"
        self.evidence_submitter[key_prefix] = sender
        self.evidence_type[key_prefix] = evidence_type
        self.evidence_data[key_prefix] = data
        self.evidence_count[dispute_id] = ev_id + 1
        self.dispute_state[dispute_id] = "evidence_submitted"

    @gl.public.write
    def start_review(self, dispute_id: u256):
        state = self.dispute_state[dispute_id]
        if state != "evidence_submitted":
            raise Exception("Must submit evidence before review")
        sender = gl.message.sender_address.as_hex.lower()
        if sender != self.dispute_plaintiff[dispute_id]:
            raise Exception("Only plaintiff can start review")
        self.dispute_state[dispute_id] = "under_review"

    @gl.public.write
    def resolve_dispute(self, dispute_id: u256) -> str:
        state = self.dispute_state[dispute_id]
        if state != "under_review":
            raise Exception("Dispute not under review")
        ev_count = self.evidence_count[dispute_id]
        evidence_text = ""
        for i in range(ev_count):
            key_prefix = f"{dispute_id}_{i}"
            evidence_text += f"#{i+1} [{self.evidence_type[key_prefix]}] from {self.evidence_submitter[key_prefix]}: {self.evidence_data[key_prefix]}\n"
        title = self.dispute_title[dispute_id]
        description = self.dispute_description[dispute_id]
        prompt = f"""You are an impartial AI judge in a decentralized dispute resolution system.

DISPUTE: {title}
DESCRIPTION: {description}

EVIDENCE:
{evidence_text}

Based on the evidence, render a fair verdict.

You MUST respond with ONLY a JSON object, nothing else:
{{"verdict": "PLAINTIFF_WINS" or "DEFENDANT_WINS" or "SPLIT" or "DISMISSED", "explanation": "brief explanation"}}

No other text. Only the JSON."""
        result = gl.nondet.exec_prompt(prompt, response_format="json")
        verdict = result.get("verdict", "DISMISSED")
        explanation = result.get("explanation", "No explanation provided")
        self.dispute_verdict[dispute_id] = verdict
        self.dispute_explanation[dispute_id] = explanation
        self.dispute_state[dispute_id] = "decided"
        return json.dumps({"verdict": verdict, "explanation": explanation})

    @gl.public.view
    def get_dispute(self, dispute_id: u256) -> dict:
        ev_count = self.evidence_count[dispute_id]
        evidence_list = []
        for i in range(ev_count):
            key_prefix = f"{dispute_id}_{i}"
            evidence_list.append({
                "submitter": self.evidence_submitter[key_prefix],
                "evidence_type": self.evidence_type[key_prefix],
                "data": self.evidence_data[key_prefix],
            })
        return {
            "id": str(dispute_id),
            "plaintiff": self.dispute_plaintiff[dispute_id],
            "defendant": self.dispute_defendant[dispute_id],
            "title": self.dispute_title[dispute_id],
            "description": self.dispute_description[dispute_id],
            "evidence": evidence_list,
            "state": self.dispute_state[dispute_id],
            "verdict": self.dispute_verdict[dispute_id],
            "explanation": self.dispute_explanation[dispute_id],
        }

    @gl.public.view
    def get_dispute_count(self) -> int:
        return int(self.dispute_count)
