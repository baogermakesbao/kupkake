# Security model

Kupkake's extension runs on financial pages, so the trust boundary is the
product. This document is the complete list of what the code does — and a
longer list of what it will never do. Every claim below is verifiable in this
repository; the extension has no build step and ships exactly these files.

## What the extension reads

- `location.host` and `location.pathname` of the current tab, **only** on
  sites present in the whitelist.
- Nothing else. No DOM scraping, no form reading, no keystrokes, no wallet
  provider access, no cookies, no analytics.

## What the extension writes

- Its own badge/drawer UI, injected as an isolated container with
  namespaced (`kk-`) styles.
- A cached copy of the remote whitelist in `chrome.storage.local`.

## Permissions requested (`manifest.json`)

| Permission | Why |
|---|---|
| `storage` | cache the whitelist config |
| `host_permissions` for kupkake.fun + localhost | fetch whitelist & recommendations |
| content-script matches: the whitelisted DeFi sites | render the badge |

No `tabs`, no `webRequest`, no `scripting`, no `cookies`, no `<all_urls>`.

## Hard "never" list

1. **Never touches private keys.** There is no wallet code in the extension.
2. **Never signs or submits transactions.** Hiring happens on kupkake.fun in
   the user's own wallet, after a permission summary, via a plain-text
   `personal_sign` — and even that is site-side, not extension-side.
3. **Never simulates clicks or automates the host page.** The extension
   cannot act on PancakeSwap/Venus/etc. on the user's behalf.
4. **Never recommends on unknown sites.** Off-whitelist → inert. The
   whitelist is remote-syncable but validated against the same schema, and
   the bundled fallback ships in this repo.
5. **Never uses an LLM to pick recommendations.** The rules engine is ~50
   lines of deterministic TypeScript (`engine/recommend.ts`); every
   recommendation displays the rule that fired.
6. **Never ranks by raw volume.** Trade counts are farmable; scene relevance
   and verifiable track record are not.
7. **Never phones home.** The only network calls are `GET /api/whitelist`
   and `GET /api/recommend` to kupkake.fun (or localhost in dev). No
   telemetry, no user identifiers, no page-view logging.

## Anti-phishing note

The real extension only ever links to `kupkake.fun` (or localhost in dev
mode). If a fork of this code links anywhere else, treat it as hostile.

## Reporting

Found an issue? Open a GitHub issue or DM
[@Kupkake_bsc](https://x.com/Kupkake_bsc).
