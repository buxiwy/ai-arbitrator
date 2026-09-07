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
    dispute_deadline: TreeMap[u256, u256]
    evidence_count: TreeMap[u256, u256]
    evidence_submitter: TreeMap[str, str]
    evidence_type: TreeMap[str, str]
    evidence_data: TreeMap[str, str]
    user_dispute_count: TreeMap[str, u256]
    user_dispute_ids: TreeMap[str, u256]
    owner: str
    creation_fee: u256
    total_resolved: u256
    plaintiff_wins: u256
    defendant_wins: u256
    split_decisions: u256
    dismissed_count: u256

    def __init__(self):
        self.dispute_count = 0
        self.owner = gl.message.sender_address.as_hex.lower()
        self.creation_fee = 0
        self.total_resolved = 0
        self.plaintiff_wins = 0
        self.defendant_wins = 0
        self.split_decisions = 0
        self.dismissed_count = 0

    def _validate_address(self, addr: str):
        if len(addr) != 42 or not addr.startswith("0x"):
            raise Exception("Invalid address format")

    @gl.public.write.payable
    def create_dispute(self, defendant: str, title: str, description: str) -> u256:
        if gl.message.value < self.creation_fee:
            raise Exception("Insufficient fee")
        self._validate_address(defendant)
        defendant_lower = defendant.lower()
        sender = gl.message.sender_address.as_hex.lower()
        if sender == defendant_lower:
            raise Exception("Cannot dispute yourself")
        count = self.user_dispute_count[sender]
        for i in range(count):
            id = self.user_dispute_ids[f"{sender}_{i}"]
            if self.dispute_defendant[id] == defendant_lower and self.dispute_title[id] == title:
                raise Exception("Duplicate dispute")
        dispute_id = self.dispute_count
        self.dispute_count += 1
        self.dispute_plaintiff[dispute_id] = sender
        self.dispute_defendant[dispute_id] = defendant_lower
        self.dispute_title[dispute_id] = title
        self.dispute_description[dispute_id] = description
        self.dispute_state[dispute_id] = "open"
        self.dispute_verdict[dispute_id] = ""
        self.dispute_explanation[dispute_id] = ""
        self.evidence_count[dispute_id] = 0
        self.dispute_deadline[dispute_id] = gl.message.timestamp + 604800
        idx = self.user_dispute_count[sender]
        self.user_dispute_ids[f"{sender}_{idx}"] = dispute_id
        self.user_dispute_count[sender] = idx + 1
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
    def check_timeout(self, dispute_id: u256):
        state = self.dispute_state[dispute_id]
        if state == "decided":
            return
        deadline = self.dispute_deadline[dispute_id]
        if gl.message.timestamp <= deadline:
            return
        if state == "open":
            self.dispute_verdict[dispute_id] = "PLAINTIFF_WINS"
            self.dispute_explanation[dispute_id] = "Defendant failed to respond within deadline"
            self.dispute_state[dispute_id] = "decided"
            self.total_resolved += 1
            self.plaintiff_wins += 1
        elif state == "evidence_submitted":
            self.dispute_verdict[dispute_id] = "PLAINTIFF_WINS"
            self.dispute_explanation[dispute_id] = "Review not initiated within deadline, default judgment for plaintiff"
            self.dispute_state[dispute_id] = "decided"
            self.total_resolved += 1
            self.plaintiff_wins += 1
        elif state == "under_review":
            ev_count = self.evidence_count[dispute_id]
            has_defendant_evidence = False
            for i in range(ev_count):
                key_prefix = f"{dispute_id}_{i}"
                if self.evidence_submitter[key_prefix] == self.dispute_defendant[dispute_id]:
                    has_defendant_evidence = True
                    break
            if not has_defendant_evidence:
                self.dispute_verdict[dispute_id] = "PLAINTIFF_WINS"
                self.dispute_explanation[dispute_id] = "Defendant failed to participate in review, default judgment for plaintiff"
                self.dispute_state[dispute_id] = "decided"
                self.total_resolved += 1
                self.plaintiff_wins += 1

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
        self.total_resolved += 1
        if verdict == "PLAINTIFF_WINS":
            self.plaintiff_wins += 1
        elif verdict == "DEFENDANT_WINS":
            self.defendant_wins += 1
        elif verdict == "SPLIT":
            self.split_decisions += 1
        elif verdict == "DISMISSED":
            self.dismissed_count += 1
        return json.dumps({"verdict": verdict, "explanation": explanation})

    @gl.public.write
    def withdraw_fees(self):
        sender = gl.message.sender_address.as_hex.lower()
        if sender != self.owner:
            raise Exception("Only owner can withdraw")

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
            "deadline": int(self.dispute_deadline[dispute_id]),
        }

    @gl.public.view
    def get_user_disputes(self, address: str) -> list:
        addr = address.lower()
        count = self.user_dispute_count[addr]
        ids = []
        for i in range(count):
            ids.append(int(self.user_dispute_ids[f"{addr}_{i}"]))
        return ids

    @gl.public.view
    def get_dispute_count(self) -> int:
        return int(self.dispute_count)

    @gl.public.view
    def get_stats(self) -> dict:
        return {
            "total_created": int(self.dispute_count),
            "total_resolved": int(self.total_resolved),
            "plaintiff_wins": int(self.plaintiff_wins),
            "defendant_wins": int(self.defendant_wins),
            "split_decisions": int(self.split_decisions),
            "dismissed": int(self.dismissed_count),
            "creation_fee": int(self.creation_fee),
            "owner": self.owner,
        }
