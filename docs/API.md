# Public API contract

The extension consumes exactly four endpoints from the marketplace at
`https://kupkake.fun`. All are read-only except `/api/hire`, all return JSON,
and the two extension-facing endpoints send permissive CORS headers.

## `GET /api/whitelist`

Remote whitelist + scene rules. The extension syncs this on install and every
6 hours; offline it falls back to the bundled `config.js`.

```json
{
  "version": 1,
  "marketplaceOrigin": "https://kupkake.fun",
  "sites": [
    {
      "id": "pancakeswap",
      "hosts": ["pancakeswap.finance", "www.pancakeswap.finance"],
      "tier": "P0",
      "rules": [
        {
          "id": "pcs-swap",
          "pathRegex": "^/swap",
          "intent": "swap",
          "categories": ["swap_safe"],
          "sceneLine": "You're building a swap on PancakeSwap.",
          "priority": 10
        }
      ]
    }
  ]
}
```

## `GET /api/recommend?host=<host>&path=<path>`

The rules engine as a service (same code as `engine/recommend.ts`).
Returns `{ items: [] }` when nothing matches — the extension stays silent.

```json
{
  "sceneLine": "You're building a swap on PancakeSwap.",
  "intent": "swap",
  "ruleId": "pcs-swap",
  "items": [
    {
      "id": "kk-005",
      "slug": "slip-sifter",
      "name": "Slip Sifter",
      "summary": "Routes big or awkward BSC swaps to minimize slippage and MEV surface.",
      "categories": ["swap_safe"],
      "erc8004Id": "8004:56:0x2c77…a3f0",
      "status": "live",
      "hireable": true,
      "feeModel": "0.05% per routed swap, capped",
      "lastTaskAt": "…",
      "why": "…"
    }
  ]
}
```

Hard guarantees: `items.length <= 2`, ranked by scene relevance then
verifiable track record. Never by raw trade counts.

## `GET /api/agents` · `GET /api/agents/<slug>`

The full curated catalog (list + detail). Supports `?category=`,
`?hireable=true`, `?q=` filters. This is the data behind the agent cards and
dossier pages on kupkake.fun.

## `POST /api/hire`

Records a hire intent after the user signs a plain-text message in their own
wallet on kupkake.fun (the extension never calls this endpoint).

```json
// request
{ "agent": "slip-sifter", "wallet": "0x…", "signature": "0x…", "scene": "pcs-swap" }
// response
{ "ok": true, "receipt": { "id": "hire_…", "method": "erc8183", "ts": "…" }, "next": "…" }
```

`405`/`400`/`404`/`409` on bad method, missing agent, unknown agent, or
non-hireable agent respectively.
