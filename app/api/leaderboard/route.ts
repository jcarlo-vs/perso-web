import { clientIpFrom, makeRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const TABLE = "portfolio_typing_scores";

const MAX_WPM = 250;
const MAX_NAME = 20;
const TOP_N = 10;

// 8 score submissions per IP per 10 minutes
const isRateLimited = makeRateLimiter(8, 10 * 60 * 1000);

type Score = { name: string; wpm: number; accuracy: number };

function configured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function sbHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY as string,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

async function fetchTop(): Promise<Score[]> {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=name,wpm,accuracy&order=wpm.desc,created_at.asc&limit=${TOP_N}`;
  const res = await fetch(url, { headers: sbHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error(`supabase read ${res.status}`);
  return res.json();
}

export async function GET() {
  if (!configured()) return Response.json({ scores: [] });
  try {
    return Response.json({ scores: await fetchTop() });
  } catch (e) {
    console.error("leaderboard read error:", e);
    return Response.json({ scores: [] });
  }
}

// Keep only printable characters (drop control chars), trim, and cap length.
function sanitizeName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = Array.from(raw)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("")
    .trim()
    .slice(0, MAX_NAME);
  return cleaned.length >= 1 ? cleaned : null;
}

export async function POST(req: Request) {
  if (!configured()) {
    return Response.json({ error: "Leaderboard is offline." }, { status: 503 });
  }

  const ip = clientIpFrom((n) => req.headers.get(n));
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many submissions. Try again soon." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const b = body as { name?: unknown; wpm?: unknown; accuracy?: unknown };
  const name = sanitizeName(b.name);
  const wpm = Math.round(Number(b.wpm));
  const accuracy = Math.round(Number(b.accuracy));

  if (
    !name ||
    !Number.isFinite(wpm) || wpm < 0 || wpm > MAX_WPM ||
    !Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100
  ) {
    return Response.json({ error: "Invalid score" }, { status: 400 });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: { ...sbHeaders(), Prefer: "return=minimal" },
      body: JSON.stringify({ name, wpm, accuracy }),
    });
    if (!res.ok) throw new Error(`supabase insert ${res.status}`);

    const scores = await fetchTop();

    // Rank = (number of scores strictly higher) + 1
    const countUrl = `${SUPABASE_URL}/rest/v1/${TABLE}?select=id&wpm=gt.${wpm}`;
    const countRes = await fetch(countUrl, {
      headers: { ...sbHeaders(), Prefer: "count=exact" },
      cache: "no-store",
    });
    const range = countRes.headers.get("content-range"); // e.g. "0-4/5"
    const higher = range ? parseInt(range.split("/")[1] ?? "0", 10) : 0;
    const rank = Number.isFinite(higher) ? higher + 1 : null;

    return Response.json({ scores, rank });
  } catch (e) {
    console.error("leaderboard write error:", e);
    return Response.json({ error: "Could not save score." }, { status: 500 });
  }
}
