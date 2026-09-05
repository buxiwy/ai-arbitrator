# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
# Linting
genvm-lint check contracts/ai_arbitrator.py

# Testing
pytest tests/direct/ -v                        # Direct mode tests (fast, no Studio)
gltest tests/integration/ -v -s                # Integration tests (requires Studio)

# Deployment
genlayer network                               # Select network
genlayer deploy                                # Deploy contracts

# Frontend
cd frontend && npm run dev                     # Start frontend dev server
```

## Architecture

```
contracts/          # Python intelligent contracts
tests/
  direct/           # Fast in-memory tests with web/LLM mocks
  integration/      # Full tests against GenLayer Studio
frontend/           # Next.js 15 app (TypeScript, TanStack Query, Radix UI)
deploy/             # TypeScript deployment scripts
```

**Frontend stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, TanStack Query, genlayer-js, MetaMask wallet integration.

## Development Workflow

1. Write/modify contract in `contracts/`
2. Lint: `genvm-lint check contracts/ai_arbitrator.py`
3. Test direct: `pytest tests/direct/ -v`
4. Start Studio and deploy: `genlayer deploy`
5. Test integration: `gltest tests/integration/ -v -s`
6. Run frontend: `cd frontend && npm run dev`

## Contract: AI Arbitrator

Dispute resolution contract where parties submit evidence and an AI judge evaluates the case.

**Flow**: create_dispute → submit_evidence → start_review → resolve_dispute (LLM judge)

**Key APIs**:
- `gl.nondet.exec_prompt(prompt, response_format="json")` — LLM judge evaluation
- `gl.message.sender_address.as_hex` — sender identification
- `TreeMap[u256, Dispute]` — on-chain dispute storage
- `DynArray[Evidence, 20]` — evidence per dispute

**Direct mode test mocks**:
```python
direct_vm.mock_llm(r".*impartial AI judge.*", json.dumps({"verdict": "PLAINTIFF_WINS", "explanation": "..."}))
```

## Frontend Components

- `components/Navbar.tsx` — Wallet connection UI
- `components/DisputesTable.tsx` — List of disputes with state icons
- `components/DisputeDetail.tsx` — View dispute, submit evidence, resolve
- `components/CreateDisputeModal.tsx` — Create new dispute form
- `components/HowItWorks.tsx` — Explanation of the dispute flow

**Contract interaction**: `lib/contracts/AIArbitrator.ts`
**React hooks**: `lib/hooks/useAIArbitrator.ts`
**Wallet**: `lib/genlayer/WalletProvider.tsx` + `client.ts`

## Environment Variables

```
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
NEXT_PUBLIC_GENLAYER_CHAIN_ID=61999
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed contract address>
```

## GenLayer Technical Reference

> **SDK API**: https://sdk.genlayer.com/main/_static/ai/api.txt

### LLM Access

```python
gl.nondet.exec_prompt(prompt: str, *, response_format: Literal['json']) -> dict
```

### Equivalence Principle

```python
result = gl.vm.run_nondet(leader_fn, validator_fn)
# or convenience:
result = gl.eq_principle.strict_eq()       # Exact match
result = gl.eq_principle.prompt_comparative()  # Similar outputs
```
