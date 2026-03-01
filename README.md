# AI Voice Wholesaling MVP

## Setup
- Create a Supabase project and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Set Twilio env: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, optional `TWILIO_NUMBER_POOL`.
- Optional A2P: set `TWILIO_A2P_ENABLED=true` to submit Brand/Campaign to Twilio.
- OpenAI for summaries: `OPENAI_API_KEY`.
- Notifications: `ADMIN_NOTIFY_PHONE`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- Copy `.env.example` to `.env.local` and fill values.

## Voice Agent (Vapi-Compatible)

### Overview
This system implements a voice agent compatible with Vapi/Elliot standards:
- AI disclosure in first 10 seconds
- Structured qualification extraction
- Wrong number/bad time handling
- Vapi-compatible API format for n8n integration

### Voice Agent Features
- **AI Disclosure:** Agent introduces as AI within first message
- **Qualification Sequence:** Extracts 6 key fields (interest, motivation, urgency, experience, budget, paid intent)
- **Smart Handling:** Wrong number detection, callback scheduling, voicemail detection
- **Structured Outputs:** GPT-4o extracts qualification data from transcripts

### API Endpoints

#### Initiate Outbound Call (Vapi-Compatible)
```
POST /api/twilio/voice/outbound
```

**Request:**
```json
{
  "customer": {
    "number": "+15551234567",
    "name": "John Doe"
  },
  "assistantOverrides": {
    "variableValues": {
      "lead_name": "John Doe",
      "lead_company_name": "Acme Inc",
      "lead_request": "AI automation help"
    }
  }
}
```

**Response:**
```json
{
  "id": "call-uuid",
  "status": "ringing",
  "customer": { "number": "+15551234567" },
  "startedAt": "2026-02-28T11:00:00Z"
}
```

#### Poll Call Status
```
GET /api/calls/status?id={callId}
```

**Response:**
```json
{
  "id": "call-uuid",
  "status": "completed",
  "endedReason": "completed",
  "duration": 180,
  "artifacts": {
    "structuredOutputs": {
      "interest_level": "high",
      "motivation": "Wants to automate lead follow-up",
      "urgency": "this_month",
      "past_experience": "Tried Zapier before",
      "budget": "confirmed",
      "paid_intent": true
    }
  }
}
```

### Database Schema
Voice qualification fields (added via migration `045_add_voice_qualifications.sql`):
- `interest_level` - high/medium/low/none
- `motivation` - why they want the service
- `urgency` - timeline (this_week/this_month/etc)
- `past_experience` - prior AI/automation experience
- `budget` - budget status
- `paid_intent` - willing to pay for scoping
- `ended_reason` - call completion reason

### n8n Integration
The voice agent follows Vapi/Elliot workflow:
1. Form trigger → Code node (normalize phone)
2. HTTP POST to `/api/twilio/voice/outbound`
3. Wait 60s
4. Poll `GET /api/calls/status?id={callId}` until status=ended
5. Extract data from `artifacts.structuredOutputs`
6. Route based on `endedReason` (voicemail, completed, etc.)
7. Log to Airtable

### Voice Agent Prompt Structure
The AI agent (`lib/voice-agent-updated.ts`) follows strict rules:
- Identifies as AI assistant in first message
- Asks one qualification question at a time
- Handles wrong number, bad time, not interested
- Ends call after gathering all 6 qualification fields
- Maximum call duration: 5 minutes

### Testing Voice Flow
See `tests/voice-agent-integration.test.ts` for automated tests.

**Manual test:**
1. Add test lead with phone number
2. Call POST `/api/twilio/voice/outbound` with test lead
3. Answer call → verify AI introduction
4. Complete qualification sequence
5. Check `/api/calls/status?id={callId}` for structured output

## Migrations
- Visit `/setup` in the app, run migrations via the button.

## Development
- `pnpm dev` to run locally.
- Configure Twilio webhook to `https://your-app/api/twilio/incoming` and status `https://your-app/api/twilio/status`.

## Features
- A2P Brand/Campaign workflow (DB + API + dashboard).
- SMS deliverability: number pooling, rate limiting, quiet hours, status tracking in `sms_events`.
- Compliance: STOP/UNSUBSCRIBE detection and suppression, footer disclosures.
- Health monitor dashboard for per-number sends.
- CRM pipeline fields (`pipeline_status`, `tags`, `score`), CSV export.
- Follow-up sequences with queue retries/backoff; admin dashboard for pending.
- HOT lead notifications (SMS/Telegram), notifications dashboard.
- Real-time message thread UI via Supabase Realtime.
- Deal tools: MAO calculator with presets; conversation summary generation.
- Property photos: table + simple API to attach URLs.

## Testing
- Manual checks:
  - Use dashboard pages to submit A2P brand/campaign.
  - Send inbound SMS to Twilio webhook and observe responses and opt-out handling.
  - Run follow-up batch from dashboard.
  - Generate conversation summary from lead panel.

## Notes
- Avoid sending during quiet hours; rate limit configured via env.
- All tables use permissive RLS for MVP; tighten in production.
