# AI Arbitrator

Decentralized dispute resolution powered by AI judges on GenLayer blockchain.

## What it does

Two parties have a dispute. They submit evidence on-chain. An AI judge evaluates the evidence impartially and delivers a fair verdict — all enforced by smart contract consensus.

## How it works

1. **File a Dispute** — Plaintiff creates a dispute against a defendant with title and description
2. **Submit Evidence** — Both parties submit evidence (text, URLs, images, documents)
3. **AI Review** — The AI judge evaluates all evidence using GenLayer's non-deterministic LLM execution
4. **Verdict Delivered** — A fair verdict is reached through Optimistic Democracy consensus

## Tech stack

- **Contract**: Python Intelligent Contract (GenLayer SDK)
- **AI Judge**: `gl.nondet.exec_prompt()` — non-deterministic LLM calls for impartial evaluation
- **Consensus**: Optimistic Democracy — validators verify the AI's reasoning
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, TanStack Query
- **Wallet**: MetaMask via genlayer-js SDK

## Contract functions

| Function | Description |
|----------|-------------|
| `create_dispute(defendant, title, description)` | File a new dispute |
| `submit_evidence(dispute_id, evidence_type, data)` | Submit evidence to a dispute |
| `start_review(dispute_id)` | Plaintiff initiates AI review |
| `resolve_dispute(dispute_id)` | AI judge evaluates and delivers verdict |
| `get_dispute(dispute_id)` | View dispute details |
| `get_dispute_count()` | Total number of disputes |

## Verdict types

- `PLAINTIFF_WINS` — Evidence favors the plaintiff
- `DEFENDANT_WINS` — Evidence favors the defendant
- `SPLIT` — Both parties have valid points
- `DISMISSED` — Insufficient evidence

## Quick start

```bash
# Install dependencies
pip install -r requirements.txt
cd frontend && npm install

# Run tests
pytest tests/direct/ -v

# Start frontend
cd frontend && npm run dev
```

## Project structure

```
ai-arbitrator/
├── contracts/
│   └── ai_arbitrator.py      # Main contract
├── tests/
│   ├── direct/               # Fast mock tests
│   │   ├── test_ai_arbitrator.py
│   │   └── conftest.py
│   └── integration/          # GenLayer Studio tests
├── frontend/
│   ├── app/                  # Next.js pages
│   ├── components/           # React components
│   │   ├── Navbar.tsx
│   │   ├── DisputesTable.tsx
│   │   ├── DisputeDetail.tsx
│   │   ├── CreateDisputeModal.tsx
│   │   └── HowItWorks.tsx
│   └── lib/
│       ├── contracts/        # Contract client
│       ├── hooks/            # React hooks
│       └── genlayer/         # Wallet & config
└── CLAUDE.md                 # Developer docs
```

## Why this matters

Traditional dispute resolution is slow, expensive, and biased. AI Arbitrator provides:

- **Speed** — Verdicts in minutes, not months
- **Cost** — No lawyers, no courts
- **Impartiality** — AI judge has no skin in the game
- **Transparency** — All evidence and reasoning on-chain
- **Decentralization** — No single point of failure

## Track

**Onchain Justice** — Agent-to-agent dispute resolution

## Author

Joestar ([@buxiwy](https://github.com/buxiwy))

## License

MIT
