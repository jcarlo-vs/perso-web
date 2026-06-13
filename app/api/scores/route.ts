import { clientIpFrom, makeRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const TABLE = "portfolio_game_scores";
const TOP_N = 10;

// Per-game config: score direction + sane bounds (anti-cheat ceilings).
const GAMES: Record<string, { dir: "asc" | "desc"; min: number; max: number }> = {
  snake: { dir: "desc", min: 0, max: 999 },
  catch: { dir: "desc", min: 0, max: 9999 },
  reaction: { dir: "asc", min: 80, max: 2000 },
};

const isRateLimited = makeRateLimiter(20, 10 * 60 * 1000);

function configured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
function sb() {
  return {
    apikey: SUPABASE_ANON_KEY as string,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

async function topFor(game: string): Promise<{ name: string; score: number }[]> {
  const dir = GAMES[game].dir;
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=name,score&game=eq.${encodeURIComponent(game)}&order=score.${dir},created_at.asc&limit=${TOP_N}`;
  const res = await fetch(url, { headers: sb(), cache: "no-store" });
  if (!res.ok) throw new Error(`read ${res.status}`);
  return res.json();
}

function sanitizeName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = Array.from(raw).filter((ch) => { const c = ch.charCodeAt(0); return c >= 32 && c !== 127; }).join("").trim().slice(0, 20);
  return cleaned.length >= 1 ? cleaned : null;
}

export async function GET(req: Request) {
  const game = new URL(req.url).searchParams.get("game") ?? "";
  if (!configured() || !(game in GAMES)) return Response.json({ scores: [] });
  try {
    return Response.json({ scores: await topFor(game) });
  } catch (e) {
    console.error("scores read error:", e);
    return Response.json({ scores: [] });
  }
}

export async function POST(req: Request) {
  if (!configured()) return Response.json({ error: "Leaderboard offline." }, { status: 503 });
  const ip = clientIpFrom((n) => req.headers.get(n));
  if (isRateLimited(ip)) return Response.json({ error: "Too many submissions. Try again soon." }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }

  const b = body as { game?: unknown; name?: unknown; score?: unknown };
  const game = typeof b.game === "string" ? b.game : "";
  const cfg = GAMES[game];
  const name = sanitizeName(b.name);
  const score = Math.round(Number(b.score));

  if (!cfg || !name || !Number.isFinite(score) || score < cfg.min || score > cfg.max) {
    return Response.json({ error: "Invalid score" }, { status: 400 });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: { ...sb(), Prefer: "return=minimal" },
      body: JSON.stringify({ game, name, score }),
    });
    if (!res.ok) throw new Error(`insert ${res.status}`);

    const scores = await topFor(game);
    // rank = number of strictly-better scores + 1
    const op = cfg.dir === "desc" ? "gt" : "lt";
    const countUrl = `${SUPABASE_URL}/rest/v1/${TABLE}?select=id&game=eq.${encodeURIComponent(game)}&score=${op}.${score}`;
    const countRes = await fetch(countUrl, { headers: { ...sb(), Prefer: "count=exact" }, cache: "no-store" });
    const range = countRes.headers.get("content-range");
    const better = range ? parseInt(range.split("/")[1] ?? "0", 10) : 0;
    const rank = Number.isFinite(better) ? better + 1 : null;

    return Response.json({ scores, rank });
  } catch (e) {
    console.error("scores write error:", e);
    return Response.json({ error: "Could not save score." }, { status: 500 });
  }
}
