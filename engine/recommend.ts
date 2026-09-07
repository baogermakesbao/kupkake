import { AGENTS } from "./agents";
import { WHITELIST } from "./whitelist";
import type { Agent, Intent, SceneRule } from "./types";

export interface Recommendation {
  sceneLine: string;
  intent: Intent;
  ruleId: string;
  host: string;
  agents: Agent[];
}

/** Rules engine V1 — no free-form LLM. host + path → intent → categories → rank. */
export function recommend(host: string, path: string): Recommendation | null {
  const h = host.replace(/^www\./, "").toLowerCase();
  const site = WHITELIST.find((s) => s.hosts.some((x) => x.replace(/^www\./, "") === h));
  if (!site) return null;

  const matched: SceneRule[] = site.rules
    .filter((r) => {
      try {
        return new RegExp(r.pathRegex, "i").test(path || "/");
      } catch {
        return false;
      }
    })
    .sort((a, b) => b.priority - a.priority);

  const rule = matched[0];
  if (!rule) return null;

  // rank: scene relevance > verifiable track record > recency. Never raw volume.
  const candidates = AGENTS.filter(
    (a) => a.status === "live" && a.hireable && a.categories.some((c) => rule.categories.includes(c))
  )
    .sort((a, b) => {
      const rel = b.relevance - a.relevance;
      if (rel !== 0) return rel;
      return b.trackRecord.length - a.trackRecord.length;
    })
    .slice(0, 2); // max 2 per page, always

  return {
    sceneLine: rule.sceneLine,
    intent: rule.intent,
    ruleId: rule.id,
    host: h,
    agents: candidates,
  };
}
