import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function OpsDashboard() {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/ops/costs`, { cache: "no-store" }).catch(() => null)
  let data: any = null
  try {
    data = resp ? await resp.json() : null
  } catch {}
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-4 px-6 py-4">
          <a href="/dashboard" className="text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </a>
          <h1 className="text-lg font-semibold text-foreground">Ops / Cost</h1>
        </div>
      </header>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Messages (30d)</p>
          <p className="text-2xl font-semibold text-foreground">{data?.messagesCount ?? 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Avg Confidence</p>
          <p className="text-2xl font-semibold text-foreground">{(data?.avgConfidence ?? 0).toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">FAQ Cache Hits (30d)</p>
          <p className="text-2xl font-semibold text-foreground">{data?.faqHits ?? 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Contracts Sent (30d)</p>
          <p className="text-2xl font-semibold text-foreground">{data?.contractsSent ?? 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Contracts Signed (30d)</p>
          <p className="text-2xl font-semibold text-foreground">{data?.contractsSigned ?? 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Closed (30d)</p>
          <p className="text-2xl font-semibold text-foreground">{data?.closed ?? 0}</p>
        </div>
      </div>
    </div>
  )
}
