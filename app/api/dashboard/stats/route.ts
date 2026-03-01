import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total leads count
    const { count: totalLeads, error: countError } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error fetching leads count:", countError)
      return NextResponse.json(
        { error: "Failed to fetch leads count" },
        { status: 500 }
      )
    }

    // Get leads by conversation state
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select("conversation_state")

    if (leadsError) {
      console.error("Error fetching leads:", leadsError)
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 }
      )
    }

    // Calculate service business metrics
    // Map wholesaling states to service business concepts
    const total = totalLeads || 0
    
    // Consider leads "booked" if they're in advanced states
    const bookedStates = ['qualified', 'offer_made', 'offer_accepted', 'contract_sent', 'contract_signed', 'closed']
    const appointmentsBooked = leads?.filter(l => bookedStates.includes(l.conversation_state)).length || 0
    
    // Calculate booking rate
    const bookingRate = total > 0 ? Math.round((appointmentsBooked / total) * 100) : 0
    
    // Estimate potential revenue ($500 avg service value per booked lead)
    const avgServiceValue = 500
    const potentialRevenue = appointmentsBooked * avgServiceValue

    return NextResponse.json({
      total_leads: total,
      appointments_booked: appointmentsBooked,
      booking_rate: bookingRate,
      potential_revenue: potentialRevenue
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}