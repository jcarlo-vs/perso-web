import Anthropic from "@anthropic-ai/sdk";
import { clientIpFrom, makeRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 15;

const isRateLimited = makeRateLimiter(40, 10 * 60 * 1000);

// Returns { word: string | null, taunt: string }. On any failure returns
// word:null so the client falls back to its local opponent.
export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ word: null, taunt: "" });
  }
  const ip = clientIpFrom((n) => req.headers.get(n));
  if (isRateLimited(ip)) return Response.json({ word: null, taunt: "" });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ word: null, taunt: "" });
  }

  const b = body as { chain?: unknown; letter?: unknown };
  const chain = Array.isArray(b.chain) ? b.chain.filter((w) => typeof w === "string").slice(-40) : [];
  const letter = typeof b.letter === "string" ? b.letter.toLowerCase().slice(0, 1) : "";
  if (!/[a-z]/.test(letter)) return Response.json({ word: null, taunt: "" });

  const system =
    "You are a witty, lightly cocky opponent in a tech word-chain game. Words must be real software/technology/computing terms. Reply ONLY with compact JSON.";
  const user = `The chain so far (already used, do not repeat): ${chain.join(", ") || "(empty)"}.
Give one real tech term that starts with the letter "${letter}", is at least 2 letters, is NOT already used, and is a single word (letters only).
Respond ONLY as JSON: {"word":"<your word, lowercase>","taunt":"<<=8 words of friendly trash talk>"}.
If you truly cannot find one, respond {"word":null,"taunt":"<concede gracefully>"}.`;

  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 80,
      system,
      messages: [{ role: "user", content: user }],
    });
    const text = res.content.find((c) => c.type === "text")?.type === "text"
      ? (res.content.find((c) => c.type === "text") as { text: string }).text
      : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ word: null, taunt: "" });
    const parsed = JSON.parse(match[0]) as { word?: unknown; taunt?: unknown };
    const word = typeof parsed.word === "string" ? parsed.word.toLowerCase().replace(/[^a-z]/g, "") : null;
    const taunt = typeof parsed.taunt === "string" ? parsed.taunt.slice(0, 60) : "";
    return Response.json({ word: word || null, taunt });
  } catch (e) {
    console.error("word-duel error:", e);
    return Response.json({ word: null, taunt: "" });
  }
}
