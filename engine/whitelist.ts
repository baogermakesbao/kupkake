import type { WhitelistSite } from "./types";

export const MARKETPLACE_ORIGIN = process.env.SITE_ORIGIN ?? "http://localhost:9800";

export const WHITELIST: WhitelistSite[] = [
  {
    id: "pancakeswap",
    name: "PancakeSwap",
    hosts: ["pancakeswap.finance", "www.pancakeswap.finance"],
    tier: "P0",
    rules: [
      {
        id: "pcs-lp",
        host: "pancakeswap.finance",
        pathRegex: "/(liquidity|positions|v3|add|remove)",
        intent: "lp_manage",
        categories: ["rebalance"],
        priority: 90,
        ui: "badge_and_bar",
        sceneLine: "You're managing PancakeSwap V3 liquidity.",
      },
      {
        id: "pcs-swap",
        host: "pancakeswap.finance",
        pathRegex: "/swap",
        intent: "swap",
        categories: ["swap_safe"],
        priority: 60,
        ui: "badge",
        sceneLine: "You're building a swap on PancakeSwap.",
      },
    ],
  },
  {
    id: "venus",
    name: "Venus",
    hosts: ["venus.io", "app.venus.io"],
    tier: "P0",
    rules: [
      {
        id: "venus-borrow",
        host: "venus.io",
        pathRegex: "/(account|borrow|dashboard|#)?",
        intent: "lend_risk",
        categories: ["hf", "yield"],
        priority: 100,
        ui: "badge_and_bar",
        sceneLine: "You have lending exposure on Venus.",
      },
    ],
  },
  {
    id: "lista",
    name: "Lista",
    hosts: ["lista.org", "app.lista.org"],
    tier: "P0",
    rules: [
      {
        id: "lista-stake",
        host: "lista.org",
        pathRegex: "/(stake|liquid|vault)?",
        intent: "stake_lst",
        categories: ["lst", "yield"],
        priority: 70,
        ui: "badge_and_bar",
        sceneLine: "You're staking BNB / managing LST on Lista.",
      },
      {
        id: "lista-cdp",
        host: "lista.org",
        pathRegex: "/(cdp|borrow)",
        intent: "lend_risk",
        categories: ["hf"],
        priority: 95,
        ui: "badge_and_bar",
        sceneLine: "You're managing a CDP on Lista.",
      },
    ],
  },
  {
    id: "debot",
    name: "debot.ai",
    hosts: ["debot.ai", "www.debot.ai"],
    tier: "P0",
    rules: [
      {
        id: "debot-track",
        host: "debot.ai",
        pathRegex: ".*",
        intent: "wallet_track",
        categories: ["smart_money", "meme_radar"],
        priority: 80,
        ui: "badge_and_bar",
        sceneLine: "You're tracking wallets and signals on debot.ai.",
      },
    ],
  },
  {
    id: "gmgn",
    name: "GMGN",
    hosts: ["gmgn.ai", "www.gmgn.ai"],
    tier: "P0",
    rules: [
      {
        id: "gmgn-meme",
        host: "gmgn.ai",
        pathRegex: ".*",
        intent: "wallet_track",
        categories: ["smart_money", "meme_radar"],
        priority: 80,
        ui: "badge_and_bar",
        sceneLine: "You're hunting momentum on GMGN.",
      },
    ],
  },
  {
    id: "fourmeme",
    name: "four.meme",
    hosts: ["four.meme", "www.four.meme"],
    tier: "P0",
    rules: [
      {
        id: "fourmeme-launch",
        host: "four.meme",
        pathRegex: ".*",
        intent: "meme_token",
        categories: ["meme_radar", "smart_money"],
        priority: 80,
        ui: "badge_and_bar",
        sceneLine: "You're watching launches on four.meme.",
      },
    ],
  },
  {
    id: "dexscreener",
    name: "DexScreener (BSC)",
    hosts: ["dexscreener.com", "www.dexscreener.com"],
    tier: "P0",
    rules: [
      {
        id: "dexs-bsc",
        host: "dexscreener.com",
        pathRegex: "/bsc",
        intent: "meme_token",
        categories: ["meme_radar", "grid"],
        priority: 75,
        ui: "badge",
        sceneLine: "You're scanning BSC pairs on DexScreener.",
      },
    ],
  },
  {
    id: "kupkake",
    name: "Kupkake Marketplace",
    hosts: ["localhost", "kupkake.fun", "www.kupkake.fun"],
    tier: "P0",
    rules: [
      {
        id: "kk-home",
        host: "kupkake.fun",
        pathRegex: ".*",
        intent: "portfolio",
        categories: ["portfolio"],
        priority: 10,
        ui: "badge",
        sceneLine: "You're browsing the Kupkake shelf.",
      },
    ],
  },
];

export const WHITELIST_CONFIG = {
  version: 1,
  marketplaceOrigin: MARKETPLACE_ORIGIN,
  domain: "kupkake.fun",
  sites: WHITELIST,
};
