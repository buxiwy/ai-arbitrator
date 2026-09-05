"""Tests for AI Arbitrator — dispute creation, evidence, and resolution."""

import json

from tests.direct.conftest import to_hex


def test_create_dispute(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/ai_arbitrator.py")
    direct_vm.sender = direct_alice
    alice = to_hex(direct_alice)

    dispute_id = contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Service not delivered",
        description="I paid for a service but it was never delivered",
    )

    assert dispute_id == 0
    assert contract.get_dispute_count() == 1

    dispute = contract.get_dispute(0)
    assert dispute["title"] == "Service not delivered"
    assert dispute["plaintiff"] == alice
    assert dispute["state"] == "open"


def test_submit_evidence(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/ai_arbitrator.py")
    direct_vm.sender = direct_alice

    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Test dispute",
        description="Test",
    )

    contract.submit_evidence(
        dispute_id=0,
        evidence_type="text",
        data="Payment receipt showing $500 transfer",
    )

    dispute = contract.get_dispute(0)
    assert dispute["state"] == "evidence_submitted"
    assert len(dispute["evidence"]) == 1
    assert dispute["evidence"][0]["data"] == "Payment receipt showing $500 transfer"


def test_submit_multiple_evidence(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/ai_arbitrator.py")
    direct_vm.sender = direct_alice

    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Test",
        description="Test",
    )

    contract.submit_evidence(0, "text", "Evidence A")
    contract.submit_evidence(0, "url", "https://example.com/proof")
    contract.submit_evidence(0, "image", "screenshot.png")

    dispute = contract.get_dispute(0)
    assert len(dispute["evidence"]) == 3


def test_unauthorized_evidence_fails(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy("contracts/ai_arbitrator.py")

    direct_vm.sender = direct_alice
    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Test",
        description="Test",
    )

    direct_vm.sender = direct_bob
    with direct_vm.expect_revert("Only parties can submit evidence"):
        contract.submit_evidence(0, "text", "Fake evidence")


def test_start_review(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/ai_arbitrator.py")
    direct_vm.sender = direct_alice

    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Test",
        description="Test",
    )
    contract.submit_evidence(0, "text", "Some evidence")
    contract.start_review(0)

    dispute = contract.get_dispute(0)
    assert dispute["state"] == "under_review"


def test_resolve_dispute(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/ai_arbitrator.py")
    direct_vm.sender = direct_alice

    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Late delivery",
        description="Freelancer delivered 3 days late",
    )
    contract.submit_evidence(0, "text", "Contract says 5 days, delivered on day 8")
    contract.start_review(0)

    direct_vm.mock_llm(
        r".*impartial AI judge.*",
        json.dumps({
            "verdict": "PLAINTIFF_WINS",
            "explanation": "The evidence shows the deadline was missed by 3 days.",
        }),
    )

    result = contract.resolve_dispute(0)
    parsed = json.loads(result)

    assert parsed["verdict"] == "PLAINTIFF_WINS"
    assert "deadline" in parsed["explanation"].lower()

    dispute = contract.get_dispute(0)
    assert dispute["state"] == "decided"
    assert dispute["verdict"] == "PLAINTIFF_WINS"


def test_resolve_defendant_wins(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/ai_arbitrator.py")
    direct_vm.sender = direct_alice

    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Quality complaint",
        description="Client says work quality is poor",
    )
    contract.submit_evidence(0, "text", "Work meets all requirements in contract")
    contract.start_review(0)

    direct_vm.mock_llm(
        r".*",
        json.dumps({
            "verdict": "DEFENDANT_WINS",
            "explanation": "The work meets all contractual requirements.",
        }),
    )

    result = contract.resolve_dispute(0)
    parsed = json.loads(result)
    assert parsed["verdict"] == "DEFENDANT_WINS"


def test_cannot_resolve_without_review(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/ai_arbitrator.py")
    direct_vm.sender = direct_alice

    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Test",
        description="Test",
    )

    with direct_vm.expect_revert("Dispute not under review"):
        contract.resolve_dispute(0)


def test_get_dispute_count(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/ai_arbitrator.py")
    direct_vm.sender = direct_alice

    assert contract.get_dispute_count() == 0

    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Test 1",
        description="Test",
    )
    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Test 2",
        description="Test",
    )

    assert contract.get_dispute_count() == 2


def test_user_disputes(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/ai_arbitrator.py")
    direct_vm.sender = direct_alice
    alice = to_hex(direct_alice)

    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Dispute 1",
        description="Test",
    )
    contract.create_dispute(
        defendant="0xAABBCCDD00112233445566778899001122334455",
        title="Dispute 2",
        description="Test",
    )

    user_disputes = contract.get_user_disputes(alice)
    assert len(user_disputes) == 2
