import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

type Bindings = { R2?: R2Bucket };

// Serves photos uploaded with a quote request straight from R2 storage so the
// links texted/emailed to John resolve. Keys live under the "quotes/" prefix.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const key = (path ?? []).join("/");

  if (!key.startsWith("quotes/")) {
    return new Response("Not found", { status: 404 });
  }

  const r2 = (env as unknown as Bindings).R2;
  if (!r2) {
    return new Response("Storage unavailable", { status: 503 });
  }

  const object = await r2.get(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "private, max-age=31536000, immutable");
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/octet-stream");
  }

  return new Response(object.body, { headers });
}
