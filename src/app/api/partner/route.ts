import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FIELD_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 5000;

type PartnerRequest = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  role?: unknown;
  interest?: unknown;
  stage?: unknown;
  message?: unknown;
  website?: unknown;
};

function text(value: unknown, maxLength = MAX_FIELD_LENGTH) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export async function POST(request: Request) {
  let payload: PartnerRequest;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // A hidden field catches the lowest-effort automated submissions without
  // burdening prospective partners with a challenge.
  if (text(payload.website)) return NextResponse.json({ ok: true });

  const name = text(payload.name);
  const company = text(payload.company);
  const email = text(payload.email);
  const role = text(payload.role);
  const interest = text(payload.interest);
  const stage = text(payload.stage);
  const message = text(payload.message, MAX_MESSAGE_LENGTH);

  if (!name || !company || !validEmail(email)) {
    return NextResponse.json(
      { error: "Please provide your name, company, and a valid work email." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    return NextResponse.json(
      { error: "Email delivery is not configured yet." },
      { status: 503 }
    );
  }

  const fields = [
    ["Name", name],
    ["Company", company],
    ["Work email", email],
    ["Role", role || "Not provided"],
    ["Interest", interest || "Not provided"],
    ["Program stage", stage || "Not provided"],
  ];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Partnership enquiry: ${company}`,
      text: `${fields.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nMessage:\n${message || "Not provided"}`,
      html: `<h2>New partnership enquiry</h2><dl>${fields.map(([label, value]) => `<dt><strong>${escapeHtml(label)}</strong></dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl><h3>Message</h3><p>${escapeHtml(message || "Not provided").replace(/\n/g, "<br />")}</p>`,
    }),
  });

  if (!response.ok) {
    console.error("Resend partner enquiry failed", response.status);
    return NextResponse.json(
      { error: "We could not send your request. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
