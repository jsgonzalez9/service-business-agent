import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function OptionsPage() {
  const supabase = await createClient()
  const { data: config } = await supabase.from("agent_config").select("*").single()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
  const docusealBase = process.env.DOCUSEAL_BASE_URL || ""
  const docusealConfigured = !!docusealBase
  const docusealTokenConfigured = !!process.env.DOCUSEAL_API_TOKEN
  const twilioConfigured =
    !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN && (!!process.env.TWILIO_PHONE_NUMBER || !!process.env.TWILIO_NUMBER_POOL)

  if (!config) {
    redirect("/dashboard/settings")
  }

  const nextDomain = appUrl || "https://your-vercel-domain"
  const dsPublic = docusealBase || "https://v0-ai-wholesaling-agent.onrender.com"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-4 px-6 py-4">
          <a href="/dashboard" className="text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </a>
          <h1 className="text-lg font-semibold text-foreground">Options & Integrations</h1>
        </div>
      </header>
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <a href="/dashboard">Leads Dashboard</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/dashboard/contracts">Contracts</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/dashboard/sequences">Sequences</a>
                </Button>
                <Button asChild>
                  <a href="/dashboard/settings">Settings</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DocuSeal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Base URL: <span className={docusealConfigured ? "text-green-500" : "text-red-500"}>{docusealConfigured ? "Configured" : "Not set"}</span>
              </p>
              <p className="text-sm">
                API Token: <span className={docusealTokenConfigured ? "text-yellow-500" : "text-muted-foreground"}>{docusealTokenConfigured ? "Optional (set)" : "Optional (not set)"}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <a href={dsPublic} target="_blank" rel="noreferrer">
                    Open DocuSeal
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/dashboard/contracts">Manage Templates</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/api/sign/ds/webhook" target="_blank" rel="noreferrer">
                    Webhook Endpoint
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <form action="/api/contracts/docuseal/link" method="post" encType="multipart/form-data" className="flex flex-1 items-center gap-2">
                  <select name="role" defaultValue="seller" className="rounded border border-border bg-background p-2 text-sm">
                    <option value="seller">Seller</option>
                    <option value="buyer">Buyer</option>
                  </select>
                  <Input name="state" placeholder="State (optional)" />
                  <Input name="templateId" placeholder="DocuSeal template id or full URL" />
                  <Button type="submit">Link</Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Twilio SMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Credentials: <span className={twilioConfigured ? "text-green-500" : "text-red-500"}>{twilioConfigured ? "Configured" : "Not set"}</span>
              </p>
              <p className="text-sm">
                SMS Inbound Webhook: <code className="rounded bg-muted px-1">{`${nextDomain}/api/twilio/incoming`}</code>
              </p>
              <p className="text-sm">
                SMS Status Callback: <code className="rounded bg-muted px-1">{`${nextDomain}/api/twilio/status`}</code>
              </p>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <a href="/api/twilio/incoming" target="_blank" rel="noreferrer">
                    Inbound Endpoint
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/api/twilio/status" target="_blank" rel="noreferrer">
                    Status Endpoint
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Twilio Voice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Voice Inbound Webhook: <code className="rounded bg-muted px-1">{`${nextDomain}/api/twilio/voice/incoming`}</code>
              </p>
              <p className="text-sm">
                Recording Callback: <code className="rounded bg-muted px-1">{`${nextDomain}/api/twilio/voice/recording`}</code>
              </p>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <a href="/api/twilio/voice/incoming" target="_blank" rel="noreferrer">
                    Inbound Voice
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/api/twilio/voice/recording" target="_blank" rel="noreferrer">
                    Recording Callback
                  </a>
                </Button>
                <Button asChild>
                  <a href="/dashboard/settings">Configure</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
