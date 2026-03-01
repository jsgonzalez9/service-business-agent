"use client"

import { useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const supabase = createSupabaseBrowser()
      const { error, data } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        try {
          const sess = data?.session || (await supabase.auth.getSession()).data.session
          const at = sess?.access_token
          const rt = sess?.refresh_token
          if (at) {
            const secure = window.location.protocol === "https:" ? "; Secure" : ""
            document.cookie = `sb-access-token=${at}; Path=/; SameSite=Lax${secure}`
          }
          if (rt) {
            const secure = window.location.protocol === "https:" ? "; Secure" : ""
            document.cookie = `sb-refresh-token=${rt}; Path=/; SameSite=Lax${secure}`
          }
        } catch {}
        const next = new URLSearchParams(window.location.search).get("next") || "/dashboard"
        window.location.href = next
      }
    } catch (err: any) {
      setError(err?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  // Dev mode bypass - sets mock auth cookies and redirects
  function devBypass() {
    const secure = window.location.protocol === "https:" ? "; Secure" : ""
    document.cookie = `sb-access-token=dev-token-bypass; Path=/; SameSite=Lax${secure}`
    document.cookie = `sb-refresh-token=dev-refresh-bypass; Path=/; SameSite=Lax${secure}`
    const next = new URLSearchParams(window.location.search).get("next") || "/dashboard"
    window.location.href = next
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 rounded border border-border p-4">
        <h1 className="text-lg font-semibold">Sign in</h1>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div>
          <label className="text-xs text-muted-foreground">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
        
        <div className="pt-2 border-t border-border">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full text-xs"
            onClick={devBypass}
          >
            🚧 Dev Mode - Bypass Login
          </Button>
        </div>
      </form>
    </div>
  )
}
