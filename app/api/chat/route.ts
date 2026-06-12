import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/ai-profile';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_TURNS = 12;
const MAX_MESSAGE_LENGTH = 1000;

// Best-effort rate limit (per serverless instance): 10 messages per IP per 10 minutes
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const recentRequests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentRequests.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    recentRequests.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentRequests.set(ip, recent);
  if (recentRequests.size > 1000) {
    for (const [key, times] of recentRequests) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) recentRequests.delete(key);
    }
  }
  return false;
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function isValidMessage(m: unknown): m is ChatMessage {
  if (typeof m !== 'object' || m === null) return false;
  const msg = m as Record<string, unknown>;
  return (
    (msg.role === 'user' || msg.role === 'assistant') &&
    typeof msg.content === 'string' &&
    msg.content.length > 0 &&
    msg.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'The AI assistant is offline right now. Please use the contact form instead.' },
      { status: 503 }
    );
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return Response.json(
      { error: 'Too many messages. Please wait a few minutes and try again.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0 || !rawMessages.every(isValidMessage)) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Keep only the most recent turns, and the conversation must start with a user message
  let messages = rawMessages.slice(-MAX_TURNS);
  while (messages.length > 0 && messages[0].role !== 'user') messages = messages.slice(1);
  if (messages.length === 0) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const client = new Anthropic();

  const stream = client.messages.stream({
    model: 'claude-haiku-4-5',
    max_tokens: 600,
    system: buildSystemPrompt(),
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error) {
        console.error('Chat stream error:', error);
        controller.enqueue(encoder.encode('\n[Connection lost - please try again]'));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
