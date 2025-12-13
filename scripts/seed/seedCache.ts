import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"
import { FAQ_SEED } from "./faqSeed"

async function seedCache() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  console.log("Seeding cache...")
  for (const item of FAQ_SEED) {
    const emb = await openai.embeddings.create({ model: "text-embedding-3-small", input: item.question })
    const vec = emb.data[0].embedding
    const { error } = await supabase
      .from("cached_responses")
      .insert({ intent: item.intent, canonical_question: item.question, response_text: item.response, embedding: vec })
    if (error) {
      console.error("Insert failed:", error.message)
    } else {
      console.log(`Seeded: ${item.question}`)
    }
  }
  console.log("Cache seeding complete.")
}

seedCache()
