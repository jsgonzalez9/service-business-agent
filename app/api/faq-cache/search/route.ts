import { NextRequest, NextResponse } from "next/server"
import { normalizeQuestion, classifyIntent, lookupCached } from "@/lib/cache-router"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || ""
  const intentParam = req.nextUrl.searchParams.get("intent")
  const intent = (intentParam as any) || classifyIntent(q)
  const norm = normalizeQuestion(q)
  const { text, confidence } = await lookupCached(intent, norm)
  return NextResponse.json({ text, confidence, intent })
}
