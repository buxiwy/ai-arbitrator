# Demo Script — AI Arbitrator

## 录屏准备

1. 打开GenLayer Studio，部署合约
2. 打开前端 `localhost:3000`
3. 准备MetaMask，确保连到GenLayer网络
4. 准备两个钱包地址（测试用）

---

## 开场白（15秒）

"Hi, I'm Joestar. Today I'm presenting AI Arbitrator — a decentralized dispute resolution system powered by AI judges on GenLayer."

---

## 问题陈述（20秒）

"Traditional dispute resolution is broken. It costs over 50 billion dollars a year globally. Average court case takes 12+ months. And human judges can be biased.

What if we could replace that with an AI that reads all the evidence, understands the context, and delivers a fair verdict — in minutes?"

---

## 产品演示（60秒）

### 步骤1：创建争议（15秒）
"Let me show you how it works. I'm connecting my wallet to the frontend."

[点击 Connect Wallet，连接MetaMask]

"Now I'll file a dispute against another party."

[点击 New Dispute，填写表单]
- Defendant: 输入测试地址
- Title: "Service not delivered"
- Description: "I paid 500 USDC for a website redesign. The developer never delivered the work."

[点击 Create Dispute]

"Done. The dispute is now on-chain."

### 步骤2：提交证据（15秒）
"As the plaintiff, I can submit evidence to support my case."

[选择 evidence type: text]
[输入: "Payment receipt showing 500 USDC transfer on June 15th"]

[点击 Submit Evidence]

"Now the defendant can also submit their evidence — maybe a screenshot of partial work, or a chat log."

### 步骤3：AI判决（20秒）
"Once both parties submit evidence, the plaintiff starts the AI review."

[点击 Start AI Review]

"Now the AI judge — powered by GenLayer's non-deterministic LLM execution — evaluates all the evidence."

[点击 Resolve Dispute]

"The AI reads everything. It considers the payment proof, the missing delivery, the contract terms. And it renders a verdict."

[展示verdict: PLAINTIFF_WINS]
[展示explanation]

"PLAINTIFF_WINS. The evidence clearly shows payment was made but work was never delivered. The verdict is fair, transparent, and enforced by the smart contract."

### 步骤4：技术亮点（10秒）
"What makes this special:

1. The AI judge is non-deterministic — each validator runs the same prompt independently
2. Optimistic Democracy consensus ensures the verdict is verified by multiple nodes
3. All evidence and reasoning is on-chain — fully transparent and immutable"

---

## 技术架构（20秒）

"The contract is written in Python using GenLayer's Intelligent Contract SDK.

Key function: `gl.nondet.exec_prompt()` — this gives the smart contract access to an LLM. The AI reads the evidence, understands context, and returns a structured verdict.

The frontend is built with Next.js 15, React 19, and TypeScript. It connects to the contract via genlayer-js SDK and MetaMask."

---

## 结尾（15秒）

"AI Arbitrator: Evidence in, verdict out. No lawyers. No courts. No bias. Just fair, fast, on-chain justice.

Built for the GenLayer Agent Tank hackathon. Onchain Justice track. Thank you."

---

## 录制技巧

- 语速适中，不要太快
- 每个操作前停顿1秒，让观众看清
- 鼠标移动要稳，不要乱晃
- 如果出错，重新录那段，不用从头来
- 总时长控制在2-3分钟

## 需要提前准备的

1. 测试地址（可以用 `0xAABBCCDD00112233445566778899001122334455` 这种）
2. MetaMask装好GenLayer网络
3. 合约已部署，前端已启动
4. 关掉电脑通知，避免弹窗干扰录屏
