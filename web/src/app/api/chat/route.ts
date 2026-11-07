import { NextResponse } from "next/server";
import { assistantSystem, normalizeAssistantLocale } from "@/lib/assistant";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 12;
const hits = new Map<string, number[]>();

type Turn = { role: "user" | "assistant"; content: string };

type OpenAiResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
};

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "local";
}

function limited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

function cleanTurns(value: unknown): Turn[] {
  if (!Array.isArray(value)) return [];
  const turns: Turn[] = [];
  for (const item of value.slice(-8)) {
    if (!item || typeof item !== "object") continue;
    const row = item as { role?: string; content?: string };
    const content = String(row.content ?? "").replace(/\s+/g, " ").trim().slice(0, 500);
    if (!content || (row.role !== "user" && row.role !== "assistant")) continue;
    turns.push({ role: row.role, content });
  }
  return turns;
}

async function complete(messages: Array<{ role: string; content: string }>): Promise<string> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) throw new Error("OPENAI_API_KEY tanımlı değil.");
  const model = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4.1-mini";

  const call = (tokenField: "max_completion_tokens" | "max_tokens", withTemperature: boolean) =>
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        ...(withTemperature ? { temperature: 0.3 } : {}),
        [tokenField]: 400,
        messages,
      }),
    });

  let response = await call("max_completion_tokens", true);
  if (response.status === 400) {
    const peek = (await response.clone().json().catch(() => null)) as OpenAiResponse | null;
    const message = peek?.error?.message || "";
    if (/temperature/i.test(message)) response = await call("max_completion_tokens", false);
    else if (/max_completion_tokens|max_tokens|unsupported_parameter/i.test(message)) response = await call("max_tokens", true);
  }

  const payload = (await response.json()) as OpenAiResponse;
  if (!response.ok) throw new Error(payload.error?.message || "OpenAI yanıt vermedi.");
  return String(payload.choices?.[0]?.message?.content || "").replace(/\s+/g, " ").trim().slice(0, 1200);
}

export async function POST(req: Request) {
  if (limited(clientKey(req))) {
    return NextResponse.json({ error: "Çok fazla soru. Biraz sonra tekrar deneyin." }, { status: 429 });
  }

  let body: { locale?: string; messages?: unknown };
  try {
    body = (await req.json()) as { locale?: string; messages?: unknown };
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const turns = cleanTurns(body.messages);
  const last = turns[turns.length - 1];
  if (!last || last.role !== "user") {
    return NextResponse.json({ error: "Soru gerekli." }, { status: 400 });
  }

  const locale = normalizeAssistantLocale(body.locale || "tr");
  try {
    const reply = await complete([
      { role: "system", content: assistantSystem(locale || "tr") },
      ...turns,
    ]);
    if (!reply) return NextResponse.json({ error: "Yanıt boş." }, { status: 502 });
    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "OpenAI yanıt vermedi.";
    console.error("chat", message);
    return NextResponse.json({ error: "Asistan şu an yanıt veremiyor." }, { status: 502 });
  }
}
