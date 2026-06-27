# Smart Form — Go-Live Setup

The quote form on the home page is fully built. It captures every lead, stores
it, uploads photos, and **texts John** the moment someone submits. To make the
text actually send in production, set the secrets below.

Until they're set, nothing breaks: the customer still sees the confirmation
screen, the lead is still saved to the database (once migrations are applied),
and the full lead is written to the server logs as a fallback so it's never
lost.

## 1. Text John via Twilio (the priority channel)

Create a free Twilio account, get a phone number, then set these as project
secrets/environment variables on the hosting platform:

| Secret | Example | What it is |
| --- | --- | --- |
| `TWILIO_ACCOUNT_SID` | `ACxxxxxxxx...` | From the Twilio console |
| `TWILIO_AUTH_TOKEN` | `xxxxxxxx...` | From the Twilio console |
| `TWILIO_FROM` | `+14095551000` | Your Twilio number (E.164 format) |
| `JOHN_PHONE` | `+14095550123` | John's cell — where the texts go (E.164) |

When all four are set:
- **John** gets a text with the name, phone, address, services, preferred day,
  notes, and links to any uploaded photos.
- **The customer** gets a friendly confirmation text automatically.

## 2. Photos (Cloudflare R2) — already enabled

`.openai/hosting.json` declares the `R2` binding. The platform provisions the
bucket on deploy. Uploaded photos are served back at `/uploads/...` and those
links are included in John's text. No action needed beyond deploying.

## 3. Lead database (Cloudflare D1) — already enabled

`.openai/hosting.json` declares the `DB` binding and the migration is already
generated in `drizzle/`. The platform applies it on deploy. After that, every
submission is also stored in the `quote_requests` table as a durable record.

> Local note: `npm run dev` simulates D1/R2 but doesn't auto-apply migrations,
> so locally the insert is skipped and the lead is logged instead. This is
> expected — production applies the migration automatically.

## 4. Optional — email copy via Resend

If you also want John (or an office inbox) to get an email record, set:

| Secret | Example |
| --- | --- |
| `RESEND_API_KEY` | `re_xxxx...` |
| `RESEND_FROM` | `Temple Property Care <quotes@templepropertycare.com>` |
| `JOHN_EMAIL` | `john@...` |

This is independent of the SMS path and entirely optional.
