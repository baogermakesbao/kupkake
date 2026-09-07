export type CategoryCode =
  | "rebalance"
  | "grid"
  | "yield"
  | "hf"
  | "swap_safe"
  | "meme_radar"
  | "smart_money"
  | "bridge_route"
  | "perps_risk"
  | "portfolio"
  | "lst";

export type Intent =
  | "lp_manage"
  | "swap"
  | "lend_risk"
  | "stake_lst"
  | "farm_vault"
  | "meme_token"
  | "wallet_track"
  | "bridge"
  | "perps"
  | "portfolio";

export interface Category {
  code: CategoryCode;
  name: string;
  tagline: string;
  userIntent: string;
  main: boolean; // one of the 4 hackathon main-track categories
  emoji: string;
  intents: Intent[];
}

export interface AdvantageTask {
  task: string;
  manual: { time: string; cost: string; quality: string };
  agent: { time: string; cost: string; quality: string };
  verdict: string;
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  categories: CategoryCode[];
  chainId: 56;
  erc8004Id: string;
  agentUri: string;
  hireMethod: "erc8183" | "studio" | "http";
  feeModel: string;
  permissions: string[];
  notDo: string[];
  scenes: { host: string; note: string }[];
  status: "live" | "down" | "draft";
  hireable: boolean;
  lastTaskAt: string;
  metrics: { label: string; value: string }[];
  trackRecord: { ts: string; task: string; result: string }[];
  advantage?: AdvantageTask;
  relevance: number; // curated scene-relevance score, NOT trade volume
}

export interface SceneRule {
  id: string;
  host: string;
  pathRegex: string;
  intent: Intent;
  categories: CategoryCode[];
  priority: number;
  ui: "badge" | "badge_and_bar";
  sceneLine: string;
}

export interface WhitelistSite {
  id: string;
  name: string;
  hosts: string[];
  tier: "P0" | "P1" | "P2";
  rules: SceneRule[];
}
