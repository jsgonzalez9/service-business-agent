import OpenAI from "openai"
import { createServiceClient } from "@/lib/supabase/service"

function dot(a: number[], b: number[]) {
  let s = 0
  for (let i = 0; i < Math.min(a.length, b.length); i++) s += a[i] * b[i]
  return s
}
function norm(a: number[]) {
  return Math.sqrt(a.reduce((s, v) => s + v * v, 0))
}
function cosine(a: number[], b: number[]) {
  const na = norm(a)
  const nb = norm(b)
  if (!na || !nb) return 0
  return dot(a, b) / (na * nb)
}

export async function embedQuery(text: string): Promise<number[]> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  const emb = await openai.embeddings.create({ model: "text-embedding-3-small", input: text })
  return emb.data[0].embedding as unknown as number[]
}

export async function findCachedByEmbedding(
  intent: string,
  query: string,
  market?: string,
  floor: number = 0.85,
  ttlDays?: number,
): Promise<{ text: string | null; confidence: number; id?: string }> {
  const svc = createServiceClient()
  const vec = await embedQuery(query)
  let q = svc.from("cached_responses").select("id,response_text,embedding,intent,market,usage_count,created_at").eq("intent", intent)
  if (market) q = q.eq("market", market)
  const { data } = await q.limit(200)
  const now = Date.now()
  const maxAgeMs = typeof ttlDays === "number" && ttlDays > 0 ? ttlDays * 24 * 60 * 60 * 1000 : undefined
  const filtered = (data || []).filter((row: any) => {
    if (!maxAgeMs) return true
    const created = new Date(row.created_at).getTime()
    return now - created <= maxAgeMs
  })
  const scored = filtered.map((row: any) => ({ id: row.id, text: row.response_text as string, score: cosine(vec, (row.embedding as any) || []) }))
  scored.sort((a, b) => b.score - a.score)
  const best = scored[0]
  if (best && best.score >= floor) {
    const current = (data || []).find((d: any) => d.id === best.id)
    await svc
      .from("cached_responses")
      .update({ usage_count: ((current?.usage_count as number) || 0) + 1, last_used_at: new Date().toISOString() })
      .eq("id", best.id)
    return { text: best.text, confidence: best.score, id: best.id }
  }
  return { text: null, confidence: 0 }
}
