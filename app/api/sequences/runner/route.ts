import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendSMS, getTwilioClient, eligibleNumbersSorted } from "@/lib/twilio"

export async function runOnce() {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data: enrollments } = await supabase
    .from("lead_sequences")
    .select("*")
    .eq("completed", false)
    .lte("next_run_at", now)
    .limit(100)
  for (const ls of enrollments || []) {
    if ((ls as any).disabled) continue
    const { data: lead } = await supabase.from("leads").select("*").eq("id", (ls as any).lead_id).single()
    if (lead && ((lead as any).is_opted_out || (lead as any).pipeline_status === "DEAD")) {
      await supabase.from("lead_sequences").update({ completed: true, disabled: true }).eq("id", (ls as any).id)
      continue
    }
    const { data: steps } = await supabase
      .from("sequence_steps")
      .select("*")
      .eq("sequence_id", (ls as any).sequence_id)
      .eq("step_index", (ls as any).current_step_index)
      .eq("active", true)
      .limit(1)
    const step = steps?.[0]
    if (!step) {
      await supabase.from("lead_sequences").update({ completed: true }).eq("id", (ls as any).id)
      continue
    }
    let recentInbound = false
    try {
      const since = new Date(Date.now() - Number(process.env.SEQUENCE_REPLY_PAUSE_MINUTES || 720) * 60_000).toISOString()
      const { data: inbound } = await supabase
        .from("messages")
        .select("*")
        .eq("lead_id", (ls as any).lead_id)
        .eq("direction", "inbound")
        .gte("created_at", since)
        .limit(1)
      recentInbound = !!(inbound && inbound.length > 0)
    } catch {}
    if (recentInbound && step.type === "sms") {
      await supabase.from("lead_sequence_steps").insert({
        lead_sequence_id: (ls as any).id,
        step_index: step.step_index,
        status: "skipped",
        metadata: { reason: "recent_inbound" },
      })
      const { data: allStepsSkip } = await supabase
        .from("sequence_steps")
        .select("*")
        .eq("sequence_id", (ls as any).sequence_id)
        .eq("active", true)
      const nextIndexSkip = (ls as any).current_step_index + 1
      const nextSkip = (allStepsSkip || []).find((s: any) => s.step_index === nextIndexSkip)
      const delaySkip = (nextSkip?.delay_minutes as number) || 0
      const nextRunSkip = new Date(Date.now() + delaySkip * 60_000).toISOString()
      await supabase
        .from("lead_sequences")
        .update({ current_step_index: nextIndexSkip, next_run_at: nextRunSkip, retry_count: 0 })
        .eq("id", (ls as any).id)
      continue
    }
    let status = "pending"
    let meta: any = {}
    try {
      if (step.type === "sms") {
        const resp = await sendSMS((lead as any).phone_number, step.message || "")
        status = resp.error ? "error" : "sent"
        meta = { sid: resp.sid, error: resp.error || null }
      } else if (step.type === "voicemail") {
        const client = getTwilioClient()
        if (!client) throw new Error("Twilio missing")
        const candidates = await eligibleNumbersSorted()
        const fromNumber = candidates[0]
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/twilio/sequences/voicemail?recording_url=${encodeURIComponent(step.recording_url || "")}`
        const call = await client.calls.create({
          to: (lead as any).phone_number,
          from: fromNumber,
          url: callbackUrl,
          machineDetection: "Enable",
        })
        status = "queued"
        meta = { call_sid: call.sid }
      }
    } catch (e: any) {
      status = "error"
      meta = { error: e?.message || "send failed" }
    }
    await supabase.from("lead_sequence_steps").insert({
      lead_sequence_id: (ls as any).id,
      step_index: step.step_index,
      status,
      metadata: meta,
    })
    if (status === "error") {
      const retryBase = Number(process.env.SEQUENCE_RETRY_BASE_MINUTES || 5)
      const currRetry = Number((ls as any).retry_count || 0)
      const maxRetry = step.type === "sms" ? 2 : 1
      const nextRetry = currRetry + 1
      const nextDelayMinutes = retryBase * Math.pow(2, currRetry)
      const nextRunRetry = new Date(Date.now() + nextDelayMinutes * 60_000).toISOString()
      const newFailStreak = Number((ls as any).fail_streak || 0) + 1
      if (nextRetry <= maxRetry) {
        await supabase
          .from("lead_sequences")
          .update({ retry_count: nextRetry, fail_streak: newFailStreak, next_run_at: nextRunRetry })
          .eq("id", (ls as any).id)
        continue
      } else {
        if (newFailStreak >= 5) {
          await supabase.from("lead_sequences").update({ completed: true, disabled: true }).eq("id", (ls as any).id)
          continue
        }
        await supabase
          .from("lead_sequences")
          .update({ retry_count: 0, fail_streak: newFailStreak })
          .eq("id", (ls as any).id)
      }
    } else {
      await supabase.from("lead_sequences").update({ retry_count: 0, fail_streak: 0 }).eq("id", (ls as any).id)
    }
    const { data: allSteps } = await supabase
      .from("sequence_steps")
      .select("*")
      .eq("sequence_id", (ls as any).sequence_id)
      .eq("active", true)
    const maxIndex = Math.max(...(allSteps || []).map((s: any) => s.step_index), 0)
    const final = (ls as any).current_step_index >= maxIndex
    if (final) {
      await supabase.from("lead_sequences").update({ completed: true }).eq("id", (ls as any).id)
    } else {
      const nextIndex = (ls as any).current_step_index + 1
      const next = (allSteps || []).find((s: any) => s.step_index === nextIndex)
      const delay = (next?.delay_minutes as number) || 0
      const nextRun = new Date(Date.now() + delay * 60_000).toISOString()
      await supabase.from("lead_sequences").update({ current_step_index: nextIndex, next_run_at: nextRun }).eq("id", (ls as any).id)
    }
  }
}

export async function GET() {
  try {
    await runOnce()
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Runner failed" }, { status: 500 })
  }
}

export const runtime = "nodejs"
export const schedule = "*/1 * * * *"
export default async function handler() {
  await runOnce()
  return NextResponse.json({ success: true })
}
