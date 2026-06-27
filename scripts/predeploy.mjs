// Runs after `vinext build`, before `wrangler deploy`.
//
// vinext writes `.wrangler/deploy/config.json`, which redirects wrangler to its
// own generated `dist/server/wrangler.json` (built for the OpenAI Sites
// platform, with a placeholder D1 id). For self-hosting we want wrangler to use
// our own root `wrangler.jsonc` instead, so we remove the redirect here.
import { rmSync } from "node:fs";

rmSync(".wrangler/deploy/config.json", { force: true });
console.log("[predeploy] removed vinext config redirect; using ./wrangler.jsonc");
