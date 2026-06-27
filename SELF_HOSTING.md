# Self-Hosting on Cloudflare (no OpenAI builder)

This site is a Cloudflare Worker app (built with vinext). You deploy it yourself
with Wrangler — no OpenAI Sites builder, no Vercel. You own everything.

> **Heads up:** Don't deploy this to Vercel. Vercel runs `next build` and looks
> for a `.next` folder that this project never produces, which is the
> "output directory not found" error. This is a Cloudflare Worker, not a
> standard Next.js site.

You'll do the **one-time setup** once, then `npm run deploy` forever after.

---

## One-time setup

### 0. Prerequisites

- A free [Cloudflare account](https://dash.cloudflare.com/sign-up)
- Node.js installed, then in this folder: `npm install`
- Log Wrangler into your account:
  ```bash
  npx wrangler login
  ```

### 1. Create the database (D1)

```bash
npx wrangler d1 create johntemple-db
```

The database is already wired into **`wrangler.deploy.jsonc`** (`d1_databases[0].database_id`).
If you ever recreate it, paste the new `database_id` it prints into that field.
(A D1 `database_id` is an identifier, not a secret — it grants no access without
the account API token, which lives only in CI/Cloudflare secrets.)

### 2. Create the photo bucket (R2)

```bash
npx wrangler r2 bucket create johntemple-photos
```

(R2 requires enabling R2 once in the Cloudflare dashboard — it's free to start.
The bucket name must match `wrangler.deploy.jsonc`.)

### 3. Create the database table

```bash
npm run cf:migrate
```

This applies the migration in `drizzle/` to your live D1 database (creates the
`quote_requests` table that stores every lead).

### 4. Add the text-message secrets (so John gets a text)

Get these from a [Twilio](https://twilio.com) account (free trial works), then:

```bash
npx wrangler secret put TWILIO_ACCOUNT_SID
npx wrangler secret put TWILIO_AUTH_TOKEN
npx wrangler secret put TWILIO_FROM      # your Twilio number, e.g. +14095551000
npx wrangler secret put JOHN_PHONE       # John's cell, e.g. +14095550123
```

Each command prompts you to paste the value (it's stored encrypted, never in
the repo). Optional email copy: `RESEND_API_KEY`, `RESEND_FROM`, `JOHN_EMAIL`
(see `SMART_FORM_SETUP.md`).

### 5. Deploy

```bash
npm run deploy
```

You'll get a live `*.workers.dev` URL. Done.

---

## Every time after that

Just:

```bash
npm run deploy
```

That builds the site and pushes it live. Secrets and the database persist
between deploys — you don't redo setup.

If you change the database schema (`db/schema.ts`):

```bash
npm run db:generate   # writes a new migration into drizzle/
npm run cf:migrate    # applies it to the live database
npm run deploy
```

---

## Auto-deploy with GitHub Actions (optional but recommended)

`.github/workflows/deploy.yml` deploys to Cloudflare automatically on every push
to `main` (and via the "Run workflow" button). Do the one-time local setup above
first, then add two repository secrets so CI can authenticate.

### 1. Create a Cloudflare API token

Cloudflare dashboard → **My Profile → API Tokens → Create Token → Create Custom
Token**. Give it these permissions:

| Type | Resource | Access |
| --- | --- | --- |
| Account | Workers Scripts | Edit |
| Account | D1 | Edit |
| Account | Workers R2 Storage | Edit |

Copy the generated token.

### 2. Find your Account ID

Cloudflare dashboard → Workers & Pages → the **Account ID** shown on the right
(or run `npx wrangler whoami`).

### 3. Add them as GitHub repo secrets

GitHub repo → **Settings → Secrets and variables → Actions → New repository
secret**:

- `CLOUDFLARE_API_TOKEN` → the token from step 1
- `CLOUDFLARE_ACCOUNT_ID` → the id from step 2

That's it. Push to `main` and it deploys itself. Your Twilio secrets live on
Cloudflare (set once with `wrangler secret put`) and persist across deploys —
they are **not** needed in GitHub.

> The workflow runs `npm run cf:migrate` before deploying so schema changes ship
> automatically. It's safe to re-run (migrations are tracked and applied once).
> If `cf:migrate` ever errors on the migration format, you can apply the SQL
> directly instead:
> `npx wrangler d1 execute johntemple-db --remote --file=drizzle/<file>.sql`

## Custom domain (templepropertycare.com)

In the Cloudflare dashboard → Workers & Pages → your `johntemple` worker →
**Settings → Domains & Routes → Add Custom Domain**. Cloudflare handles the SSL
certificate automatically.

---

## How the pieces fit

| Piece | Cloudflare service | Where it's wired |
| --- | --- | --- |
| The website + form + API | Worker | `wrangler.deploy.jsonc` `main` → built `dist/server` |
| Lead records | D1 database (`DB`) | `db/schema.ts`, `app/api/quote/route.ts` |
| Uploaded photos | R2 bucket (`R2`) | `app/api/quote`, served at `/uploads/...` |
| Text to John | Twilio (via secrets) | `lib/notify.ts` |
| Abuse protection | Workers Rate Limiting + honeypot | `wrangler.deploy.jsonc` `ratelimits`, `app/api/quote` |

> The rate limiter needs **no setup** — `namespace_id` is an arbitrary value you
> pick (Cloudflare creates the counters on first use), so it deploys as-is.

## Why `npm run deploy` has an extra step

`vinext build` writes a `.wrangler/deploy/config.json` that redirects Wrangler to
an auto-generated config meant for the OpenAI platform (it carries a placeholder
database id). `scripts/predeploy.mjs` removes that redirect so Wrangler uses
**your** `wrangler.deploy.jsonc` with your real database and bucket. That's the only
moving part — everything else is standard Wrangler.
