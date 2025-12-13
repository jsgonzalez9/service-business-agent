"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AgentConfig } from "@/lib/types"

interface SettingsFormProps {
  initialConfig: AgentConfig | null
}

export function SettingsForm({ initialConfig }: SettingsFormProps) {
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    company_name: initialConfig?.company_name || "CashBuyer Properties",
    wholesaling_fee: initialConfig?.wholesaling_fee?.toString() || "10000",
    arv_multiplier: initialConfig?.arv_multiplier?.toString() || "0.70",
    follow_up_hours: initialConfig?.follow_up_hours?.toString() || "24",
    max_follow_ups: initialConfig?.max_follow_ups?.toString() || "3",
    followup_backoff_minutes: (initialConfig as any)?.followup_backoff_minutes?.toString() || "15",
    followup_max_attempts: (initialConfig as any)?.followup_max_attempts?.toString() || "3",
    llm_cache_enabled: (initialConfig as any)?.llm_cache_enabled !== false,
    llm_cache_confidence_floor: String((initialConfig as any)?.llm_cache_confidence_floor ?? 0.85),
    llm_cache_ttl_faq_days: String((initialConfig as any)?.llm_cache_ttl_faq_days ?? 30),
    llm_cache_ttl_objection_days: String((initialConfig as any)?.llm_cache_ttl_objection_days ?? 14),
  })
  const [health, setHealth] = useState<Record<string, number>>({})
  const [loadingHealth, setLoadingHealth] = useState(false)
  const [marketOverrides, setMarketOverrides] = useState<Record<string, any>>((initialConfig as any)?.llm_cache_market_overrides || {})
  const [marketCode, setMarketCode] = useState("")
  const [marketFloor, setMarketFloor] = useState(String(0.85))
  const [marketTtlFaq, setMarketTtlFaq] = useState(String(30))
  const [marketTtlObj, setMarketTtlObj] = useState(String(14))
  const [cacheEntries, setCacheEntries] = useState<any[]>([])

  async function loadHealth() {
    setLoadingHealth(true)
    try {
      const resp = await fetch("/api/sms/health")
      const data = await resp.json()
      if (data.success) setHealth(data.perNumber || {})
    } catch {}
    setLoadingHealth(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: config.company_name,
          wholesaling_fee: Number.parseFloat(config.wholesaling_fee),
          arv_multiplier: Number.parseFloat(config.arv_multiplier),
          follow_up_hours: Number.parseInt(config.follow_up_hours),
          max_follow_ups: Number.parseInt(config.max_follow_ups),
          followup_backoff_minutes: Number.parseInt(config.followup_backoff_minutes),
          followup_max_attempts: Number.parseInt(config.followup_max_attempts),
          llm_cache_enabled: !!(config as any).llm_cache_enabled,
          llm_cache_confidence_floor: Number.parseFloat((config as any).llm_cache_confidence_floor),
          llm_cache_ttl_faq_days: Number.parseInt((config as any).llm_cache_ttl_faq_days),
          llm_cache_ttl_objection_days: Number.parseInt((config as any).llm_cache_ttl_objection_days),
          llm_cache_market_overrides: marketOverrides,
          auto_dispo_eval_enabled: !!(config as any).auto_dispo_eval_enabled,
          auto_renegotiate_days_threshold: Number.parseInt((config as any).auto_renegotiate_days_threshold ?? 5),
          auto_cancel_days_threshold: Number.parseInt((config as any).auto_cancel_days_threshold ?? 10),
          auto_dispo_require_human_confirm: !!(config as any).auto_dispo_require_human_confirm,
        }),
      })
      const data = await response.json()
      if (data.success) {
        alert("Settings saved!")
      } else {
        alert(data.error || "Failed to save")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings")
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Configure your company name used in SMS messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={config.company_name}
              onChange={(e) => setConfig((prev) => ({ ...prev, company_name: e.target.value }))}
              placeholder="Your Company Name"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LLM Cache</CardTitle>
          <CardDescription>Enable or disable embedding-based cache for FAQs/objections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="llm_cache_enabled">Enable Cache</Label>
            <input
              id="llm_cache_enabled"
              type="checkbox"
              checked={!!config.llm_cache_enabled}
              onChange={(e) => setConfig((prev: any) => ({ ...prev, llm_cache_enabled: e.target.checked }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <Label htmlFor="llm_cache_confidence_floor">Confidence Floor</Label>
              <Input
                id="llm_cache_confidence_floor"
                type="number"
                step="0.01"
                value={config.llm_cache_confidence_floor}
                onChange={(e) => setConfig((prev: any) => ({ ...prev, llm_cache_confidence_floor: e.target.value }))}
                placeholder="0.85"
              />
            </div>
            <div>
              <Label htmlFor="llm_cache_ttl_faq_days">FAQ TTL (days)</Label>
              <Input
                id="llm_cache_ttl_faq_days"
                type="number"
                value={config.llm_cache_ttl_faq_days}
                onChange={(e) => setConfig((prev: any) => ({ ...prev, llm_cache_ttl_faq_days: e.target.value }))}
                placeholder="30"
              />
            </div>
            <div>
              <Label htmlFor="llm_cache_ttl_objection_days">Objection TTL (days)</Label>
              <Input
                id="llm_cache_ttl_objection_days"
                type="number"
                value={config.llm_cache_ttl_objection_days}
                onChange={(e) => setConfig((prev: any) => ({ ...prev, llm_cache_ttl_objection_days: e.target.value }))}
                placeholder="14"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">Per-Market Overrides</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <Input placeholder="Market (e.g. TX)" value={marketCode} onChange={(e) => setMarketCode(e.target.value.toUpperCase())} />
              <Input placeholder="Floor e.g. 0.88" value={marketFloor} onChange={(e) => setMarketFloor(e.target.value)} />
              <Input placeholder="FAQ TTL days" value={marketTtlFaq} onChange={(e) => setMarketTtlFaq(e.target.value)} />
              <Input placeholder="Objection TTL days" value={marketTtlObj} onChange={(e) => setMarketTtlObj(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (!marketCode) return
                  setMarketOverrides((prev) => ({
                    ...prev,
                    [marketCode]: {
                      confidence_floor: Number.parseFloat(marketFloor),
                      ttl_faq_days: Number.parseInt(marketTtlFaq),
                      ttl_objection_days: Number.parseInt(marketTtlObj),
                    },
                  }))
                  setMarketCode("")
                }}
              >
                Add/Update Override
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (!marketCode) return
                  const next = { ...marketOverrides }
                  delete next[marketCode]
                  setMarketOverrides(next)
                  setMarketCode("")
                }}
              >
                Remove Override
              </Button>
            </div>
            <div className="rounded border border-border p-2 text-sm">
              {Object.keys(marketOverrides).length === 0 ? (
                <p className="text-muted-foreground">No overrides</p>
              ) : (
                Object.entries(marketOverrides).map(([m, v]: any) => (
                  <div key={m} className="flex items-center justify-between">
                    <span>{m}</span>
                    <span>
                      floor {v?.confidence_floor ?? "-"} • faq {v?.ttl_faq_days ?? "-"}d • obj {v?.ttl_objection_days ?? "-"}d
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disposition Automation</CardTitle>
          <CardDescription>Auto evaluate and act during DISPO phase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="auto_dispo_eval_enabled">Enable Auto Evaluation</Label>
            <input
              id="auto_dispo_eval_enabled"
              type="checkbox"
              defaultChecked={(initialConfig as any)?.auto_dispo_eval_enabled !== false}
              onChange={(e) =>
                setConfig((prev: any) => ({
                  ...prev,
                  auto_dispo_eval_enabled: e.target.checked,
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <Label htmlFor="auto_renegotiate_days_threshold">Renegotiate After (days)</Label>
              <Input
                id="auto_renegotiate_days_threshold"
                type="number"
                defaultValue={(initialConfig as any)?.auto_renegotiate_days_threshold ?? 5}
                onChange={(e) =>
                  setConfig((prev: any) => ({
                    ...prev,
                    auto_renegotiate_days_threshold: Number.parseInt(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="auto_cancel_days_threshold">Cancel After (days)</Label>
              <Input
                id="auto_cancel_days_threshold"
                type="number"
                defaultValue={(initialConfig as any)?.auto_cancel_days_threshold ?? 10}
                onChange={(e) =>
                  setConfig((prev: any) => ({
                    ...prev,
                    auto_cancel_days_threshold: Number.parseInt(e.target.value),
                  }))
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="auto_dispo_require_human_confirm">Require Human Confirm</Label>
              <input
                id="auto_dispo_require_human_confirm"
                type="checkbox"
                defaultChecked={(initialConfig as any)?.auto_dispo_require_human_confirm !== false}
                onChange={(e) =>
                  setConfig((prev: any) => ({
                    ...prev,
                    auto_dispo_require_human_confirm: e.target.checked,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                const resp = await fetch("/api/dispo/auto/run", { method: "POST" })
                const j = await resp.json()
                alert(resp.ok ? `Evaluated ${j.evaluated} deals • Actions ${j.actions}` : j.error || "Run failed")
              }}
            >
              Run Now
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Offer Calculation</CardTitle>
          <CardDescription>Configure the MAO formula parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="arv_multiplier">ARV Multiplier</Label>
            <Input
              id="arv_multiplier"
              type="number"
              step="0.01"
              value={config.arv_multiplier}
              onChange={(e) => setConfig((prev) => ({ ...prev, arv_multiplier: e.target.value }))}
              placeholder="0.70"
            />
            <p className="mt-1 text-sm text-muted-foreground">Typically 0.70 (70%) for wholesaling</p>
          </div>
          <div>
            <Label htmlFor="wholesaling_fee">Wholesaling Fee ($)</Label>
            <Input
              id="wholesaling_fee"
              type="number"
              value={config.wholesaling_fee}
              onChange={(e) => setConfig((prev) => ({ ...prev, wholesaling_fee: e.target.value }))}
              placeholder="10000"
            />
            <p className="mt-1 text-sm text-muted-foreground">Your assignment fee deducted from MAO</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Follow-up Settings</CardTitle>
          <CardDescription>Configure automated follow-up behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="follow_up_hours">Follow-up Delay (hours)</Label>
            <Input
              id="follow_up_hours"
              type="number"
              value={config.follow_up_hours}
              onChange={(e) => setConfig((prev) => ({ ...prev, follow_up_hours: e.target.value }))}
              placeholder="24"
            />
            <p className="mt-1 text-sm text-muted-foreground">Hours to wait before sending follow-up</p>
          </div>
          <div>
            <Label htmlFor="max_follow_ups">Max Follow-ups</Label>
            <Input
              id="max_follow_ups"
              type="number"
              value={config.max_follow_ups}
              onChange={(e) => setConfig((prev) => ({ ...prev, max_follow_ups: e.target.value }))}
              placeholder="3"
            />
            <p className="mt-1 text-sm text-muted-foreground">Maximum follow-up messages per lead</p>
          </div>
          <div>
            <Label htmlFor="followup_backoff_minutes">Backoff Minutes</Label>
            <Input
              id="followup_backoff_minutes"
              type="number"
              value={config.followup_backoff_minutes}
              onChange={(e) => setConfig((prev) => ({ ...prev, followup_backoff_minutes: e.target.value }))}
              placeholder="15"
            />
            <p className="mt-1 text-sm text-muted-foreground">Minutes to wait before retrying failed follow-up</p>
          </div>
          <div>
            <Label htmlFor="followup_max_attempts">Max Retry Attempts</Label>
            <Input
              id="followup_max_attempts"
              type="number"
              value={config.followup_max_attempts}
              onChange={(e) => setConfig((prev) => ({ ...prev, followup_max_attempts: e.target.value }))}
              placeholder="3"
            />
            <p className="mt-1 text-sm text-muted-foreground">Max retries per follow-up message</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Twilio Configuration</CardTitle>
          <CardDescription>Add these environment variables to enable SMS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4 font-mono text-sm">
            <p>TWILIO_ACCOUNT_SID=your_account_sid</p>
            <p>TWILIO_AUTH_TOKEN=your_auth_token</p>
            <p>TWILIO_PHONE_NUMBER=+1234567890</p>
            <p>TWILIO_NUMBER_POOL=+15551230001,+15551230002,+15551230003</p>
            <p>SMS_MONTHLY_LIMIT_PER_NUMBER=10000</p>
            <p>SMS_RATE_LIMIT_PER_MIN=25</p>
            <p>SMS_QUIET_HOURS_START=8</p>
            <p>SMS_QUIET_HOURS_END=21</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Set your Twilio webhook URL to: <code className="rounded bg-muted px-1">/api/twilio/incoming</code>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phone Provider Health</CardTitle>
          <CardDescription>Last-hour sends per number to monitor rate limiting</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={loadHealth} disabled={loadingHealth}>
            {loadingHealth ? "Loading..." : "Load Health"}
          </Button>
          <div className="mt-3 space-y-2 font-mono text-sm">
            {Object.keys(health).length === 0 ? (
              <p className="text-muted-foreground">No data yet</p>
            ) : (
              Object.entries(health).map(([from, count]) => (
                <div key={from} className="flex items-center justify-between">
                  <span>{from}</span>
                  <span>{count}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ Cache</CardTitle>
          <CardDescription>Manage cached responses to reduce LLM usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input id="faq-search" placeholder="Search canonical question" className="flex-1" />
            <Button
              variant="outline"
              onClick={async () => {
                const q = (document.getElementById("faq-search") as HTMLInputElement).value
                const resp = await fetch(`/api/faq-cache?q=${encodeURIComponent(q)}`)
                const j = await resp.json()
                const list = Array.isArray(j.entries) ? j.entries : []
                alert(`Found ${list.length} entries`)
              }}
            >
              Search
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                const resp = await fetch("/api/faq-cache/seed", { method: "POST" })
                const j = await resp.json()
                alert(resp.ok ? `Seeded ${j.inserted} FAQs` : j.error || "Seed failed")
              }}
            >
              Seed 20 FAQs
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const resp = await fetch("/api/faq-cache")
                const j = await resp.json()
                const list = Array.isArray(j.entries) ? j.entries : []
                alert(`Cache entries: ${list.length}`)
              }}
            >
              List Cache
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <select id="faq-intent" className="rounded border border-border bg-background p-2 text-sm">
              <option value="FAQ_PROCESS">FAQ_PROCESS</option>
              <option value="FAQ_FEES">FAQ_FEES</option>
              <option value="FAQ_TRUST">FAQ_TRUST</option>
              <option value="FAQ_CONTRACT">FAQ_CONTRACT</option>
              <option value="FAQ_GENERAL">FAQ_GENERAL</option>
              <option value="OBJECTION_PRICE">OBJECTION_PRICE</option>
              <option value="OBJECTION_DELAY">OBJECTION_DELAY</option>
            </select>
            <Input id="faq-q" placeholder="Normalized question" className="flex-1" />
            <Input id="faq-a" placeholder="Response text" className="flex-1" />
            <Input id="faq-market" placeholder="Market (optional)" className="w-40" />
            <Button
              variant="outline"
              onClick={async () => {
                const intent = (document.getElementById("faq-intent") as HTMLSelectElement).value
                const normalized_question = (document.getElementById("faq-q") as HTMLInputElement).value.trim().toLowerCase()
                const response_text = (document.getElementById("faq-a") as HTMLInputElement).value
                const market = (document.getElementById("faq-market") as HTMLInputElement).value || undefined
                if (!intent || !normalized_question || !response_text) {
                  alert("Fill all fields")
                  return
                }
                const resp = await fetch("/api/faq-cache", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ intent, normalized_question, response_text, market, canonical_question: normalized_question }),
                })
                const j = await resp.json()
                alert(resp.ok ? "Upserted" : j.error || "Failed")
              }}
            >
              Upsert Cache Entry
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input id="faq-id" placeholder="Entry ID" className="flex-1" />
            <Button
              variant="destructive"
              onClick={async () => {
                const id = (document.getElementById("faq-id") as HTMLInputElement).value
                if (!id) return alert("Provide entry ID")
                const resp = await fetch(`/api/faq-cache?id=${encodeURIComponent(id)}`, { method: "DELETE" })
                const j = await resp.json()
                alert(resp.ok ? "Purged" : j.error || "Failed")
              }}
            >
              Purge Entry
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const id = (document.getElementById("faq-id") as HTMLInputElement).value
                if (!id) return alert("Provide entry ID")
                const resp = await fetch(`/api/faq-cache/warm`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id }),
                })
                const j = await resp.json()
                alert(resp.ok ? "Embedded" : j.error || "Failed")
              }}
            >
              Warm Embedding
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={async () => {
                const resp = await fetch("/api/faq-cache")
                const j = await resp.json()
                const list = Array.isArray(j.entries) ? j.entries : []
                setCacheEntries(list)
              }}
            >
              Load Cache Entries
            </Button>
          </div>
          {cacheEntries.length > 0 && (
            <div className="rounded border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="p-2 text-left">Intent</th>
                    <th className="p-2 text-left">Question</th>
                    <th className="p-2 text-left">Market</th>
                    <th className="p-2 text-left">Usage</th>
                    <th className="p-2 text-left">Last Used</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cacheEntries.map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="p-2">{e.intent}</td>
                      <td className="p-2">{e.canonical_question || e.normalized_question}</td>
                      <td className="p-2">{e.market || "-"}</td>
                      <td className="p-2">{typeof e.usage_count === "number" ? e.usage_count : "-"}</td>
                      <td className="p-2">{e.last_used_at ? new Date(e.last_used_at).toLocaleString() : "-"}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={async () => {
                              await fetch("/api/faq-cache/warm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: e.id }) })
                              alert("Embedded")
                            }}
                          >
                            Warm
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              await fetch(`/api/faq-cache?id=${encodeURIComponent(e.id)}`, { method: "DELETE" })
                              setCacheEntries((prev) => prev.filter((x) => x.id !== e.id))
                            }}
                          >
                            Purge
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract Templates</CardTitle>
          <CardDescription>Upload PDFs to store securely and send via SMS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <input id="tpl-file" type="file" accept="application/pdf" />
            <Input id="tpl-name" placeholder="Template name" />
            <select id="tpl-role" className="rounded border border-border bg-background p-2 text-sm">
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>
            <Input id="tpl-state" placeholder="State (e.g. TX)" className="w-24" />
            <Button
              variant="outline"
              onClick={async () => {
                const fileInput = document.getElementById("tpl-file") as HTMLInputElement
                const nameInput = document.getElementById("tpl-name") as HTMLInputElement
                const roleInput = document.getElementById("tpl-role") as HTMLSelectElement
                const stateInput = document.getElementById("tpl-state") as HTMLInputElement
                if (!fileInput.files?.[0] || !nameInput.value) {
                  alert("Pick a PDF and enter a name")
                  return
                }
                const form = new FormData()
                form.append("file", fileInput.files[0])
                form.append("name", nameInput.value)
                if (roleInput.value) form.append("role", roleInput.value)
                if (stateInput.value) form.append("state", stateInput.value)
                const resp = await fetch("/api/contracts/templates", { method: "POST", body: form })
                const j = await resp.json()
                if (!resp.ok) {
                  alert(j.error || "Upload failed")
                } else {
                  alert("Template uploaded")
                  fileInput.value = ""
                  nameInput.value = ""
                  stateInput.value = ""
                }
              }}
            >
              Upload
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await fetch("/api/contracts/setup", { method: "POST" })
                alert("Bucket initialized")
              }}
            >
              Initialize Bucket
            </Button>
          </div>
          <div className="mt-2">
            <Button
              variant="ghost"
              onClick={async () => {
                const resp = await fetch("/api/contracts/templates")
                const j = await resp.json()
                const list = Array.isArray(j.templates) ? j.templates : []
                alert(`Templates:\n${list.map((t: any) => `${t.name} (${t.storage_path})`).join("\n") || "none"}`)
              }}
            >
              List Templates
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  )
}
