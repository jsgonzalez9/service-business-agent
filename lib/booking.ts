import { createClient } from "@/lib/supabase/server"

export interface TimeSlot {
  start: string // ISO string
  end: string   // ISO string
}

export async function getNextAvailableSlots(daysToCheck = 3): Promise<TimeSlot[]> {
  // In a real implementation, this would query Google Calendar / Calendly
  // For now, we generate mock slots for the next few business days (M-F, 9-5)
  
  const slots: TimeSlot[] = []
  const now = new Date()
  let current = new Date(now)
  current.setDate(current.getDate() + 1) // Start from tomorrow
  current.setHours(9, 0, 0, 0)

  let daysCount = 0
  
  while (daysCount < daysToCheck) {
    // Skip weekends
    if (current.getDay() === 0 || current.getDay() === 6) {
      current.setDate(current.getDate() + 1)
      continue
    }

    // Generate 3 slots per day: 9am, 1pm, 3pm
    const slotTimes = [9, 13, 15]
    
    for (const hour of slotTimes) {
      const start = new Date(current)
      start.setHours(hour, 0, 0, 0)
      
      const end = new Date(start)
      end.setHours(hour + 1, 0, 0, 0)
      
      slots.push({
        start: start.toISOString(),
        end: end.toISOString()
      })
    }

    current.setDate(current.getDate() + 1)
    daysCount++
  }

  return slots
}

export function formatSlotsForPrompt(slots: TimeSlot[]): string {
  // Format as "Tuesday, Oct 10 at 9:00 AM", etc.
  return slots.map(slot => {
    const d = new Date(slot.start)
    return d.toLocaleString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    })
  }).join('\n- ')
}

export async function createBooking(leadId: string, time: string, description: string) {
    const supabase = await createClient()
    
    // In a real app, we would insert into a 'bookings' table
    // For now, we'll just log it to the lead's notes or a separate log
    console.log(`[BOOKING CREATED] Lead: ${leadId}, Time: ${time}, Desc: ${description}`)
    
    // Update lead notes to reflect booking
    const { data: lead } = await supabase.from('leads').select('notes').eq('id', leadId).single()
    const newNotes = (lead?.notes || "") + `\n\n[BOOKING CONFIRMED] ${time} - ${description}`
    
    await supabase.from('leads').update({ notes: newNotes }).eq('id', leadId)
    
    return { success: true }
}
