# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

import json
from dataclasses import dataclass
from genlayer import *


@allow_storage
@dataclass
class Evidence:
    submitter: str
    evidence_type: str
    data: str
    timestamp: str


@allow_storage
@dataclass
class Dispute:
    id: u256
    plaintiff: str
    defendant: str
    title: str
    description: str
    evidence: DynArray[Evidence, 20]
    state: str
    verdict: str
    explanation: str
    created_at: str


class AIArbitrator(gl.Contract):
    disputes: TreeMap[u256, Dispute]
    dispute_count: u256

    def __init__(self):
        self.dispute_count = 0

    @gl.public.write.payable
    def create_dispute(
        self,
        defendant: str,
        title: str,
        description: str,
    ) -> u256:
        dispute_id = self.dispute_count
        self.dispute_count += 1

        sender = gl.message.sender_address.as_hex

        dispute = Dispute(
            id=dispute_id,
            plaintiff=sender,
            defendant=defendant,
            title=title,
            description=description,
            evidence=[],
            state="open",
            verdict="",
            explanation="",
            created_at="",
        )
        self.disputes[dispute_id] = dispute

        return dispute_id

    @gl.public.write
    def submit_evidence(
        self,
        dispute_id: u256,
        evidence_type: str,
        data: str,
    ):
        dispute = self.disputes[dispute_id]
        if dispute.state not in ("open", "evidence_submitted"):
            raise Exception("Dispute not accepting evidence")

        sender = gl.message.sender_address.as_hex
        if sender != dispute.plaintiff and sender != dispute.defendant:
            raise Exception("Only parties can submit evidence")

        evidence = Evidence(
            submitter=sender,
            evidence_type=evidence_type,
            data=data,
            timestamp="",
        )
        dispute.evidence.append(evidence)
        dispute.state = "evidence_submitted"

    @gl.public.write
    def start_review(self, dispute_id: u256):
        dispute = self.disputes[dispute_id]
        if dispute.state != "evidence_submitted":
            raise Exception("Must submit evidence before review")

        sender = gl.message.sender_address.as_hex
        if sender != dispute.plaintiff:
            raise Exception("Only plaintiff can start review")

        dispute.state = "under_review"

    @gl.public.write
    def resolve_dispute(self, dispute_id: u256) -> str:
        dispute = self.disputes[dispute_id]
        if dispute.state != "under_review":
            raise Exception("Dispute not under review")

        evidence_text = ""
        for i in range(len(dispute.evidence)):
            ev = dispute.evidence[i]
            evidence_text += f"#{i+1} [{ev.evidence_type}] from {ev.submitter}: {ev.data}\n"

        prompt = f"""You are an impartial AI judge in a decentralized dispute resolution system.

DISPUTE: {dispute.title}
DESCRIPTION: {dispute.description}

EVIDENCE:
{evidence_text}

Based on the evidence, render a fair verdict.

You MUST respond with ONLY a JSON object, nothing else:
{{"verdict": "PLAINTIFF_WINS" or "DEFENDANT_WINS" or "SPLIT" or "DISMISSED", "explanation": "brief explanation"}}

No other text. Only the JSON."""

        result = gl.nondet.exec_prompt(prompt, response_format="json")

        verdict = result.get("verdict", "DISMISSED")
        explanation = result.get("explanation", "No explanation provided")

        dispute.verdict = verdict
        dispute.explanation = explanation
        dispute.state = "decided"

        return json.dumps({"verdict": verdict, "explanation": explanation})

    @gl.public.view
    def get_dispute(self, dispute_id: u256) -> dict:
        dispute = self.disputes[dispute_id]
        evidence_list = []
        for i in range(len(dispute.evidence)):
            ev = dispute.evidence[i]
            evidence_list.append({
                "submitter": ev.submitter,
                "evidence_type": ev.evidence_type,
                "data": ev.data,
            })
        return {
            "id": str(dispute.id),
            "plaintiff": dispute.plaintiff,
            "defendant": dispute.defendant,
            "title": dispute.title,
            "description": dispute.description,
            "evidence": evidence_list,
            "state": dispute.state,
            "verdict": dispute.verdict,
            "explanation": dispute.explanation,
        }

    @gl.public.view
    def get_dispute_count(self) -> int:
        return int(self.dispute_count)
