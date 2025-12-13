import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

async function warmAll() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await supabase.from("cached_responses").select("id,canonical_question,normalized_question")
  for (const row of data || []) {
    const q = row.canonical_question || row.normalized_question
    const emb = await openai.embeddings.create({ model: "text-embedding-3-small", input: q })
    const vec = emb.data[0].embedding
    await supabase.from("cached_responses").update({ embedding: vec }).eq("id", row.id)
    console.log(`Warmed ${row.id}`)
  }
  console.log("Warm complete.")
}

warmAll()
