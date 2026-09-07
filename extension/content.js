/**
 * Kupkake content script.
 * Footprint: reads location.host + pathname, matches public rules,
 * renders a badge and (on high-intent pages) a dismissible bar + drawer.
 * It never touches the host page's buttons, forms, wallet or calldata.
 */
(() => {
  if (window.__kupkakeLoaded) return;
  window.__kupkakeLoaded = true;

  const host = location.host.replace(/^www\./, "");
  let sessionMuted = false;
  let ui = null;

  function matchRule(config, path) {
    const sites = (config && config.sites) || KK_DEFAULTS.sites;
    const site = sites.find((s) => (s.hosts || []).some((h) => h.replace(/^www\./, "") === host));
    if (!site) return null;
    const rules = (site.rules || [])
      .filter((r) => {
        try { return new RegExp(r.pathRegex, "i").test(path || "/"); } catch { return false; }
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    return rules[0] || null;
  }

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function render(rule, rec, origin) {
    destroy();
    if (!rec || !rec.items || rec.items.length === 0) return;

    ui = el("div", "kk-root");

    // ---- badge ----
    const badge = el("button", "kk-badge", `🧁 <b>${rec.items.length}</b>`);
    badge.title = "Kupkake: agents available for this page";
    badge.addEventListener("click", () => drawer.classList.toggle("kk-open"));
    ui.appendChild(badge);

    // ---- high-intent bar ----
    if (rule.ui === "badge_and_bar" && !sessionMuted) {
      const bar = el(
        "div",
        "kk-bar",
        `<span>🧁 ${esc(rec.sceneLine)} <b>${rec.items.length} agent${rec.items.length > 1 ? "s" : ""}</b> can help.</span>`
      );
      const open = el("button", "kk-bar-btn", "Show");
      open.addEventListener("click", () => {
        drawer.classList.add("kk-open");
        bar.remove();
      });
      const close = el("button", "kk-bar-x", "✕");
      close.title = "Hide for this session on this site";
      close.addEventListener("click", () => {
        sessionMuted = true;
        bar.remove();
      });
      bar.appendChild(open);
      bar.appendChild(close);
      ui.appendChild(bar);
    }

    // ---- drawer ----
    const drawer = el("aside", "kk-drawer");
    const cards = rec.items
      .map(
        (a) => `
      <div class="kk-card">
        <div class="kk-card-head"><b>${esc(a.name)}</b><span class="kk-live">● live</span></div>
        <p class="kk-sum">${esc(a.summary)}</p>
        <p class="kk-meta">rule ${esc(rec.ruleId)} · ${esc(rec.intent)} · ${esc(a.erc8004Id)}</p>
        <a class="kk-cta" target="_blank" rel="noreferrer"
           href="${origin}/agents/${encodeURIComponent(a.slug)}?from=ext&host=${encodeURIComponent(host)}&intent=${encodeURIComponent(rec.intent)}">
           View & hire →</a>
      </div>`
      )
      .join("");

    drawer.innerHTML = `
      <div class="kk-drawer-head">
        <span class="kk-brand">🧁 KUPKAKE</span>
        <button class="kk-x">✕</button>
      </div>
      <p class="kk-scene">${esc(rec.sceneLine)}</p>
      ${cards}
      <p class="kk-foot">≤2 recs · explainable rules · never touches this page or your wallet · hiring happens on <b>kupkake.fun</b></p>`;
    drawer.querySelector(".kk-x").addEventListener("click", () => drawer.classList.remove("kk-open"));
    ui.appendChild(drawer);

    document.documentElement.appendChild(ui);
  }

  function destroy() {
    if (ui) {
      ui.remove();
      ui = null;
    }
  }

  let lastKey = "";
  function tick() {
    const path = location.pathname + location.hash;
    chrome.runtime.sendMessage({ type: "kk-config" }, (cfgRes) => {
      if (chrome.runtime.lastError) return;
      const config = (cfgRes && cfgRes.config) || KK_DEFAULTS;
      const rule = matchRule(config, path);
      const key = rule ? rule.id + "|" + path : "none";
      if (key === lastKey) return;
      lastKey = key;
      if (!rule) return destroy();
      chrome.runtime.sendMessage({ type: "kk-recommend", host, path }, (res) => {
        if (chrome.runtime.lastError || !res || !res.ok) return;
        render(rule, res.data, res.origin || KK_DEFAULTS.marketplaceOrigin);
      });
    });
  }

  tick();
  // SPA navigation watcher — hosts like PCS/GMGN are client-routed
  setInterval(tick, 1500);
})();
