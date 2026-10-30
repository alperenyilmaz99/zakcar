import { randomUUID } from "crypto";
import type { BlogBlock, BlogPost } from "@/lib/blog-types";
import type { SiteReview, StoredPost } from "@/lib/content-types";
import { coverForSlug } from "@/lib/generated-content";

const FACTS = `ZakCar Rent A Car, İstanbul’da kısa dönem araç kiralar.
Ofisler yalnızca şunlardır: İstanbul Sabiha Gökçen Havalimanı (SAW) 7/24, İstanbul Havalimanı (IGA) 7/24, ZakCar Merkez Ofis (Sabiha Gökçen karşısı, 08:00-22:00).
Kredi kartı zorunlu değildir, Findeks sorgusu yoktur. Ön ödeme yoktur; ödeme araç tesliminde yapılır.
Depozito araç grubuna göre alınır ve iade koşullu olarak geri verilir. Standart kasko ve 7/24 yol yardım fiyata dahildir. Havalimanı teslimi ücretsizdir.
İlk kiralamada standart ve SUV grubunda %10 indirim vardır.
Ekler: ek sürücü, genç sürücü paketi, HGS, çocuk koltuğu, kış lastiği.
Telefon +90 532 388 2996. WhatsApp +90 850 307 7384.
Başka şehir ofisi, online ödeme, zorunlu kredi kartı veya uydurma fiyat yazma.`;

const BLOCK_SAMPLE = `[
  {"type":"paragraph","text":"Giriş: okurun sorununu ve ZakCar’ın buna nasıl baktığını iki üç cümleyle anlat."},
  {"type":"heading","level":2,"text":"Ana bölüm"},
  {"type":"paragraph","text":"Bölümü somut teslim, ofis veya ödeme ayrıntısıyla aç."},
  {"type":"heading","level":3,"text":"Alt başlık"},
  {"type":"listItem","text":"Kısa, uygulanabilir madde"},
  {"type":"listItem","text":"İkinci madde"},
  {"type":"heading","level":2,"text":"Kapanış"},
  {"type":"paragraph","text":"Okuru rezervasyona çağır, abartısız."}
]`;

type ClaudeResponse = {
  content?: Array<{ type: string; text?: string }>;
  error?: { message?: string };
};

function slugify(title: string): string {
  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    i̇: "i",
    ö: "o",
    ş: "s",
    ü: "u",
  };
  return title
    .toLocaleLowerCase("tr")
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Model geçerli JSON döndürmedi.");
  return JSON.parse(raw.slice(start, end + 1)) as unknown;
}

async function askClaude(prompt: string, maxTokens: number): Promise<unknown> {
  const key = process.env.CLAUDE_API_KEY?.trim();
  if (!key) throw new Error("CLAUDE_API_KEY tanımlı değil.");

  const body = {
    model: "claude-sonnet-5-5",
    max_tokens: maxTokens,
    output_config: { effort: "low" },
    messages: [{ role: "user", content: prompt }],
  };

  let response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 400) {
    const retry = { ...body } as { output_config?: unknown };
    delete retry.output_config;
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(retry),
    });
  }

  const payload = (await response.json()) as ClaudeResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message || "Claude yanıt vermedi.");
  }
  const text = (payload.content || [])
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text)
    .join("\n");
  if (!text.trim()) throw new Error("Claude metin döndürmedi.");
  return extractJson(text);
}

