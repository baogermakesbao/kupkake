import type { Agent } from "./types";

/**
 * Sample of the curated shelf (4 of 12 agents) so the engine runs standalone —
 * one per flagship scene: LP rebalancing, health factor, swap routing, meme radar.
 * The full live catalog is served by https://kupkake.fun/api/agents.
 *
 * Every agent listed as hireable has a working activation path (ERC-8183 hire
 * or a documented Studio endpoint). Curated by hand — an 8004 registry entry
 * alone does not put you on this shelf.
 */
export const AGENTS: Agent[] = [
  {
    id: "kk-001",
    slug: "batch-baker",
    name: "Batch Baker",
    summary: "Re-centers your PancakeSwap V3 ranges before they go stale.",
    description:
      "Batch Baker watches your concentrated-liquidity positions on PancakeSwap V3 (BSC). When price drifts toward the edge of your range, it computes a new range from realized volatility and pool fee tier, then either alerts you or — with a bounded session — executes the rebalance itself. It reports every move with the pool state before and after, so you can audit each decision.",
    categories: ["rebalance"],
    chainId: 56,
    erc8004Id: "8004:56:0x1f2a…9c41",
    agentUri: "ipfs://bafk…batchbaker",
    hireMethod: "erc8183",
    feeModel: "0.5 USDT per executed rebalance · alerts free",
    permissions: [
      "Read your V3 position NFTs (public data)",
      "Optional: session key limited to increase/decrease liquidity on approved pools",
      "Hard cap: max 2 rebalances per pool per day",
    ],
    notDo: [
      "Never withdraws to any address but yours",
      "Never touches pools you did not approve",
      "No leverage, no borrowing on your behalf",
    ],
    scenes: [
      { host: "pancakeswap.finance", note: "Recommended on /liquidity and /positions pages" },
    ],
    status: "live",
    hireable: true,
    lastTaskAt: "6 min ago",
    metrics: [
      { label: "Ranges managed", value: "312" },
      { label: "Median time in range", value: "91%" },
      { label: "Avg fee uplift vs static", value: "+34%" },
      { label: "Failed txs (30d)", value: "0" },
    ],
    trackRecord: [
      { ts: "2026-09-07 14:02", task: "WBNB/USDT 0.05% re-center", result: "in-range, +0.8% fee APR" },
      { ts: "2026-09-07 09:41", task: "CAKE/WBNB drift alert", result: "user deferred, position tagged" },
      { ts: "2026-09-06 22:15", task: "ETH/WBNB 0.25% re-center", result: "in-range, gas 0.11 USD" },
    ],
    advantage: {
      task: "Keep a WBNB/USDT V3 position in range for one week",
      manual: { time: "≈ 25 min/day watching charts", cost: "3 missed re-centers, ~38% time out of range", quality: "range set by gut feel" },
      agent: { time: "0 min — 4 auto re-centers", cost: "2 USDT fees + gas", quality: "91% time in range, every move logged" },
      verdict: "The agent's fee uplift paid for itself 6× over the week.",
    },
    relevance: 98,
  },,
  {
    id: "kk-004",
    slug: "crust-guard",
    name: "Crust Guard",
    summary: "Health-factor sentry for Venus & Lista loans. Warns early, acts if you let it.",
    description:
      "Crust Guard monitors your lending health factor around the clock. It models how far price must move to liquidate you, alerts on your channels at the thresholds you pick, and — only with an explicit bounded session — can execute a pre-agreed defense: partial repay from a designated buffer wallet or collateral top-up. Every possible action is spelled out at hire time; nothing is improvised.",
    categories: ["hf", "portfolio"],
    chainId: 56,
    erc8004Id: "8004:56:0x9d10…be55",
    agentUri: "ipfs://bafk…crustguard",
    hireMethod: "erc8183",
    feeModel: "1 USDT / month per monitored account · defense actions 0.2 USDT each",
    permissions: [
      "Read your lending account (public data)",
      "Optional session: repay/top-up only, only from your designated buffer",
      "Alert thresholds and channels you configure",
    ],
    notDo: ["Never opens new borrow positions", "Never sells collateral without a pre-agreed rule", "No access beyond the buffer allowance"],
    scenes: [
      { host: "venus.io", note: "Recommended on account/borrow dashboards" },
      { host: "lista.org", note: "Recommended on CDP pages" },
    ],
    status: "live",
    hireable: true,
    lastTaskAt: "2 min ago",
    metrics: [
      { label: "Accounts guarded", value: "203" },
      { label: "Liquidations prevented", value: "17" },
      { label: "Median alert lead time", value: "3h 40m" },
      { label: "False alarms (30d)", value: "2" },
    ],
    trackRecord: [
      { ts: "2026-09-07 14:06", task: "HF sweep, 203 accounts", result: "all above threshold" },
      { ts: "2026-09-04 03:22", task: "BNB drawdown defense", result: "partial repay, HF 1.08 → 1.41" },
    ],
    advantage: {
      task: "Survive a 20% BNB drawdown with an open Venus borrow",
      manual: { time: "you were asleep", cost: "liquidation penalty ~ 5% of collateral", quality: "position lost" },
      agent: { time: "acted at 03:22", cost: "0.2 USDT + gas", quality: "HF restored to 1.41, position intact" },
      verdict: "One prevented liquidation pays for decades of the fee.",
    },
    relevance: 97,
  },,
  {
    id: "kk-005",
    slug: "slip-sifter",
    name: "Slip Sifter",
    summary: "Routes big or awkward BSC swaps to minimize slippage and MEV surface.",
    description:
      "Slip Sifter quotes your swap across aggregators and direct pools, splits size when it helps, and explains the chosen route in plain language before you sign. For large orders it proposes time-sliced execution. You always sign in your own wallet — the agent only builds and explains routes.",
    categories: ["swap_safe"],
    chainId: 56,
    erc8004Id: "8004:56:0x2c77…a3f0",
    agentUri: "ipfs://bafk…slipsifter",
    hireMethod: "studio",
    feeModel: "Free under 1k USD notional · 0.05% above",
    permissions: ["Builds unsigned transactions only", "You sign everything in your own wallet"],
    notDo: ["Never holds funds", "Never signs", "No private-pool kickbacks — route math is shown"],
    scenes: [{ host: "pancakeswap.finance", note: "Recommended on /swap" }],
    status: "live",
    hireable: true,
    lastTaskAt: "11 min ago",
    metrics: [
      { label: "Swaps routed", value: "1,204" },
      { label: "Avg saving vs naive route", value: "0.42%" },
      { label: "Sandwiches eaten", value: "0" },
    ],
    trackRecord: [
      { ts: "2026-09-07 13:58", task: "18k USDT → WBNB", result: "3-way split, 0.31% saved" },
    ],
    relevance: 88,
  },,
  {
    id: "kk-006",
    slug: "oven-radar",
    name: "Oven Radar",
    summary: "Watches four.meme and BSC launches so you don't have to refresh.",
    description:
      "Oven Radar streams new launches and momentum shifts on four.meme, GMGN and DexScreener BSC pairs. It filters by your rules — deployer age, liquidity, holder curve, socials — and pings you with a structured card, not a hype message. It is a radar, not a rug checker, and it never claims a token is 'safe'.",
    categories: ["meme_radar", "smart_money"],
    chainId: 56,
    erc8004Id: "8004:56:0x66e1…0b19",
    agentUri: "ipfs://bafk…ovenradar",
    hireMethod: "studio",
    feeModel: "2 USDT / month streaming",
    permissions: ["Read-only market data", "Alert channels you configure"],
    notDo: ["No safety verdicts — filters are shown as rules", "No auto-buying", "No paid token placements, ever"],
    scenes: [
      { host: "four.meme", note: "Recommended on launch and token pages" },
      { host: "gmgn.ai", note: "Recommended on BSC discovery feeds" },
      { host: "dexscreener.com", note: "Recommended on new BSC pairs" },
    ],
    status: "live",
    hireable: true,
    lastTaskAt: "just now",
    metrics: [
      { label: "Launches screened (30d)", value: "9,412" },
      { label: "Passed user filters", value: "3.1%" },
      { label: "Median alert latency", value: "9s" },
    ],
    trackRecord: [
      { ts: "2026-09-07 14:07", task: "four.meme new pair scan", result: "2 matches pushed" },
    ],
    advantage: {
      task: "Catch fresh BSC launches matching a liquidity + deployer filter for 24h",
      manual: { time: "screen-glued ~ 6h, slept the rest", cost: "missed 14 of 19 matches", quality: "found 5, late on 3" },
      agent: { time: "0 min", cost: "2 USDT/mo", quality: "19/19 matches, median 9s latency" },
      verdict: "Radar coverage humans can't match — with rules you can read.",
    },
    relevance: 90,
  },
];

export const bySlug = (slug: string) => AGENTS.find((a) => a.slug === slug);
export const hireableAgents = () => AGENTS.filter((a) => a.hireable && a.status === "live");
