/**
 * Kupkake background worker.
 * Jobs: (1) sync remote whitelist config, (2) proxy recommendation fetches
 * for content scripts (avoids mixed-content limits), (3) nothing else.
 * It has no access to wallets, keys or page transactions — by design.
 */
// Tries production first, falls back to local dev — the same build works for both.
const ORIGINS = ["https://kupkake.fun", "http://localhost:9800"];
let activeOrigin = ORIGINS[0];

async function pickOrigin() {
  for (const o of ORIGINS) {
    try {
      const res = await fetch(`${o}/api/whitelist`, { cache: "no-store" });
      if (res.ok) {
        activeOrigin = o;
        return res;
      }
    } catch (_) {
      /* try next */
    }
  }
  return null;
}

async function syncConfig() {
  const res = await pickOrigin();
  if (!res) return; // offline — bundled defaults keep working
  try {
    const cfg = await res.json();
    await chrome.storage.local.set({ kkConfig: cfg, kkConfigTs: Date.now(), kkOrigin: activeOrigin });
  } catch (_) {}
}

chrome.runtime.onInstalled.addListener(syncConfig);
chrome.runtime.onStartup.addListener(syncConfig);

async function fetchRecommend(host, path) {
  const url = (o) => `${o}/api/recommend?host=${encodeURIComponent(host)}&path=${encodeURIComponent(path)}`;
  try {
    const r = await fetch(url(activeOrigin));
    if (r.ok) return r.json();
  } catch (_) {}
  // active origin failed — re-pick and retry once
  await pickOrigin();
  const r2 = await fetch(url(activeOrigin));
  return r2.json();
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "kk-recommend") {
    fetchRecommend(msg.host, msg.path)
      .then((data) => sendResponse({ ok: true, data, origin: activeOrigin }))
      .catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true; // async
  }
  if (msg?.type === "kk-config") {
    chrome.storage.local.get(["kkConfig", "kkOrigin"]).then(({ kkConfig, kkOrigin }) => {
      if (kkOrigin) activeOrigin = kkOrigin;
      sendResponse({ ok: true, config: kkConfig || null, origin: activeOrigin });
    });
    return true;
  }
});