function clean(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function asBlocks(value: unknown): BlogBlock[] {
  if (!Array.isArray(value)) throw new Error("Blog blokları eksik.");
  const blocks: BlogBlock[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as { type?: string; text?: string; level?: number };
    const text = clean(row.text, 700);
    if (!text) continue;
    if (row.type === "heading") {
      blocks.push({ type: "heading", level: row.level === 3 ? 3 : 2, text });
    } else if (row.type === "listItem") {
      blocks.push({ type: "listItem", text });
    } else if (row.type === "paragraph") {
      blocks.push({ type: "paragraph", text });
    }
  }
  while (blocks.length > 0 && blocks[blocks.length - 1].type === "heading") blocks.pop();
  if (blocks.length < 6) throw new Error("Blog yeterince blok içermiyor.");
  return blocks.slice(0, 18);
}

export async function generateBlogPost(existing: BlogPost[], recentTitles: string[]): Promise<StoredPost> {
  const titles = recentTitles.slice(0, 40).map((title) => `- ${title}`).join("\n");
  const prompt = `ZakCar blogu için yeni bir Türkçe rehber yazısı üret.
${FACTS}

Var olan yazıların yapısı şöyle. Aynı blok türlerini kullan: paragraph, heading (level 2 veya 3), listItem. Paragraflar açıklayıcı, listeler kısa olsun. Satış bağırışı yapma.

Örnek blok dizisi:
${BLOCK_SAMPLE}

Bu başlıkları tekrarlama:
${titles}

Yalnızca şu JSON’u döndür:
{"title":"...","excerpt":"...","blocks":[...]}`;

  const data = (await askClaude(prompt, 4000)) as { title?: string; excerpt?: string; blocks?: unknown };
  const title = clean(data.title, 120);
  const excerpt = clean(data.excerpt, 220);
  if (title.length < 16 || excerpt.length < 40) throw new Error("Blog başlığı veya özeti yetersiz.");
  const used = new Set(existing.map((post) => post.slug));
  let slug = slugify(title);
  if (!slug) throw new Error("Blog adresi üretilemedi.");
  let n = 2;
  while (used.has(slug)) {
    slug = `${slugify(title).slice(0, 68)}-${n}`;
    n += 1;
  }
  return {
    slug,
    title,
    excerpt,
    image: coverForSlug(slug),
    blocks: asBlocks(data.blocks),
    createdAt: new Date().toISOString(),
  };
}

const OFFICES = ["Sabiha Gökçen", "İstanbul Havalimanı", "Merkez Ofis"] as const;

export async function generateReview(previous: SiteReview[]): Promise<SiteReview> {
  const earlier = previous
    .slice(0, 8)
    .map((item) => `- ${item.author} (${item.location}): ${item.body}`)
    .join("\n");
  const prompt = `ZakCar için tek bir müşteri yorumu yaz.
${FACTS}

Yorum birinci tekil ağzından, 2 veya 3 cümle olsun. Müşteri teslim anından, ofisten veya ödeme şeklinden somut bir şey anlatsın. Reklam metni gibi sıralama yapma. Yıldız 4 veya 5 olsun. Yazar "Ayşe K." biçiminde ad ve soyad baş harfi olsun.
Lokasyon yalnızca şunlardan biri: Sabiha Gökçen, İstanbul Havalimanı, Merkez Ofis.
${earlier ? `Şu yorumların konusunu tekrarlama:\n${earlier}` : "Bu ilk yorum. Doğal ve sade olsun."}

Yalnızca şu JSON’u döndür:
{"author":"Ayşe K.","location":"Sabiha Gökçen","rating":5,"body":"..."}`;

  const data = (await askClaude(prompt, 800)) as {
    author?: string;
    location?: string;
    rating?: number;
    body?: string;
  };
  const author = clean(data.author, 40);
  const body = clean(data.body, 420);
  const locationText = clean(data.location, 48).toLocaleLowerCase("tr");
  const location = locationText.includes("sabiha") || locationText === "saw"
    ? "Sabiha Gökçen"
    : locationText.includes("merkez")
      ? "Merkez Ofis"
      : locationText.includes("iga") || locationText.includes("havaliman")
        ? "İstanbul Havalimanı"
        : OFFICES[previous.length % OFFICES.length];
  const rating = data.rating === 4 ? 4 : 5;
  if (!/^[A-Za-zÇĞİÖŞÜçğıöşü][A-Za-zÇĞİÖŞÜçğıöşü.'\- ]{1,32}$/.test(author)) {
    throw new Error("Yorum yazarı geçersiz.");
  }
  if (body.length < 60) throw new Error("Yorum çok kısa.");
  return {
    id: randomUUID(),
    author,
    location,
    rating,
    body,
    createdAt: new Date().toISOString(),
  };
}
