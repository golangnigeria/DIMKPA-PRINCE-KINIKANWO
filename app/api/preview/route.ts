import { NextResponse } from "next/server";
import dns from "node:dns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignore in environments where this is not supported
}

const ALLOWED_HOSTS = new Set([
  "curexal.space",
  "www.curexal.space",
  "inverexglobal.com",
  "www.inverexglobal.com",
  "getweys.com",
  "www.getweys.com",
  "promptstore.io",
  "www.promptstore.io",
  "clipsaves.com",
  "www.clipsaves.com",
]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");

  if (!target) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return new NextResponse("Invalid protocol", { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) {
    return new NextResponse("Host not permitted", { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 1800 },
    });

    if (!upstream.ok) {
      return new NextResponse(`Upstream returned ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const contentType = upstream.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      const buffer = await upstream.arrayBuffer();
      return new NextResponse(buffer, {
        headers: { "Content-Type": contentType },
      });
    }

    let html = await upstream.text();
    const baseHref = `${parsed.origin}/`;

    // Inject <base> tag and frame-optimizing styles
    const injection = `
      <base href="${baseHref}" target="_blank" />
      <style>
        html, body {
          overflow-x: hidden !important;
          scrollbar-width: none !important;
        }
        ::-webkit-scrollbar { display: none !important; }
      </style>
    `;

    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${injection}`);
    } else if (html.includes("<head ")) {
      html = html.replace(/<head[^>]*>/, `$&${injection}`);
    } else {
      html = `${injection}${html}`;
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=1800, s-maxage=3600",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(`Failed to fetch preview: ${message}`, {
      status: 502,
    });
  }
}

