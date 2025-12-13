import { type NextRequest, NextResponse } from "next/server"
import { getLeadByPhone, saveMessage, updateLead } from "@/lib/lead-actions"
import { generateAgentResponse, getAgentConfig } from "@/lib/wholesaling-agent"
import { sendSMS } from "@/lib/twilio"
import { triggerVoiceCall } from "@/lib/voice-call-actions"
import { notifyHotLead } from "@/lib/notify"
import { deriveTagsFromMessage } from "@/lib/tagging"
import { createClient } from "@/lib/supabase/server"
import { classifyIntent, normalizeQuestion, lookupCached, storeCached } from "@/lib/cache-router"
import { findCachedByEmbedding } from "@/lib/llm-cache"

export async function POST(request: NextRequest) {
  try {
    // Parse the form data from Twilio
    const formData = await request.formData()
    const from = formData.get("From") as string
    const body = formData.get("Body") as string
    const messageSid = formData.get("MessageSid") as string

    console.log(`[Incoming SMS] From: ${from}, Message: ${body}`)

    if (!from || !body) {
      return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { "Content-Type": "text/xml" },
      })
    }

    // Buyer replies: map From to recent buyer broadcast to capture interest/offers
    try {
      const supabase = await createClient()
      const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
      const { data: bb } = await supabase
        .from("buyer_broadcasts")
        .select("*")
        .eq("to_phone", from)
        .gte("sent_at", since)
        .order("sent_at", { ascending: false })
        .limit(1)
      const candidate = (bb || [])[0]
      if (candidate && candidate.lead_id) {
        const amtMatch = body.match(/\$?\s*([0-9]{2,3}(?:[,][0-9]{3})*(?:\.[0-9]{2})?)/)
        const isInterested = /\b(yes|interested|i'm in|count me in)\b/i.test(body)
        const offerAmount = amtMatch ? Number(String(amtMatch[1]).replace(/,/g, "")) : null
        const { data: leadRow } = await supabase.from("leads").select("offers_received,best_assignment_fee").eq("id", candidate.lead_id).single()
        const updates: any = { offers_received: ((leadRow?.offers_received as number) || 0) + 1 }
        if (offerAmount && (!leadRow?.best_assignment_fee || offerAmount > Number(leadRow.best_assignment_fee))) {
          updates.best_assignment_fee = offerAmount
        }
        await supabase.from("leads").update(updates).eq("id", candidate.lead_id)
        await supabase.from("buyer_offers").insert({
          lead_id: candidate.lead_id,
          buyer_id: candidate.buyer_id || null,
          from_phone: from,
          amount: offerAmount,
          notes: isInterested ? "interested" : null,
        })
        return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
          headers: { "Content-Type": "text/xml" },
        })
      }
    } catch {}

    // Find the lead by phone number
    const lead = await getLeadByPhone(from)

    if (!lead) {
      console.log(`No lead found for phone: ${from}`)
      // Return empty TwiML response - we don't respond to unknown numbers
      return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { "Content-Type": "text/xml" },
      })
    }

    // Don't respond if contract is already signed
    if (lead.conversation_state === "contract_signed" || lead.conversation_state === "closed") {
      return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { "Content-Type": "text/xml" },
      })
    }

    // Save the incoming message
    await saveMessage({
      lead_id: lead.id,
      direction: "inbound",
      content: body,
      twilio_sid: messageSid,
    })

    const lower = body.trim().toLowerCase()
    const isOptOut =
      lower === "stop" ||
      lower.includes("unsubscribe") ||
      lower.includes("cancel") ||
      lower === "end" ||
      lower === "quit" ||
      lower.includes("stop all") ||
      lower.includes("do not text")

    const isOptIn =
      lower === "start" ||
      lower === "yes" ||
      lower === "y" ||
      lower.includes("unstop") ||
      lower.includes("subscribe")
    if (isOptOut) {
      await updateLead(lead.id, { is_opted_out: true, opted_out_at: new Date().toISOString(), optout_reason: "keyword" })
      await saveMessage({
        lead_id: lead.id,
        direction: "outbound",
        content: "You’ve been unsubscribed — no more messages.",
      })
      const { error: smsError } = await sendSMS(lead.phone_number, "You’ve been unsubscribed — no more messages.", {
        withFooter: false,
        bypassSuppression: true,
      })
      try {
        const supabase = await createClient()
        await supabase
          .from("consents")
          .insert({ lead_id: lead.id, phone_number: lead.phone_number, event: "opt_out", source: "keyword", message_sid: messageSid })
      } catch {}
      if (smsError) {
        console.error("Failed to send opt-out confirmation:", smsError)
      }
      return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { "Content-Type": "text/xml" },
      })
    }
    if (isOptIn) {
      await updateLead(lead.id, {
        is_opted_out: false,
        optout_reason: null,
        consent_status: "opt_in" as any,
        consented_at: new Date().toISOString(),
        consent_source: "keyword",
      } as any)
      try {
        const supabase = await createClient()
        await supabase
          .from("consents")
          .insert({ lead_id: lead.id, phone_number: lead.phone_number, event: "opt_in", source: "keyword", message_sid: messageSid })
      } catch {}
      await saveMessage({
        lead_id: lead.id,
        direction: "outbound",
        content: "Thanks for confirming — we’ll text you about your property. Reply STOP to unsubscribe.",
      })
      await sendSMS(lead.phone_number, "Thanks for confirming — we'll text you about your property. Reply STOP to unsubscribe.", {
        withFooter: false,
        bypassSuppression: true,
      })
      return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { "Content-Type": "text/xml" },
      })
    }
    if (lower === "help" || lower.includes("help")) {
      await saveMessage({
        lead_id: lead.id,
        direction: "outbound",
        content:
          "Help: We send messages about property offers. Msg&Data rates may apply. Reply STOP to unsubscribe. For support, reply here.",
      })
      await sendSMS(lead.phone_number, "Help: We send messages about property offers. Reply STOP to unsubscribe.", {
        withFooter: false,
        bypassSuppression: true,
      })
      return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { "Content-Type": "text/xml" },
      })
    }

    const deadPhrases = [
      "not interested",
      "stop contacting me",
      "wrong number",
      "nla",
      "remove me",
      "sold already",
      "do not contact",
      "no longer available",
      "not selling",
      "leave me alone",
    ]
    const isDead = deadPhrases.some((p) => lower.includes(p))
    if (isDead) {
      await updateLead(lead.id, { pipeline_status: "DEAD", score: 0, tags: Array.from(new Set([...(lead.tags || []), "dead"])) })
      return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { "Content-Type": "text/xml" },
      })
    }

    // Update state if this is first response from a cold lead
    if (lead.conversation_state === "cold_lead" || lead.conversation_state === "contacted") {
      await updateLead(lead.id, { conversation_state: "contacted" })
      lead.conversation_state = "contacted"
    }

    // Get agent config
    const config = await getAgentConfig()
    // Cache Router: prefer FAQ cached responses when possible (if enabled)
    const intent = classifyIntent(body)
    let responseMessage: string | null = null
    if (config.llm_cache_enabled !== false && intent.startsWith("FAQ")) {
      const norm = normalizeQuestion(body)
      const { text, confidence } = await lookupCached(intent as any, norm)
      if (text && confidence >= 0.85) {
        responseMessage = text
      } else {
        let floor = typeof config.llm_cache_confidence_floor === "number" ? config.llm_cache_confidence_floor : 0.85
        let ttlDays = intent.startsWith("FAQ")
          ? (config.llm_cache_ttl_faq_days as number) ?? 30
          : (config.llm_cache_ttl_objection_days as number) ?? 14
        const market = lead.state || undefined
        const overrides = (config.llm_cache_market_overrides || {}) as any
        if (market && overrides[market]) {
          floor = overrides[market].confidence_floor ?? floor
          ttlDays = intent.startsWith("FAQ")
            ? overrides[market].ttl_faq_days ?? ttlDays
            : overrides[market].ttl_objection_days ?? ttlDays
        }
        const emb = await findCachedByEmbedding(intent, body, market, floor, ttlDays)
        if (emb.text && emb.confidence >= 0.85) responseMessage = emb.text
      }
    }
    const response = responseMessage
      ? { message: responseMessage, modelUsed: null, escalated: false, updatedLead: {}, newState: null, callIntent: null }
      : await generateAgentResponse(lead, body, config)

    console.log(`[AI Response] Model: ${response.modelUsed}, Escalated: ${response.escalated}`)

    // Update lead with extracted information
    if (Object.keys(response.updatedLead).length > 0) {
      await updateLead(lead.id, response.updatedLead)
    }
    const newTags = deriveTagsFromMessage(body)
    if (newTags.length > 0) {
      await updateLead(lead.id, { tags: Array.from(new Set([...(lead.tags || []), ...newTags])) })
    }

    // Update conversation state if changed
    if (response.newState) {
      await updateLead(lead.id, { conversation_state: response.newState })
    }

    if (response.callIntent?.action === "update_lead_status" && response.callIntent?.lead_status) {
      console.log(
        `[Call Intent Detected] Lead: ${lead.id}, Status: ${response.callIntent.lead_status}, Time: ${response.callIntent.call_time || "immediate"}`,
      )

      // Update lead status to call intent status
      await updateLead(lead.id, {
        conversation_state: response.callIntent.lead_status,
      })

      // If not text_only, trigger voice call
      if (response.callIntent.lead_status !== "text_only") {
        try {
          await triggerVoiceCall(lead.id, response.callIntent.lead_status, response.callIntent.call_time)
          console.log(`[Voice Call Triggered] for lead: ${lead.id}`)
        } catch (error) {
          console.error(`[Voice Call Error] Failed to trigger call for lead ${lead.id}:`, error)
        }
      }
    }

    const hotStates = new Set(["offer_made", "offer_accepted", "contract_sent", "ready_for_offer_call", "warm_call_requested", "schedule_call"])
    const becameHot =
      response.escalated ||
      (response.newState && hotStates.has(response.newState)) ||
      (response.callIntent?.lead_status && hotStates.has(response.callIntent.lead_status))
    if (becameHot) {
      await updateLead(lead.id, { pipeline_status: "HOT", score: 5 })
      await notifyHotLead({ id: lead.id, name: lead.name, phone_number: lead.phone_number, address: lead.address })
    }

    // Persist new FAQ cache entries when applicable
    if (!responseMessage && intent.startsWith("FAQ")) {
      const normalized = normalizeQuestion(body)
      await storeCached(intent as any, normalized, response.message)
    }

    // Send the response via Twilio
    const { sid: outgoingSid, error } = await sendSMS(from, response.message)

    if (error) {
      console.error("Failed to send SMS:", error)
    }

    const savedModel = (response.modelUsed === "gpt-5.1" ? "gpt-5" : response.modelUsed) as "gpt-5-mini" | "gpt-5" | null
    await saveMessage({
      lead_id: lead.id,
      direction: "outbound",
      content: response.message,
      twilio_sid: outgoingSid || undefined,
      model_used: responseMessage ? null : savedModel || null,
      was_escalated: response.escalated,
    })
    try {
      const supabase = await createClient()
      await supabase
        .from("message_metrics")
        .insert({ lead_id: lead.id, model: response.modelUsed || null, tokens: null, cost: null, confidence: responseMessage ? 1.0 : 0.75 })
    } catch {}

    // Return empty TwiML since we're sending via API
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      headers: { "Content-Type": "text/xml" },
    })
  } catch (error) {
    console.error("Error processing incoming SMS:", error)
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      headers: { "Content-Type": "text/xml" },
    })
  }
}
