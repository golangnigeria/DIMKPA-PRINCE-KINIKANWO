import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";
import { CONTACT_EMAIL } from "@/constants/portfolio-constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Body {
  name?: string;
  email?: string;
  budget?: string;
  message?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const budget = body.budget?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }
  if (name.length > 120 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const userAgent = req.headers.get("user-agent") ?? "";

  try {
    const res = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": forwarded,
        "User-Agent": userAgent,
      },
      body: JSON.stringify({ name, email, budget, message }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || `Please email ${CONTACT_EMAIL} directly.` },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Backend contact API call failed:", error);
    return NextResponse.json(
      {
        error: `Could not reach backend service. Please email ${CONTACT_EMAIL} directly.`,
      },
      { status: 503 }
    );
  }
}
