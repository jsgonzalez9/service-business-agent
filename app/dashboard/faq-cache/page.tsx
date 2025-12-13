import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export default async function FAQCachePage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from("cached_responses").select("*").order("updated_at", { ascending: false }).limit(100)
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">FAQ Cache</h1>
        <form action="/api/faq-cache/seed" method="post">
          <Button type="submit" variant="outline">Seed Defaults</Button>
        </form>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {(items || []).map((i: any) => (
          <div key={i.id} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{i.intent}</p>
            <p className="font-medium text-foreground">{i.canonical_question || i.normalized_question}</p>
            <p className="text-sm text-muted-foreground">{i.response_text}</p>
            <form action="/api/faq-cache/warm" method="post" className="mt-2">
              <input type="hidden" name="id" value={i.id} />
              <Button type="submit" variant="outline">Warm Embedding</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
