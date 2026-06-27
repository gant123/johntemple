import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { quoteRequests } from "@/db/schema";
import { sendQuoteNotifications, type QuotePayload } from "@/lib/notify";

export const dynamic = "force-dynamic";

const MAX_FILES = 6;
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB each
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/gif",
]);

type RateLimiter = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

type Bindings = {
  R2?: R2Bucket;
  QUOTE_RATE_LIMITER?: RateLimiter;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM?: string;
  JOHN_PHONE?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  JOHN_EMAIL?: string;
};

function bindings(): Bindings {
  return env as unknown as Bindings;
}

function safeName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(-60) || "photo"
  );
}

async function uploadPhotos(
  files: File[],
  origin: string,
): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = [];
  const errors: string[] = [];
  const r2 = bindings().R2;

  if (!r2) {
    if (files.length) errors.push("R2 storage not configured; photos skipped");
    return { urls, errors };
  }

  for (const file of files.slice(0, MAX_FILES)) {
    if (file.size === 0) continue;
    if (file.size > MAX_FILE_BYTES) {
      errors.push(`${file.name} is too large (max 8MB)`);
      continue;
    }
    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      errors.push(`${file.name} is not a supported image`);
      continue;
    }
    const key = `quotes/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName(file.name)}`;
    try {
      await r2.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
      });
      urls.push(`${origin}/uploads/${key}`);
    } catch (err) {
      errors.push(
        `upload ${file.name}: ${err instanceof Error ? err.message : "failed"}`,
      );
    }
  }
  return { urls, errors };
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { ok: false, error: "Could not read the form submission." },
      { status: 400 },
    );
  }

  const b = bindings();

  // Honeypot: a hidden field real users never see. Bots fill it; we pretend
  // success and do nothing (no SMS, no storage), so they don't retry.
  if (String(form.get("company") ?? "").trim() !== "") {
    return Response.json({ ok: true });
  }

  // Per-IP rate limit so the form can't be weaponised to flood Twilio (cost)
  // or text arbitrary numbers. Skipped automatically if the binding is absent
  // (e.g. local dev). Pairs with a Cloudflare WAF rule for defense in depth.
  if (b.QUOTE_RATE_LIMITER) {
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const { success } = await b.QUOTE_RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return Response.json(
        {
          ok: false,
          error: "Too many requests. Please wait a minute and try again.",
        },
        { status: 429 },
      );
    }
  }

  const name = String(form.get("name") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const address = String(form.get("address") ?? "").trim();
  const preferredDay = String(form.get("preferredDay") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const services = form
    .getAll("services")
    .map((s) => String(s).trim())
    .filter(Boolean);

  if (!name || !phone) {
    return Response.json(
      { ok: false, error: "Please include your name and phone number." },
      { status: 400 },
    );
  }
  if (services.length === 0) {
    return Response.json(
      { ok: false, error: "Please choose at least one service." },
      { status: 400 },
    );
  }

  const files = form
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const origin = new URL(request.url).origin;
  const { urls: photoUrls, errors: uploadErrors } = await uploadPhotos(
    files,
    origin,
  );

  const payload: QuotePayload = {
    name,
    phone,
    address,
    services,
    preferredDay,
    message,
    photoUrls,
  };

  // Persist a durable record first (best-effort) so a lead is never lost.
  let recordId: number | null = null;
  try {
    const db = getDb();
    const [row] = await db
      .insert(quoteRequests)
      .values({
        name,
        phone,
        address,
        services: JSON.stringify(services),
        preferredDay,
        message,
        photoUrls: JSON.stringify(photoUrls),
        notifyStatus: "pending",
      })
      .returning({ id: quoteRequests.id });
    recordId = row?.id ?? null;
  } catch (err) {
    console.error("[quote] failed to persist request:", err);
  }

  const notify = await sendQuoteNotifications(
    payload,
    {
      accountSid: b.TWILIO_ACCOUNT_SID,
      authToken: b.TWILIO_AUTH_TOKEN,
      from: b.TWILIO_FROM,
      johnPhone: b.JOHN_PHONE,
    },
    {
      apiKey: b.RESEND_API_KEY,
      from: b.RESEND_FROM,
      johnEmail: b.JOHN_EMAIL,
    },
  );

  // "sent" when a channel delivered; "skipped" when no channel was configured
  // (a setup gap, not a delivery failure); "failed" when a configured channel
  // errored — kept distinct so D1 records are easy to triage.
  const notifyStatus =
    notify.johnTexted || notify.emailed
      ? "sent"
      : notify.errors.includes("twilio not configured")
        ? "skipped"
        : "failed";

  if (!notify.johnTexted && !notify.emailed) {
    // Loud log so the operator can see unconfigured/failed delivery and
    // still recover the lead from D1 / logs.
    console.error(
      "[quote] John was NOT notified. Lead:",
      JSON.stringify(payload),
      "errors:",
      notify.errors.join("; "),
    );
  }
  if (notify.errors.length) {
    console.warn("[quote] notify errors:", notify.errors.join("; "));
  }
  if (uploadErrors.length) {
    console.warn("[quote] upload errors:", uploadErrors.join("; "));
  }

  // Update the stored record with final delivery status (best-effort).
  if (recordId !== null) {
    try {
      const db = getDb();
      const { eq } = await import("drizzle-orm");
      await db
        .update(quoteRequests)
        .set({ notifyStatus })
        .where(eq(quoteRequests.id, recordId));
    } catch (err) {
      console.error("[quote] failed to update notify status:", err);
    }
  }

  // The customer always gets a friendly success — their request is recorded
  // and John's delivery is an operator concern, surfaced via logs/D1.
  return Response.json({
    ok: true,
    id: recordId,
    photos: photoUrls.length,
    customerTexted: notify.customerTexted,
  });
}
