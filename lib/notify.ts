/**
 * Notification helpers for the Temple Property Care quote form.
 *
 * John is an older gentleman, so the priority channel is a plain SMS text.
 * Email is an optional secondary record. Everything is keyed off environment
 * secrets and degrades gracefully: if a channel isn't configured, it's simply
 * skipped (and reported), never throwing and never blocking the customer.
 */

export type QuotePayload = {
  name: string;
  phone: string;
  address: string;
  services: string[];
  preferredDay: string;
  message: string;
  photoUrls: string[];
};

export type TwilioConfig = {
  accountSid?: string;
  authToken?: string;
  from?: string; // Twilio sending number, e.g. +14095550000
  johnPhone?: string; // John's mobile number, e.g. +14095550123
};

export type ResendConfig = {
  apiKey?: string;
  from?: string; // verified sender, e.g. "Temple Property Care <quotes@...>"
  johnEmail?: string;
};

export type NotifyResult = {
  johnTexted: boolean;
  customerTexted: boolean;
  emailed: boolean;
  errors: string[];
};

function twilioReady(c: TwilioConfig): c is Required<TwilioConfig> {
  return Boolean(c.accountSid && c.authToken && c.from && c.johnPhone);
}

/** Send a single SMS via the Twilio REST API (works on the Workers runtime). */
async function sendSms(
  c: { accountSid: string; authToken: string; from: string },
  to: string,
  body: string,
): Promise<void> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${c.accountSid}/Messages.json`;
  const form = new URLSearchParams({ To: to, From: c.from, Body: body });
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${c.accountSid}:${c.authToken}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Twilio ${res.status}: ${detail.slice(0, 300)}`);
  }
}

// Collapse newlines/whitespace so a user-supplied value can't inject extra
// lines (e.g. a fake "Phone:" line) into the `\n`-joined SMS body.
function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function buildJohnText(p: QuotePayload): string {
  const lines = [
    "New quote request - Temple Property Care",
    "",
    `Name: ${oneLine(p.name)}`,
    `Phone: ${oneLine(p.phone)}`,
  ];
  if (p.address) lines.push(`Address: ${oneLine(p.address)}`);
  if (p.services.length)
    lines.push(`Services: ${p.services.map(oneLine).join(", ")}`);
  if (p.preferredDay) lines.push(`Preferred day: ${oneLine(p.preferredDay)}`);
  if (p.message) lines.push(`Notes: ${oneLine(p.message)}`);
  if (p.photoUrls.length) {
    lines.push("", `Photos (${p.photoUrls.length}):`);
    for (const url of p.photoUrls) lines.push(url);
  }
  return lines.join("\n");
}

function buildCustomerText(p: QuotePayload): string {
  const first = oneLine(p.name).split(" ")[0] || "there";
  return (
    `Hi ${first}, thanks for reaching out to Temple Property Care! ` +
    `John got your request and will call you soon at ${oneLine(p.phone)} to set up your free quote. ` +
    `- John Temple`
  );
}

/** Fire all configured notification channels. Never throws. */
export async function sendQuoteNotifications(
  payload: QuotePayload,
  twilio: TwilioConfig,
  resend: ResendConfig,
): Promise<NotifyResult> {
  const result: NotifyResult = {
    johnTexted: false,
    customerTexted: false,
    emailed: false,
    errors: [],
  };

  if (twilioReady(twilio)) {
    const base = {
      accountSid: twilio.accountSid,
      authToken: twilio.authToken,
      from: twilio.from,
    };
    // John's text is the critical path.
    try {
      await sendSms(base, twilio.johnPhone, buildJohnText(payload));
      result.johnTexted = true;
    } catch (err) {
      result.errors.push(`john sms: ${asMessage(err)}`);
    }
    // Customer confirmation text (non-critical).
    if (payload.phone) {
      try {
        await sendSms(base, payload.phone, buildCustomerText(payload));
        result.customerTexted = true;
      } catch (err) {
        result.errors.push(`customer sms: ${asMessage(err)}`);
      }
    }
  } else {
    result.errors.push("twilio not configured");
  }

  // Optional email record to John.
  if (resend.apiKey && resend.from && resend.johnEmail) {
    try {
      await sendEmail(resend, payload);
      result.emailed = true;
    } catch (err) {
      result.errors.push(`email: ${asMessage(err)}`);
    }
  }

  return result;
}

async function sendEmail(
  c: { apiKey?: string; from?: string; johnEmail?: string },
  p: QuotePayload,
): Promise<void> {
  const rows = [
    ["Name", p.name],
    ["Phone", p.phone],
    ["Address", p.address],
    ["Services", p.services.join(", ")],
    ["Preferred day", p.preferredDay],
    ["Notes", p.message],
  ].filter(([, v]) => v);

  const html =
    `<h2>New quote request</h2><table cellpadding="6">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="font-weight:700">${k}</td><td>${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `</table>` +
    (p.photoUrls.length
      ? `<p><strong>Photos:</strong></p>` +
        p.photoUrls
          .map((u) => `<p><a href="${escapeHtml(u)}">${escapeHtml(u)}</a></p>`)
          .join("")
      : "");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: c.from,
      to: c.johnEmail,
      subject: `New quote request from ${p.name}`,
      html,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
}

function asMessage(err: unknown): string {
  return err instanceof Error ? err.message : "unknown error";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
