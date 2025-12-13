import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { normalizeQuestion } from "@/lib/cache-router"

const SEEDS: Array<{ intent: string; q: string; a: string }> = [
  { intent: "FAQ_PROCESS", q: "How does this process work?", a: "We purchase homes directly for cash. You tell us about the property, we evaluate it, and if it’s a fit we make a no-obligation cash offer. If you accept, we handle the paperwork and close on your timeline." },
  { intent: "FAQ_GENERAL", q: "Are you a realtor?", a: "No. We are not realtors and we don’t list homes on the MLS. We buy properties directly, which allows for faster closings and fewer steps." },
  { intent: "FAQ_FEES", q: "Do I have to pay any fees or commissions?", a: "No. There are no commissions, agent fees, or hidden costs. The offer we make is the amount you receive at closing." },
  { intent: "FAQ_PROCESS", q: "How fast can you close?", a: "Closings typically happen in as little as 7–14 days, but we can adjust to your preferred timeline if you need more time." },
  { intent: "FAQ_TRUST", q: "Is this a legitimate company or a scam?", a: "Yes, we’re a legitimate home-buying company. We use standard purchase agreements and licensed title companies to handle the closing safely and transparently." },
  { intent: "FAQ_PROCESS", q: "What types of properties do you buy?", a: "We buy single-family homes, condos, townhomes, and small multi-family properties — even if they need repairs or updates." },
  { intent: "FAQ_PROCESS", q: "Do you buy houses that need repairs?", a: "Yes. We buy properties as-is, so you don’t need to fix anything or clean the property before selling." },
  { intent: "FAQ_PROCESS", q: "Will you need to visit the property?", a: "In many cases we can make an offer remotely. Occasionally we may request a walkthrough or inspection to confirm details, but we work around your schedule." },
  { intent: "FAQ_PROCESS", q: "Am I obligated to accept your offer?", a: "No. Our offers are completely no-obligation. You’re free to accept, decline, or explore other options." },
  { intent: "FAQ_PROCESS", q: "How do you determine the offer price?", a: "We look at recent comparable sales, the property’s condition, and current market demand to arrive at a fair cash offer." },
  { intent: "FAQ_PROCESS", q: "What happens after I accept the offer?", a: "Once you accept, we open escrow with a licensed title company. They handle the paperwork, title search, and closing, and you get paid at closing." },
  { intent: "FAQ_PROCESS", q: "Do you pay cash?", a: "Yes. We use cash or cash-equivalent funding, so financing delays are not an issue." },
  { intent: "FAQ_PROCESS", q: "Can I choose my closing date?", a: "Yes. We work around your preferred closing timeline whenever possible." },
  { intent: "FAQ_GENERAL", q: "What if the property has tenants?", a: "That’s usually not a problem. We can often purchase tenant-occupied properties and work around existing leases." },
  { intent: "FAQ_GENERAL", q: "What if I owe money on the house?", a: "That’s fine. Any existing mortgage or liens are typically paid off at closing through the title company." },
  { intent: "FAQ_CONTRACT", q: "Can I back out after signing?", a: "Most contracts include an inspection or due-diligence period that allows you to cancel without penalty. We’ll explain the terms clearly before you sign." },
  { intent: "FAQ_TRUST", q: "Who handles the paperwork?", a: "The title company prepares and manages all legal paperwork to ensure a smooth and secure transaction." },
  { intent: "FAQ_TRUST", q: "Will my information be shared or sold?", a: "No. Your information is only used to evaluate your property and complete the transaction if you move forward." },
  { intent: "FAQ_PROCESS", q: "Do you buy inherited or probate properties?", a: "Yes. We frequently work with inherited and probate properties and can help guide you through the process." },
  { intent: "FAQ_PROCESS", q: "Why should I sell this way instead of listing?", a: "Selling directly avoids showings, repairs, agent commissions, and long timelines. It’s designed for speed, convenience, and certainty." },
]

export async function POST() {
  const supabase = await createClient()
  for (const s of SEEDS) {
    const norm = normalizeQuestion(s.q)
    await supabase
      .from("cached_responses")
      .upsert({ intent: s.intent, normalized_question: norm, response_text: s.a, updated_at: new Date().toISOString() }, { onConflict: "intent,normalized_question" })
  }
  return NextResponse.json({ success: true, inserted: SEEDS.length })
}
