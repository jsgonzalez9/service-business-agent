"use client"

import { Button } from "@/components/ui/button"
import { createSupabaseBrowser } from "@/lib/supabase/client"

export default function AuthBar() {
  async function signOut() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    try {
      const secure = window.location.protocol === "https:" ? "; Secure" : ""
      document.cookie = `sb-access-token=; Path=/; Max-Age=0; SameSite=Lax${secure}`
      document.cookie = `sb-refresh-token=; Path=/; Max-Age=0; SameSite=Lax${secure}`
    } catch {}
    window.location.href = "/login"
  }
  return (
    <div className="fixed top-2 right-2">
      <Button variant="outline" onClick={signOut}>Sign out</Button>
    </div>
  )
}
