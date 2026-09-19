import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const KEY = "s1-attendance:records";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "S1Surgical2026";

function isAuthorized(request) {
  const password = request.headers.get("x-admin-password");
  return password === ADMIN_PASSWORD;
}

export async function POST(request) {
  const body = await request.json();
  const { name, matricNumber, group, date } = body || {};

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const record = {
    id: crypto.randomUUID(),
    name: name.trim(),
    matricNumber: (matricNumber || "").trim(),
    group: (group || "").trim(),
    date: date || new Date().toISOString().slice(0, 10),
    submittedAt: new Date().toISOString(),
  };

  await kv.rpush(KEY, JSON.stringify(record));

  return NextResponse.json({ ok: true });
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = (await kv.lrange(KEY, 0, -1)) || [];
  const records = raw
    .map((r) => {
      try {
        return typeof r === "string" ? JSON.parse(r) : r;
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .reverse();

  return NextResponse.json({ records });
}
