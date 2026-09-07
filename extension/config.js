/**
 * Kupkake extension — bundled fallback config.
 * The live copy is fetched from MARKETPLACE_ORIGIN/api/whitelist by the
 * background worker and cached in chrome.storage; this file only guarantees
 * the extension works on first run / offline.
 */
const KK_DEFAULTS = {
  marketplaceOrigin: "https://kupkake.fun",
  sites: [
    {
      id: "pancakeswap",
      hosts: ["pancakeswap.finance", "www.pancakeswap.finance"],
      rules: [
        { id: "pcs-lp", pathRegex: "/(liquidity|positions|v3|add|remove)", intent: "lp_manage", ui: "badge_and_bar", sceneLine: "You're managing PancakeSwap V3 liquidity." },
        { id: "pcs-swap", pathRegex: "/swap", intent: "swap", ui: "badge", sceneLine: "You're building a swap on PancakeSwap." }
      ]
    },
    {
      id: "venus",
      hosts: ["venus.io", "app.venus.io"],
      rules: [
        { id: "venus-borrow", pathRegex: ".*", intent: "lend_risk", ui: "badge_and_bar", sceneLine: "You have lending exposure on Venus." }
      ]
    },
    {
      id: "lista",
      hosts: ["lista.org", "app.lista.org"],
      rules: [
        { id: "lista-stake", pathRegex: ".*", intent: "stake_lst", ui: "badge_and_bar", sceneLine: "You're staking BNB / managing LST on Lista." }
      ]
    },
    {
      id: "debot",
      hosts: ["debot.ai", "www.debot.ai"],
      rules: [
        { id: "debot-track", pathRegex: ".*", intent: "wallet_track", ui: "badge_and_bar", sceneLine: "You're tracking wallets and signals on debot.ai." }
      ]
    },
    {
      id: "gmgn",
      hosts: ["gmgn.ai", "www.gmgn.ai"],
      rules: [
        { id: "gmgn-meme", pathRegex: ".*", intent: "wallet_track", ui: "badge_and_bar", sceneLine: "You're hunting momentum on GMGN." }
      ]
    },
    {
      id: "fourmeme",
      hosts: ["four.meme", "www.four.meme"],
      rules: [
        { id: "fourmeme-launch", pathRegex: ".*", intent: "meme_token", ui: "badge_and_bar", sceneLine: "You're watching launches on four.meme." }
      ]
    },
    {
      id: "dexscreener",
      hosts: ["dexscreener.com", "www.dexscreener.com"],
      rules: [
        { id: "dexs-bsc", pathRegex: "/bsc", intent: "meme_token", ui: "badge", sceneLine: "You're scanning BSC pairs on DexScreener." }
      ]
    }
  ]
};
