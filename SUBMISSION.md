# AI Arbitrator — Hackathon Submission

## One-liner
AI-powered dispute resolution on GenLayer — evidence in, verdict out.

## Track
Onchain Justice

## Problem
Global dispute resolution costs $50B+/year. Average case takes 12+ months. Human judges can be biased.

## Solution
A decentralized platform where AI judges evaluate evidence and deliver fair verdicts on-chain. No lawyers, no courts, no bias.

## How it works
1. Plaintiff files a dispute with title and description
2. Both parties submit evidence (text, URLs, images, documents)
3. AI judge evaluates evidence using GenLayer's `gl.nondet.exec_prompt()`
4. Verdict delivered via Optimistic Democracy consensus

## Tech stack
- **Contract**: Python Intelligent Contract (GenLayer SDK)
- **AI Judge**: `gl.nondet.exec_prompt()` — non-deterministic LLM calls
- **Consensus**: Optimistic Democracy — validator verification
- **Frontend**: Next.js 15, React 19, TypeScript, TanStack Query
- **Wallet**: MetaMask via genlayer-js

## Key features
- Non-deterministic AI evaluation (each validator runs independently)
- Structured JSON verdicts (PLAINTIFF_WINS / DEFENDANT_WINS / SPLIT / DISMISSED)
- Full evidence tracking on-chain with type formatting (text/URL/image/document)
- Address validation + duplicate prevention
- 7-day deadline with timeout auto-judgment
- Per-wallet dispute tracking
- On-chain statistics dashboard
- MetaMask wallet integration
- Responsive dark-mode UI

## Contract
- Address: `0xFF693B73f863eC7527859ddc3471B02865207D64`
- Network: GenLayer Studio

## Why GenLayer?
GenLayer's Intelligent Contracts natively access LLMs. This lets the smart contract itself become the judge — reading evidence, understanding context, and rendering verdicts without oracles or off-chain computation.

## Links
- GitHub: github.com/buxiwy/ai-arbitrator
- Author: Joestar (@buxiwy)
