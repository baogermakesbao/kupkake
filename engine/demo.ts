/**
 * Quick demo of the recommendation engine.
 *
 *   npx tsx engine/demo.ts pancakeswap.finance /swap
 *   npx tsx engine/demo.ts app.venus.io /core-pool
 *   npx tsx engine/demo.ts four.meme /
 *
 * No LLM, no network, no tracking — the same deterministic rules the
 * Kupkake extension runs on every whitelisted page.
 */
import { recommend } from "./recommend";

const host = process.argv[2] ?? "pancakeswap.finance";
const path = process.argv[3] ?? "/swap";

const rec = recommend(host, path);

if (!rec) {
  console.log(`No rule matched for ${host}${path} — site not whitelisted or path has no scene.`);
  process.exit(0);
}

console.log(`scene   : ${rec.sceneLine}`);
console.log(`intent  : ${rec.intent}  (rule: ${rec.ruleId})`);
console.log(`agents  : (max 2, ranked by scene relevance — never raw volume)`);
for (const a of rec.agents) {
  console.log(`  • ${a.name} — ${a.summary}`);
  console.log(`    ${a.erc8004Id} · hireable: ${a.hireable} · categories: ${a.categories.join(", ")}`);
}
