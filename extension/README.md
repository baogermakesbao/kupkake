# Kupkake Chrome Extension

Scene distribution for the Kupkake BNB Chain agent marketplace.
On whitelisted trading sites it shows a 🧁 badge with at most 2 agent
recommendations matched by explainable rules (host + path → intent → category).

## Load unpacked (hackathon / dev)

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select this folder
4. Make sure the marketplace is running at `http://localhost:9800`
5. Visit pancakeswap.finance / venus.io / gmgn.ai / debot.ai / four.meme /
   dexscreener.com/bsc — the badge appears when a rule matches

## Architecture

- `config.js` — bundled fallback whitelist (first-run / offline)
- `background.js` — syncs live config from `/api/whitelist`, proxies `/api/recommend`
- `content.js` — matcher + badge + bar + drawer; SPA-aware (polls route changes)
- `content.css` — yolk & ink UI, isolated from host page styles

## Trust boundary

- No seed/private-key input exists
- Never auto-clicks or modifies the host page or calldata
- Recommends only on the public whitelist, max 2 per page
- Every card shows its matching rule ID
- Hiring happens on kupkake.fun in the user's own wallet

Point `ORIGIN` in `background.js` at `https://kupkake.fun` for production.
