import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

export async function POST() {
  try {
    const supabase = createServiceClient()
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = (buckets || []).some((b) => b.name === "contracts")
    if (!exists) {
      await supabase.storage.createBucket("contracts", { public: false })
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to setup contracts bucket" }, { status: 500 })
  }
}
